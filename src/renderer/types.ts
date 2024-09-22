export interface User {
  id: number;
  name: string;
  surname: string;
  role: 'doctor' | 'patient';
  specialty?: string;
  phone_number: string;
  email?: string;
  availability?: Availability[]; // Add this line
}

export interface Appointment {
  id: number;
  time: string;
  doctorID: number;
  patientID: number;
}

export interface Availability {
  id: number;
  doctorID: number;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
}