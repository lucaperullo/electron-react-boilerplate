import { User, Appointment } from './types';

interface ElectronAPI {
  getUsers: () => Promise<User[]>;
  getAppointments: () => Promise<Appointment[]>;
  addAppointment: (appointment: Appointment) => Promise<void>;
  addUser: (user: User) => Promise<void>;
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
