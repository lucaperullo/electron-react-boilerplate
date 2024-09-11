// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
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
    getUsers: () => ipcRenderer.invoke('get-users'), // Replace with the correct IPC channel
    getAppointments: () => ipcRenderer.invoke('get-appointments'), // Replace with the correct IPC channel
    addAppointment: (appointment: any) =>
      ipcRenderer.invoke('add-appointment', appointment), // Replace with the correct IPC channel
    addUser: (user: any) => ipcRenderer.invoke('add-user', user), // Replace with the correct IPC channel
    sendMessage: (channel: string, ...args: unknown[]) =>
      ipcRenderer.send(channel, ...args),
    once: (channel: string, func: (...args: unknown[]) => void) => {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
