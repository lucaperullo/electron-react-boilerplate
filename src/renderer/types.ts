// types.ts
export interface Appointment {
  id?: number;
  time: string;
  doctorID: number;
  patientID: number;
}

export interface User {
  id: number;
  name: string;
  surname: string;
  role: 'doctor' | 'patient';
  phone_number: string;
  email?: string;
  appointments?: Appointment[];
}
