import { app, ipcMain } from 'electron';
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(app.getPath('userData'), 'data.json');

// Ensure the data file exists and initialize it if not
if (!fs.existsSync(dataFilePath)) {
  fs.writeFileSync(
    dataFilePath,
    JSON.stringify({ users: [], appointments: [] }, null, 2),
  );
}

// Utility function to read the JSON data
function readDataFile() {
  const data = fs.readFileSync(dataFilePath, 'utf-8');
  return JSON.parse(data);
}

// Utility function to write to the JSON file
function writeDataFile(data: any) {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
}

// Function to generate a unique ID for appointments
function generateAppointmentID() {
  const data = readDataFile();
  return data.appointments.length > 0
    ? data.appointments[data.appointments.length - 1].id + 1
    : 1;
}

// IPC Handlers for Electron's Main Process

// Get all users
ipcMain.handle('get-users', async () => {
  const data = readDataFile();
  return data.users;
});

// Get all appointments
ipcMain.handle('get-appointments', async () => {
  const data = readDataFile();
  return data.appointments;
});

// Add a new user
ipcMain.handle('add-user', async (event, user) => {
  const data = readDataFile();
  data.users.push(user);
  writeDataFile(data);
});

// Add an appointment with a unique ID
ipcMain.handle('add-appointment', async (event, appointment) => {
  const data = readDataFile();

  const doctor = data.users.find(
    (user: any) => user.id === appointment.doctorID && user.role === 'doctor',
  );
  const patient = data.users.find(
    (user: any) => user.id === appointment.patientID && user.role === 'patient',
  );

  if (doctor && patient) {
    const newAppointment = {
      id: generateAppointmentID(),
      time: appointment.time,
      doctorID: doctor.id,
      patientID: patient.id,
    };

    data.appointments.push(newAppointment);

    // Add appointment to both the doctor and patient record
    doctor.appointments.push(newAppointment);
    patient.appointments.push(newAppointment);

    writeDataFile(data);
  } else {
    throw new Error('Doctor or Patient not found.');
  }
});
