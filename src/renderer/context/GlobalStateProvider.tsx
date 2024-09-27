import React, { createContext, useState, useContext, useEffect } from 'react';
import { User, Appointment, Availability } from '../types';

interface GlobalStateContextProps {
  users: User[];
  appointments: Appointment[];
  availabilities: Availability[];
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
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);

  const refreshData = async () => {
    const fetchedUsers = await window.electron.electronAPI.getUsers();
    const fetchedAppointments = await window.electron.electronAPI.getAppointments();
    const fetchedAvailabilities = await window.electron.electronAPI.getAvailabilities();
    setUsers(fetchedUsers);
    setAppointments(fetchedAppointments);
    setAvailabilities(fetchedAvailabilities);
    console.log('Data refreshed:', fetchedUsers, fetchedAppointments, fetchedAvailabilities);
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
    const availability: Availability = {
      id: Date.now(),
      doctorID,
      date,
      startTime,
      endTime,
      duration,
    };
    await window.electron.electronAPI.addAvailability(availability);
    const updatedAvailabilities = await window.electron.electronAPI.getAvailabilities();
    setAvailabilities(updatedAvailabilities);
  };

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <GlobalStateContext.Provider
      value={{ users, appointments, availabilities, refreshData, addUser, addAppointment, addAvailability }}
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