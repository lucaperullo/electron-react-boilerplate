// src/components/Layout.tsx

import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Button,
  VStack,
  Icon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Input,
  Select,
  Stack,
  Text,
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
import { User } from '../db/types';

const roundUpToNearest5Minutes = (time: dayjs.Dayjs) => {
  const minutes = time.minute();
  const roundedMinutes = Math.ceil(minutes / 5) * 5;
  return time.minute(roundedMinutes).second(0);
};

const defaultTime = roundUpToNearest5Minutes(dayjs()).format('HH:mm');

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [appointmentDetails, setAppointmentDetails] = useState({
    time: '',
    doctorID: '',
    patientID: '',
  });
  const [doctors, setDoctors] = useState<User[]>([]);
  const [patients, setPatients] = useState<User[]>([]);
  const [searchDoctor, setSearchDoctor] = useState('');
  const [searchPatient, setSearchPatient] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedPatient, setSelectedPatient] = useState('');
  const [appointmentDate, setAppointmentDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [appointmentTime, setAppointmentTime] = useState(defaultTime);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAppointmentDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSearchDoctor = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchDoctor(e.target.value);
  };

  const handleSearchPatient = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchPatient(e.target.value);
  };

  const handleSubmitAppointment = async () => {
    await addAppointment({
      id: Date.now(), // Generate a unique ID using the current timestamp
      time: `${appointmentDate} ${appointmentTime}`,
      doctorID: Number(selectedDoctor),
      patientID: Number(selectedPatient),
    });
    setModalOpen(false);
    refreshData();
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

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Appointment</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4} mt={4}>
              <Input placeholder="Search for a doctor" value={searchDoctor} onChange={handleSearchDoctor} />
              <Select placeholder="Select Doctor" value={selectedDoctor} onChange={(e) => setSelectedDoctor(e.target.value)}>
                {doctors.length > 0
                  ? doctors
                      .filter((doctor) => doctor.name.toLowerCase().includes((searchDoctor || '').toLowerCase()))
                      .map((doctor) => (
                        <option key={doctor.id} value={doctor.id}>
                          {doctor.name} {doctor.surname}
                        </option>
                      ))
                  : null}
              </Select>

              <Input placeholder="Search for a patient" value={searchPatient} onChange={handleSearchPatient} />
              <Select placeholder="Select Patient" value={selectedPatient} onChange={(e) => setSelectedPatient(e.target.value)}>
                {patients.length > 0
                  ? patients
                      .filter((patient) => patient.name.toLowerCase().includes((searchPatient || '').toLowerCase()))
                      .map((patient) => (
                        <option key={patient.id} value={patient.id}>
                          {patient.name} {patient.surname}
                        </option>
                      ))
                  : null}
              </Select>

              <Input type="date" value={appointmentDate} onChange={(e) => setAppointmentDate(e.target.value)} />
              <Input type="time" value={appointmentTime} onChange={(e) => setAppointmentTime(e.target.value)} />
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleSubmitAppointment}>
              Add Appointment
            </Button>
            <Button onClick={() => setModalOpen(false)}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <PatientsModal isOpen={isPatientsModalOpen} onClose={() => setPatientsModalOpen(false)} patients={patients} />
      <DoctorsModal isOpen={isDoctorsModalOpen} onClose={() => setDoctorsModalOpen(false)} doctors={doctors} />
      <DoctorAvailabilityModal isOpen={isDoctorAvailabilityModalOpen} onClose={() => setDoctorAvailabilityModalOpen(false)} doctors={doctors} addAvailability={addAvailability} />
    </Flex>
  );
};

export default Layout;