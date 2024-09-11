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
import { useState, useEffect } from 'react';
import {
  FaUser,
  FaStethoscope,
  FaPlus,
  FaSignOutAlt,
  FaArrowLeft,
  FaArrowRight,
} from 'react-icons/fa'; // Import icons from react-icons

interface User {
  id: number;
  name: string;
  surname: string;
  role: 'doctor' | 'patient';
  phone_number: string;
  email?: string;
  appointments?: Appointment[];
}

interface Appointment {
  id?: number;
  time: string;
  doctorID: number;
  patientID: number;
}

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  // Modal states
  const [selectedDoctor, setSelectedDoctor] = useState<number | string>('');
  const [selectedPatient, setSelectedPatient] = useState<number | string>('');
  const [filteredDoctors, setFilteredDoctors] = useState<User[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<User[]>([]);
  const [searchDoctor, setSearchDoctor] = useState('');
  const [searchPatient, setSearchPatient] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');

  // Fetch all doctors and patients from the data manager
  useEffect(() => {
    const fetchUsers = async () => {
      const users: User[] = await window.electron.electronAPI.getUsers();
      const doctors = users.filter((user) => user.role === 'doctor');
      const patients = users.filter((user) => user.role === 'patient');
      setFilteredDoctors(doctors);
      setFilteredPatients(patients);
    };

    fetchUsers();
  }, []);

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
    const filtered = filteredDoctors.filter((doctor: User) =>
      doctor.name.toLowerCase().includes(e.target.value.toLowerCase()),
    );
    setFilteredDoctors(filtered);
  };

  const handleSearchPatient = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchPatient(e.target.value);
    const filtered = filteredPatients.filter((patient: User) =>
      patient.name.toLowerCase().includes(e.target.value.toLowerCase()),
    );
    setFilteredPatients(filtered);
  };

  const handleSubmitAppointment = async () => {
    if (selectedDoctor && selectedPatient && appointmentTime) {
      await window.electron.electronAPI.addAppointment({
        time: appointmentTime,
        doctorID: Number(selectedDoctor),
        patientID: Number(selectedPatient),
      });
      setModalOpen(false);
      setSelectedDoctor('');
      setSelectedPatient('');
      setAppointmentTime('');
    } else {
      alert('Please select both a doctor and patient and set a time.');
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
        overflowY="auto" // Allow scrolling within the content area
      >
        {children}
      </Box>

      {/* Modal for Add Appointment */}
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
            bg="rgba(0, 0, 0, 0.6)" // Semi-transparent dark backdrop
            zIndex="999" // High z-index to ensure it is above everything
            onClick={() => setModalOpen(false)} // Clicking outside modal closes it
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
            zIndex="1000" // Modal should have a higher z-index than the backdrop
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
                {filteredDoctors.length > 0
                  ? filteredDoctors.map((doctor: User) => (
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
                {filteredPatients.length > 0
                  ? filteredPatients.map((patient: User) => (
                      <option key={patient.id} value={patient.id}>
                        {patient.name} {patient.surname}
                      </option>
                    ))
                  : null}
              </Select>

              {/* Appointment Time */}
              <Input
                placeholder="Appointment Time (YYYY-MM-DDTHH:MM)"
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
