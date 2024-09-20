import { ipcMain } from 'electron';
import { User, Appointment } from './database';
import { User as UserType, Appointment as AppointmentType } from './types';

// Get all users
ipcMain.handle('get-users', async () => {
  return await User.findAll();
});

// Get all appointments
ipcMain.handle('get-appointments', async () => {
  return await Appointment.findAll();
});

// Add a new user
ipcMain.handle('add-user', async (event, user: UserType) => {
  return await User.create(user);
});

// Add an appointment with a unique ID
ipcMain.handle('add-appointment', async (event, appointment: AppointmentType) => {
  const doctor = await User.findOne({ where: { id: appointment.doctorID, role: 'doctor' } });
  const patient = await User.findOne({ where: { id: appointment.patientID, role: 'patient' } });

  if (doctor && patient) {
    const newAppointment = await Appointment.create({
      time: appointment.time,
      doctorID: doctor.id,
      patientID: patient.id,
    });

    return newAppointment;
  } else {
    throw new Error('Doctor or Patient not found.');
  }
});