import { sequelize, User, Appointment } from '../renderer/db/database';
import dayjs from 'dayjs';
import { randomInt } from 'crypto';

const specialties = ['Cardiology', 'Dermatology', 'Neurology', 'Pediatrics', 'Radiology'];

const generateRandomName = () => {
  const firstNames = ['John', 'Jane', 'Alex', 'Emily', 'Chris', 'Katie', 'Michael', 'Sarah', 'David', 'Laura'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
  const firstName = firstNames[randomInt(firstNames.length)];
  const lastName = lastNames[randomInt(lastNames.length)];
  return { firstName, lastName };
};

const generateRandomPhoneNumber = () => {
  return `+1-${randomInt(100, 999)}-${randomInt(100, 999)}-${randomInt(1000, 9999)}`;
};

const generateRandomEmail = (firstName: string, lastName: string) => {
  return `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;
};

const generateRandomTime = () => {
  const hour = randomInt(8, 18);
  const minute = randomInt(0, 2) * 30; // Either 00 or 30
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
};

const populateDatabase = async () => {
  await sequelize.sync({ force: true }); // Reset the database

  // Create doctors
  for (let i = 0; i < 30; i++) {
    const { firstName, lastName } = generateRandomName();
    await User.create({
      name: firstName,
      surname: lastName,
      role: 'doctor',
      specialty: specialties[randomInt(specialties.length)],
      phone_number: generateRandomPhoneNumber(),
      email: generateRandomEmail(firstName, lastName),
    });
  }

  // Create patients
  for (let i = 0; i < 50; i++) {
    const { firstName, lastName } = generateRandomName();
    await User.create({
      name: firstName,
      surname: lastName,
      role: 'patient',
      phone_number: generateRandomPhoneNumber(),
      email: generateRandomEmail(firstName, lastName),
    });
  }

  const doctors = await User.findAll({ where: { role: 'doctor' } });
  const patients = await User.findAll({ where: { role: 'patient' } });

  // Create appointments
  for (let i = 0; i < 25; i++) {
    const doctor = doctors[randomInt(doctors.length)];
    const patient = patients[randomInt(patients.length)];
    const date = dayjs().add(randomInt(0, 4), 'day').format('YYYY-MM-DD');
    const time = generateRandomTime();

    await Appointment.create({
      time: `${date} ${time}`,
      doctorID: doctor.id,
      patientID: patient.id,
    });
  }

  console.log('Database populated successfully');
};

populateDatabase().catch((error) => {
  console.error('Error populating database:', error);
});