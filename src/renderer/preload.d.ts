import { User, Appointment, Availability } from './types';

interface ElectronAPI {
  getUsers: () => Promise<User[]>;
  getAppointments: () => Promise<Appointment[]>;
  getAvailabilities: () => Promise<Availability[]>; // Ensure this line is present
  addAppointment: (appointment: Appointment) => Promise<void>;
  addUser: (user: User) => Promise<void>;
  saveUsers: (users: User[]) => Promise<void>;
  addAvailability: (availability: Availability) => Promise<void>; // Ensure this line is present
  sendMessage: (channel: string, ...args: unknown[]) => void;
  once: (channel: string, listener: (...args: unknown[]) => void) => void;
}

declare global {
  interface Window {
    electron: {
      electronAPI: ElectronAPI;
    };
  }
}