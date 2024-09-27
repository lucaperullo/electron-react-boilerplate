import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channels = 'ipc-example';

const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: Channels, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },

  // Exposing other APIs to the renderer process
  electronAPI: {
    getUsers: () => ipcRenderer.invoke('get-users'),
    getAppointments: () => ipcRenderer.invoke('get-appointments'),
    getAvailabilities: () => ipcRenderer.invoke('get-availabilities'), // Ensure this line is present
    addAppointment: (appointment: any) => ipcRenderer.invoke('add-appointment', appointment),
    addUser: (user: any) => ipcRenderer.invoke('add-user', user),
    addAvailability: (availability: any) => ipcRenderer.invoke('add-availability', availability), // Ensure this line is present
    saveUsers: (users: any) => ipcRenderer.invoke('save-users', users),
    sendMessage: (channel: string, ...args: unknown[]) => ipcRenderer.send(channel, ...args),
    once: (channel: string, func: (...args: unknown[]) => void) => {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;