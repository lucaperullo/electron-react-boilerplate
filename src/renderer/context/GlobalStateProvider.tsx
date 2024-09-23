import React, { createContext, useState, useContext, useEffect } from 'react';
import { User, Appointment, Availability } from '../types';

interface GlobalStateContextProps {
  users: User[];
  appointments: Appointment[];
  refreshData: () => void;
  addUser: (newUser: User) => Promise<void>;
  addAppointment: (newAppointment: { time: string; doctorID: number; patientID: number }) => Promise<void>;
  addAvailability: (doctorID: number, date: string, startTime: string, endTime: string, duration: number) => Promise<void>;
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
  const fetchedAppointments = await window.electron.electronAPI.getAppointments();
  setUsers(fetchedUsers);
  setAppointments(fetchedAppointments);
  console.log('Data refreshed:', fetchedUsers, fetchedAppointments); // Add this line
};

  const addUser = async (newUser: User) => {
    await window.electron.electronAPI.addUser(newUser);
    refreshData();
  };

  const addAppointment = async (newAppointment: { time: string; doctorID: number; patientID: number }) => {
    const appointment: Appointment = {
      id: Date.now(), // Generate a temporary ID
      ...newAppointment,
    };
    await window.electron.electronAPI.addAppointment(appointment);
    refreshData();
  };

  const addAvailability = async (doctorID: number, date: string, startTime: string, endTime: string, duration: number) => {
    const updatedUsers = users.map(user => {
      if (user.id === doctorID) {
        return {
          ...user,
          availability: [...(user.availability || []), { id: Date.now(), doctorID, date, startTime, endTime, duration }],
        };
      }
      return user;
    });
    setUsers(updatedUsers);
    await window.electron.electronAPI.saveUsers(updatedUsers);
    console.log('Availability added:', updatedUsers); // Add this line
    refreshData();
  };

  return (
    <GlobalStateContext.Provider
      value={{ users, appointments, refreshData, addUser, addAppointment, addAvailability }}
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