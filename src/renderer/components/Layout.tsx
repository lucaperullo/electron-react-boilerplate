import {
  Box,
  Flex,
  Button,
  VStack,
  Icon,
  Input,
  Select,
  Stack,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import { useState } from 'react';
import {
  FaUser,
  FaStethoscope,
  FaPlus,
  FaSignOutAlt,
  FaArrowLeft,
  FaArrowRight,
  FaUserPlus,
} from 'react-icons/fa';
import { useGlobalState } from '../context/GlobalStateProvider';
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

  const [userType, setUserType] = useState<'doctor' | 'patient'>('patient'); // State to track user type
  const [newUser, setNewUser] = useState<{
    name: string;
    surname: string;
    role: 'doctor' | 'patient';
    specialty: string;
    phone_number: string;
    email: string;
  }>({
    name: '',
    surname: '',
    role: 'patient', // Default to 'patient'
    specialty: '',
    phone_number: '',
    email: '',
  });

  // Access global state and actions from context
  const { users, addUser, addAppointment, refreshData } = useGlobalState();

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

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.surname || !newUser.phone_number) {
      alert('Please fill in all required fields.');
      return;
    }
    if (userType === 'doctor' && !newUser.specialty) {
      alert('Please fill in the specialty for the doctor.');
      return;
    }
    const userWithId = {
      ...newUser,
      id: Date.now(), // Assign a unique ID
    };
    await addUser(userWithId); // Add the user using context function
    setNewUser({
      name: '',
      surname: '',
      role: 'patient', // Reset role to 'patient'
      specialty: '',
      phone_number: '',
      email: '',
    });
    setUserType('patient'); // Reset user type to 'patient'
    setModalOpen(false);
    refreshData(); // Refresh global state after adding a user
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleUserTypeChange = (value: 'doctor' | 'patient') => {
    setUserType(value);
    setNewUser((prev) => ({
      ...prev,
      role: value,
      specialty: value === 'doctor' ? '' : prev.specialty,
    }));
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
            width="100%"
            leftIcon={
              <Icon m={0} display="flex" justifyContent="center" as={FaUser} />
            }
            justifyContent={isSidebarOpen ? 'flex-start' : 'center'}
            isDisabled
          >
            {isSidebarOpen && 'Patients'}
          </Button>

          <Button
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
            isDisabled
          >
            {isSidebarOpen && 'Doctors'}
          </Button>

          <Button
            width="100%"
            leftIcon={
              <Icon m={0} display="flex" justifyContent="center" as={FaPlus} />
            }
            onClick={() => setModalOpen(true)}
            justifyContent={isSidebarOpen ? 'flex-start' : 'center'}
          >
            {isSidebarOpen && 'Add User'}
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
        w="calc(100vw - 250px)"
        h="100vh"
        overflowY="auto"
        transition="margin-left 0.3s ease, width 0.3s ease"
      >
        {/* Top Bar */}
        <Flex justify="space-between" align="center" p={4} bg="gray.100">
          <Button
            leftIcon={<FaUserPlus />}
            colorScheme="teal"
            onClick={() => setModalOpen(true)}
          >
            Add User
          </Button>
        </Flex>

        {children}
      </Box>

      {/* Modal for Add User */}
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
            <h2>Add User</h2>

            <Stack spacing={4} mt={4}>
              <FormControl as="fieldset">
                <FormLabel as="legend">User Type</FormLabel>
                <RadioGroup
                  value={userType}
                  onChange={(value) =>
                    handleUserTypeChange(value as 'doctor' | 'patient')
                  }
                >
                  <Stack direction="row">
                    <Radio value="doctor">Doctor</Radio>
                    <Radio value="patient">Patient</Radio>
                  </Stack>
                </RadioGroup>
              </FormControl>

              <Input
                placeholder="Name"
                name="name"
                value={newUser.name}
                onChange={handleInputChange}
                mb={4}
              />
              <Input
                placeholder="Surname"
                name="surname"
                value={newUser.surname}
                onChange={handleInputChange}
                mb={4}
              />
              {userType === 'doctor' && (
                <Input
                  placeholder="Specialty"
                  name="specialty"
                  value={newUser.specialty}
                  onChange={handleInputChange}
                  mb={4}
                />
              )}
              <Input
                placeholder="Phone Number"
                name="phone_number"
                value={newUser.phone_number}
                onChange={handleInputChange}
                mb={4}
              />
              <Input
                placeholder="Email (Optional)"
                name="email"
                value={newUser.email}
                onChange={handleInputChange}
              />

              <Button colorScheme="blue" onClick={handleAddUser}>
                Add {userType.charAt(0).toUpperCase() + userType.slice(1)}
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
