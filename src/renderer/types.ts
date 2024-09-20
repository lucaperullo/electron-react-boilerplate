// types.ts
export interface Appointment {
  id?: number;
  time: string;
  doctorID: number;
  patientID: number;
}

export interface User {
  id?: number;
  name: string;
  surname: string;
  role: 'doctor' | 'patient';
  specialty?: string;
  phone_number: string;
  email?: string;
  appointments?: Appointment[]; // NOT PRESENT IN THE OTHER type.ts file
}
