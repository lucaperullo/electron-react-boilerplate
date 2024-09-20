// src/renderer/db/types.ts

export interface User {
    id?: number;
    name: string;
    surname: string;
    role: 'doctor' | 'patient';
    specialty?: string;
    phone_number: string;
    email?: string;
    appointments?: Appointment[];
  }
  
  export interface Appointment {
    id?: number;
    time: string;
    doctorID: number;
    patientID: number;
  }