// src/context/GlobalStateContext.tsx

import React, { createContext, useState, useContext, useEffect } from 'react';
import { User, Appointment } from '../types';

interface GlobalStateContextProps {
  users: User[];
  appointments: Appointment[];
  refreshData: () => void;
  addUser: (newUser: User) => Promise<void>;
  addAppointment: (newAppointment: Appointment) => Promise<void>;
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

  // Function to fetch users and appointments from local DB
  const refreshData = async () => {
    const fetchedUsers = await window.electron.electronAPI.getUsers();
    const fetchedAppointments =
      await window.electron.electronAPI.getAppointments();
    setUsers(fetchedUsers);
    setAppointments(fetchedAppointments);
  };

  // Function to add a new user
  const addUser = async (newUser: User) => {
    await window.electron.electronAPI.addUser(newUser);
    refreshData();
  };

  // Function to add a new appointment
  const addAppointment = async (newAppointment: Appointment) => {
    await window.electron.electronAPI.addAppointment(newAppointment);
    refreshData();
  };

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <GlobalStateContext.Provider
      value={{ users, appointments, refreshData, addUser, addAppointment }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
};

// Custom hook to use the GlobalStateContext
export const useGlobalState = () => {
  const context = useContext(GlobalStateContext);
  if (!context) {
    throw new Error('useGlobalState must be used within a GlobalStateProvider');
  }
  return context;
};
