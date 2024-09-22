// src/context/GlobalStateProvider.tsx

import React, { createContext, useState, useContext, useEffect } from 'react';
import { User, Appointment } from '../types';

interface GlobalStateContextProps {
  users: User[];
  appointments: Appointment[];
  refreshData: () => void;
  addUser: (newUser: User) => Promise<void>;
  addAppointment: (newAppointment: Appointment) => Promise<void>;
  addAvailability: (doctorID: number, date: string, time: string) => Promise<void>; // Add this line
}

const GlobalStateContext = createContext<GlobalStateContextProps | undefined>(
  undefined,
);

export const GlobalStateProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const refreshData = async () => {
    const fetchedUsers = await window.electron.electronAPI.getUsers();
    const fetchedAppointments =
      await window.electron.electronAPI.getAppointments();
    setUsers(fetchedUsers);
    setAppointments(fetchedAppointments);
  };

  const addUser = async (newUser: User) => {
    await window.electron.electronAPI.addUser(newUser);
    refreshData();
  };

  const addAppointment = async (newAppointment: Appointment) => {
    await window.electron.electronAPI.addAppointment(newAppointment);
    refreshData();
  };

  const addAvailability = async (doctorID: number, date: string, time: string) => {
    const updatedUsers = users.map(user => {
      if (user.id === doctorID) {
        return {
          ...user,
          availability: [...(user.availability || []), { date, time }],
        };
      }
      return user;
    });
    setUsers(updatedUsers);
    await window.electron.electronAPI.saveUsers(updatedUsers);
    refreshData();
  };

  return (
    <GlobalStateContext.Provider
      value={{ users, appointments, refreshData, addUser, addAppointment, addAvailability }} // Add addAvailability here
    >
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = () => {
  const context = useContext(GlobalStateContext);
  if (!context) {
    throw new Error('useGlobalState must be used within a GlobalStateProvider');
  }
  return context;
};