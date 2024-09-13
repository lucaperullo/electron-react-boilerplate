import {
  Box,
  Flex,
  Button,
  VStack,
  Icon,
  Input,
  Select,
  Stack,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import {
  FaUser,
  FaStethoscope,
  FaPlus,
  FaSignOutAlt,
  FaArrowLeft,
  FaArrowRight,
} from 'react-icons/fa';
import { useGlobalState } from '../context/GlobalStateProvider'; // Import GlobalState context
import dayjs from 'dayjs';

// Function to round up to the nearest 5-minute interval
const roundUpToNearest5Minutes = (time: dayjs.Dayjs) => {
  const minutes = time.minute();
  const roundedMinutes = Math.ceil(minutes / 5) * 5;
  return time.minute(roundedMinutes).second(0);
};

// Set the default time to the current time rounded up to the nearest 5-minute interval
const defaultTime = roundUpToNearest5Minutes(dayjs()).format('HH:mm');

interface Appointment {
  id?: number;
  time: string;
  doctorID: number;
  patientID: number;
}

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const [selectedDoctor, setSelectedDoctor] = useState<number | string>('');
  const [selectedPatient, setSelectedPatient] = useState<number | string>('');
  const [searchDoctor, setSearchDoctor] = useState('');
  const [searchPatient, setSearchPatient] = useState(''); // Ensure it's initialized as a string
  const [appointmentDate, setAppointmentDate] = useState(
    dayjs().format('YYYY-MM-DD'),
  ); // Default to current date
  const [appointmentTime, setAppointmentTime] = useState(defaultTime); // Default to rounded current time

  // Access global state and actions from context
  const { users, addAppointment, refreshData } = useGlobalState();

  // Filter doctors and patients from the global state
  const doctors = users.filter((user) => user.role === 'doctor');
  const patients = users.filter((user) => user.role === 'patient');

  const handleAddAppointment = () => {
    setModalOpen(true);
  };

  const handleExitApp = () => {
    window.close(); // Electron API to close the app
  };

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const handleSearchDoctor = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchDoctor(e.target.value);
  };

  const handleSearchPatient = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchPatient(e.target.value); // Ensure it remains a string
  };

  const handleSubmitAppointment = async () => {
    if (
      selectedDoctor &&
      selectedPatient &&
      appointmentDate &&
      appointmentTime
    ) {
      await addAppointment({
        time: `${appointmentDate}T${appointmentTime}`,
        doctorID: Number(selectedDoctor),
        patientID: Number(selectedPatient),
      });
      setModalOpen(false);
      setSelectedDoctor('');
      setSelectedPatient('');
      setAppointmentDate(dayjs().format('YYYY-MM-DD')); // Reset to current date
      setAppointmentTime(defaultTime); // Reset to rounded current time
      refreshData(); // Refresh global state after adding an appointment
    } else {
      alert('Please select both a doctor and patient and set a date and time.');
    }
  };

  return (
    <Flex height="100vh" w="100vw" overflow="hidden">
      {/* Sidebar */}
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
            as={Link}
            to="/patients"
            width="100%"
            leftIcon={
              <Icon m={0} display="flex" justifyContent="center" as={FaUser} />
            }
            justifyContent={isSidebarOpen ? 'flex-start' : 'center'}
          >
            {isSidebarOpen && 'Patients'}
          </Button>

          <Button
            as={Link}
            to="/doctors"
            width="100%"
            leftIcon={
              <Icon
                m={0}
                display="flex"
                justifyContent="center"
                as={FaStethoscope}
              />
            }
            justifyContent={isSidebarOpen ? 'flex-start' : 'center'}
          >
            {isSidebarOpen && 'Doctors'}
          </Button>

          <Button
            width="100%"
            leftIcon={
              <Icon m={0} display="flex" justifyContent="center" as={FaPlus} />
            }
            onClick={handleAddAppointment}
            justifyContent={isSidebarOpen ? 'flex-start' : 'center'}
          >
            {isSidebarOpen && 'Add Appointment'}
          </Button>

          <Box mt="auto" pt={4} w="100%">
            <Button
              colorScheme="red"
              width="100%"
              leftIcon={
                <Icon
                  m={0}
                  display="flex"
                  justifyContent="center"
                  as={FaSignOutAlt}
                />
              }
              onClick={handleExitApp}
              justifyContent={isSidebarOpen ? 'flex-start' : 'center'}
            >
              {isSidebarOpen && 'Exit'}
            </Button>
          </Box>
        </VStack>

        {/* Toggle button for sidebar */}
        <Box
          position="absolute"
          top="50%"
          right={isSidebarOpen ? '-20px' : '-15px'}
          transform="translateY(-50%)"
        >
          <Button
            size="sm"
            onClick={toggleSidebar}
            colorScheme="blue"
            leftIcon={isSidebarOpen ? <FaArrowLeft /> : <FaArrowRight />}
          />
        </Box>
      </Box>

      {/* Main Content */}
      <Box
        as="main"
        ml={isSidebarOpen ? '250px' : '80px'}
        w="calc(100vw)"
        h="100vh"
        overflowY="auto"
      >
        {children}
      </Box>

      {/* Modal for Add Appointment */}
      {modalOpen && (
        <>
          {/* Backdrop */}
          <Box
            pos="fixed"
            top="0"
            left="0"
            width="100vw"
            height="100vh"
            bg="rgba(0, 0, 0, 0.6)"
            zIndex="999"
            onClick={() => setModalOpen(false)}
          />

          {/* Modal */}
          <Box
            pos="fixed"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            bg="white"
            p={6}
            rounded="md"
            shadow="lg"
            width="400px"
            zIndex="1000"
          >
            <h2>Add Appointment</h2>

            <Stack spacing={4} mt={4}>
              {/* Doctor Search */}
              <Input
                placeholder="Search for a doctor"
                value={searchDoctor}
                onChange={handleSearchDoctor}
              />
              <Select
                placeholder="Select Doctor"
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}
              >
                {doctors.length > 0
                  ? doctors
                      .filter((doctor) =>
                        doctor.name.toLowerCase().includes(
                          (searchDoctor || '').toLowerCase(), // Safeguard searchDoctor
                        ),
                      )
                      .map((doctor) => (
                        <option key={doctor.id} value={doctor.id}>
                          {doctor.name} {doctor.surname}
                        </option>
                      ))
                  : null}
              </Select>

              {/* Patient Search */}
              <Input
                placeholder="Search for a patient"
                value={searchPatient}
                onChange={handleSearchPatient}
              />
              <Select
                placeholder="Select Patient"
                value={selectedPatient}
                onChange={(e) => setSelectedPatient(e.target.value)}
              >
                {patients.length > 0
                  ? patients
                      .filter((patient) =>
                        patient.name.toLowerCase().includes(
                          (searchPatient || '').toLowerCase(), // Safeguard searchPatient
                        ),
                      )
                      .map((patient) => (
                        <option key={patient.id} value={patient.id}>
                          {patient.name} {patient.surname}
                        </option>
                      ))
                  : null}
              </Select>

              {/* Appointment Date */}
              <Input
                type="date"
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
              />

              {/* Appointment Time */}
              <Input
                type="time"
                value={appointmentTime}
                onChange={(e) => setAppointmentTime(e.target.value)}
              />

              <Button colorScheme="blue" onClick={handleSubmitAppointment}>
                Add Appointment
              </Button>
              <Button onClick={() => setModalOpen(false)}>Close</Button>
            </Stack>
          </Box>
        </>
      )}
    </Flex>
  );
};

export default Layout;
