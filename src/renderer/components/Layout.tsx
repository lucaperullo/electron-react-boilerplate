import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Button,
  VStack,
  Icon,
} from '@chakra-ui/react';
import {
  FaUser,
  FaStethoscope,
  FaPlus,
  FaSignOutAlt,
  FaArrowLeft,
  FaArrowRight,
  FaCalendarCheck,
} from 'react-icons/fa';
import dayjs from 'dayjs';
import { useGlobalState } from '../context/GlobalStateProvider';
import DailyViewCalendar from './DailyView';
import PatientsModal from './PatientsModal';
import DoctorsModal from './DoctorsModal';
import DoctorAvailabilityModal from './DoctorsAvailabilityModal';
import AddAppointmentModal from './AddAppointmentModal';
import { User } from '../db/types';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [doctors, setDoctors] = useState<User[]>([]);
  const [patients, setPatients] = useState<User[]>([]);
  const [isPatientsModalOpen, setPatientsModalOpen] = useState(false);
  const [isDoctorsModalOpen, setDoctorsModalOpen] = useState(false);
  const [isDoctorAvailabilityModalOpen, setDoctorAvailabilityModalOpen] = useState(false);

  const { users, addAppointment, refreshData, addAvailability } = useGlobalState();

  useEffect(() => {
    const fetchUsers = async () => {
      const allUsers = await window.electron.electronAPI.getUsers();
      setDoctors(allUsers.filter((user) => user.role === 'doctor'));
      setPatients(allUsers.filter((user) => user.role === 'patient'));
    };

    fetchUsers();
  }, []);

  const handleAddAppointment = () => {
    setModalOpen(true);
  };

  const handleExitApp = () => {
    window.close();
  };

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <Flex height="100vh" w="100vw" overflow="hidden">
      <Box
        as="nav"
        width={isSidebarOpen ? '250px' : '80px'}
        bg="gray.700"
        color="white"
        p={4}
        h="100vh"
        transition="width 0.3s ease"
        position="fixed"
        left="0"
        top="0"
        bottom="0"
        overflow="hidden"
        zIndex="1000"
      >
        <VStack spacing={4} align="start" h="100%" w="100%">
          <Button
            width="100%"
            leftIcon={<Icon m={0} display="flex" justifyContent="center" as={FaUser} />}
            justifyContent={isSidebarOpen ? 'flex-start' : 'center'}
            onClick={() => setPatientsModalOpen(true)}
          >
            {isSidebarOpen && 'Patients'}
          </Button>

          <Button
            width="100%"
            leftIcon={<Icon m={0} display="flex" justifyContent="center" as={FaStethoscope} />}
            justifyContent={isSidebarOpen ? 'flex-start' : 'center'}
            onClick={() => setDoctorsModalOpen(true)}
          >
            {isSidebarOpen && 'Doctors'}
          </Button>

          <Button
            width="100%"
            leftIcon={<Icon m={0} display="flex" justifyContent="center" as={FaPlus} />}
            onClick={handleAddAppointment}
            justifyContent={isSidebarOpen ? 'flex-start' : 'center'}
          >
            {isSidebarOpen && 'Add Appointment'}
          </Button>

          <Button
            width="100%"
            leftIcon={<Icon m={0} display="flex" justifyContent="center" as={FaCalendarCheck} />}
            onClick={() => setDoctorAvailabilityModalOpen(true)}
            justifyContent={isSidebarOpen ? 'flex-start' : 'center'}
          >
            {isSidebarOpen && 'Register Availability'}
          </Button>

          <Box mt="auto" pt={4} w="100%">
            <Button
              colorScheme="red"
              width="100%"
              leftIcon={<Icon m={0} display="flex" justifyContent="center" as={FaSignOutAlt} />}
              onClick={handleExitApp}
              justifyContent={isSidebarOpen ? 'flex-start' : 'center'}
            >
              {isSidebarOpen && 'Exit'}
            </Button>
          </Box>
        </VStack>

        <Box position="absolute" top="50%" right={isSidebarOpen ? '-20px' : '-15px'} transform="translateY(-50%)">
          <Button size="sm" onClick={toggleSidebar} colorScheme="blue" leftIcon={isSidebarOpen ? <FaArrowLeft /> : <FaArrowRight />} />
        </Box>
      </Box>

      <Box
        as="main"
        ml={isSidebarOpen ? '250px' : '80px'}
        w={isSidebarOpen ? 'calc(100vw - 250px)' : 'calc(100vw - 80px)'}
        h="100vh"
        overflowY="auto"
        transition="margin-left 0.3s ease, width 0.3s ease"
      >
        <DailyViewCalendar />
        {children}
      </Box>

      <AddAppointmentModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        doctors={doctors}
        patients={patients}
        addAppointment={addAppointment}
        refreshData={refreshData}
      />

      <PatientsModal isOpen={isPatientsModalOpen} onClose={() => setPatientsModalOpen(false)} patients={patients} />
      <DoctorsModal isOpen={isDoctorsModalOpen} onClose={() => setDoctorsModalOpen(false)} doctors={doctors} />
      <DoctorAvailabilityModal isOpen={isDoctorAvailabilityModalOpen} onClose={() => setDoctorAvailabilityModalOpen(false)} doctors={doctors} addAvailability={addAvailability} />
    </Flex>
  );
};

export default Layout;