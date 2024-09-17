import path from 'path';
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import 'source-map-support/register';
import Database from 'better-sqlite3';
import fs from 'fs';

// Define the path to the SQLite database file
const dbFilePath = path.join(app.getPath('userData'), 'data.db');

// Ensure the database file exists
if (!fs.existsSync(dbFilePath)) {
  fs.writeFileSync(dbFilePath, '');
}

// Initialize the SQLite database
const db = new Database(dbFilePath);

// Enable foreign key constraints
db.pragma('foreign_keys = ON');

// Create the 'users' table if it doesn't exist
db.prepare(
  `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    surname TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('doctor', 'patient')),
    specialty TEXT
  )
  `
).run();

// Create the 'appointments' table if it doesn't exist
db.prepare(
  `
  CREATE TABLE IF NOT EXISTS appointments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    time TEXT NOT NULL,
    doctorID INTEGER NOT NULL,
    patientID INTEGER NOT NULL,
    FOREIGN KEY (doctorID) REFERENCES users(id),
    FOREIGN KEY (patientID) REFERENCES users(id)
  )
`,
).run();

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

// IPC Handlers for Electron's Main Process

// Get all users with their appointments
ipcMain.handle('get-users', async () => {
  // Fetch all users from the 'users' table
  const users = db.prepare('SELECT * FROM users').all() as {
    id: number;
    name: string;
    surname: string;
    role: string;
    specialty: string | null;
    phone_number: string;
    email: string | null;
  }[];

  // Prepare a statement to fetch appointments for a user
  const getAppointments = db.prepare(`
    SELECT 
      appointments.id,
      appointments.time,
      appointments.doctorID,
      appointments.patientID
    FROM appointments
    WHERE appointments.doctorID = ? OR appointments.patientID = ?
  `);

  // For each user, fetch their appointments and attach them
  const usersWithAppointments = users.map((user: { id: number }) => {
    const appointments = getAppointments.all(user.id, user.id);
    return { ...user, appointments };
  });

  return usersWithAppointments;
});

// Get all appointments with doctor and patient details
ipcMain.handle('get-appointments', async () => {
  const appointments = db
    .prepare(
      `
    SELECT 
      appointments.id,
      appointments.time,
      appointments.doctorID,
      doctor.name AS doctorName,
      doctor.surname AS doctorSurname,
      doctor.specialty AS doctorSpecialty,
      doctor.phone_number AS doctorPhoneNumber,
      doctor.email AS doctorEmail,
      appointments.patientID,
      patient.name AS patientName,
      patient.surname AS patientSurname,
      patient.phone_number AS patientPhoneNumber,
      patient.email AS patientEmail
    FROM appointments
    JOIN users AS doctor ON appointments.doctorID = doctor.id
    JOIN users AS patient ON appointments.patientID = patient.id
  `,
    )
    .all();

  return appointments;
});

// Add a new user
ipcMain.handle('add-user', async (event, user) => {
  const insert = db.prepare(`
    INSERT INTO users (name, surname, role, specialty, phone_number, email) 
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  const result = insert.run(
    user.name,
    user.surname,
    user.role,
    user.specialty || null,
    user.phone_number,
    user.email || null,
  );

  // Return the newly created user with the generated ID
  return {
    id: result.lastInsertRowid,
    ...user,
  };
});

// Add a new appointment
ipcMain.handle('add-appointment', async (event, appointment) => {
  // Validate that the doctor exists and has the 'doctor' role
  const doctor = db
    .prepare('SELECT * FROM users WHERE id = ? AND role = ?')
    .get(appointment.doctorID, 'doctor');

  // Validate that the patient exists and has the 'patient' role
  const patient = db
    .prepare('SELECT * FROM users WHERE id = ? AND role = ?')
    .get(appointment.patientID, 'patient');

  if (doctor && patient) {
    // Insert the new appointment into the 'appointments' table
    const insert = db.prepare(
      'INSERT INTO appointments (time, doctorID, patientID) VALUES (?, ?, ?)',
    );
    const result = insert.run(
      appointment.time,
      appointment.doctorID,
      appointment.patientID,
    );

    // Return the newly created appointment with the generated ID
    return {
      id: result.lastInsertRowid,
      time: appointment.time,
      doctorID: appointment.doctorID,
      patientID: appointment.patientID,
    };
  } else {
    throw new Error('Doctor or Patient not found.');
  }
});

// Get a user by ID with their appointments
ipcMain.handle('get-user-with-appointments', async (event, userId) => {
  // Get the user
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);

  if (user) {
    // Get the appointments for the user
    const appointments = db
      .prepare(
        `
      SELECT 
        appointments.id,
        appointments.time,
        appointments.doctorID,
        appointments.patientID
      FROM appointments
      WHERE appointments.doctorID = ? OR appointments.patientID = ?
    `,
      )
      .all(userId, userId);

    return {
      ...user,
      appointments,
    };
  } else {
    throw new Error('User not found.');
  }
});

let mainWindow: BrowserWindow | null = null;

const createWindow = async () => {
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 728,
    webPreferences:
      process.env.NODE_ENV === 'development' || process.env.E2E_BUILD === 'true'
        ? {
            nodeIntegration: true,
            contextIsolation: false,
          }
        : {
            preload: path.join(__dirname, 'dist/renderer.prod.js'),
          },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
