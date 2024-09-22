import dayjs from 'dayjs';
import {
  Box,
  Flex,
  Button,
  VStack,
  Icon,
  Input,
  FormControl,
  FormLabel,
  Select,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Stack,
  RadioGroup,
  Radio,
  useDisclosure,
  IconButton,
  Grid,
  GridItem,
  Text,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import {
  FaUser,
  FaStethoscope,
  FaPlus,
  FaSignOutAlt,
  FaArrowLeft,
  FaArrowRight,
  FaUserPlus,
} from 'react-icons/fa';
import { useGlobalState } from '../context/GlobalStateProvider'; // Import GlobalState context
import { User, Appointment, Availability } from '../types';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const timeSlots = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
  '17:00', '17:30', '18:00'
];

const CustomInput = ({ value, onClick }: { value: string, onClick: () => void }) => (
  <Button onClick={onClick}>{value}</Button>
);

const DailyViewCalendar = () => {
  const { users, appointments, addUser, refreshData } = useGlobalState(); // Use global state
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedDate, setSelectedDate] = useState(dayjs().toDate());

  const [newUser, setNewUser] = useState({
    name: '',
    surname: '',
    role: 'patient' as 'patient' | 'doctor', // Explicitly typed to 'patient' or 'doctor'
    specialty: '',
    phone_number: '',
    email: '',
  });

  const currentYear = dayjs().year();
  const years = Array.from(
    { length: 21 },
    (_, index) => currentYear - 10 + index,
  );

  const goToPreviousDay = () =>
    setSelectedDate(dayjs(selectedDate).subtract(1, 'day').toDate());
  const goToNextDay = () =>
    setSelectedDate(dayjs(selectedDate).add(1, 'day').toDate());

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMonth = parseInt(e.target.value);
    setSelectedDate(dayjs(selectedDate).month(newMonth).toDate());
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newYear = parseInt(e.target.value);
    setSelectedDate(dayjs(selectedDate).year(newYear).toDate());
  };

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.surname || !newUser.phone_number) {
      alert('Please fill in all required fields.');
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
      role: 'patient',
      specialty: '',
      phone_number: '',
      email: '',
    });
    onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (value: 'patient' | 'doctor') => {
    setNewUser((prev) => ({ ...prev, role: value }));
  };

  // Filter doctors based on their availability and appointments for the selected day
  const filteredDoctors = users.filter(user => {
    if (user.role !== 'doctor') return false;
    const hasAvailability = user.availability?.some(avail => dayjs(avail.date).isSame(selectedDate, 'day'));
    const hasAppointments = appointments.some(app => app.doctorID === user.id && dayjs(app.time).isSame(selectedDate, 'day'));
    return hasAvailability || hasAppointments;
  });

  const getAvailabilityForDoctor = (doctorID: number) => {
    return users.find(user => user.id === doctorID)?.availability?.filter(avail => dayjs(avail.date).isSame(selectedDate, 'day')) || [];
  };

  const getAppointmentsForDoctor = (doctorID: number) => {
    return appointments.filter(app => app.doctorID === doctorID && dayjs(app.time).isSame(selectedDate, 'day'));
  };

  return (
    <Box w="100%">
      <Box
        position="sticky"
        top={'-7px'}
        bg="white"
        zIndex="1000"
        p={2}
        shadow="sm"
        borderBottom="1px solid #e2e8f0"
      >
        <Flex justify="space-between" align="center">
          <Flex align="center" ml={10}>
            {' '}
            {/* Added left margin */}
            <IconButton
              aria-label="Previous Day"
              icon={<FaArrowLeft />}
              onClick={goToPreviousDay}
              mr={2}
            />
            <DatePicker
              selected={selectedDate}
              onChange={(date: Date | null) => date && setSelectedDate(date)}
              customInput={
                <CustomInput
                  value={dayjs(selectedDate).format('DD')}
                  onClick={() => {}}
                />
              }
              dateFormat="dd"
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
            />
            <Select
              value={dayjs(selectedDate).month()}
              onChange={handleMonthChange}
              width="135px" // Adjusted width to accommodate the longest month name
              mr={2}
            >
              {months.map((month: string, index: number) => (
                <option key={index} value={index}>
                  {month}
                </option>
              ))}
            </Select>
            <Select
              value={dayjs(selectedDate).year()}
              onChange={handleYearChange}
              width="100px"
            >
              {years.map((year: number) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </Select>
            <IconButton
              aria-label="Next Day"
              icon={<FaArrowRight />}
              onClick={goToNextDay}
              ml={2}
            />
          </Flex>

          <IconButton
            aria-label="Add User"
            icon={<FaUserPlus />}
            colorScheme="teal"
            onClick={onOpen}
          />
        </Flex>
      </Box>

      <Box overflowX="auto">
        <Grid
          templateColumns={`repeat(${filteredDoctors.length + 1}, 1fr)`}
          gap={4}
          minWidth={`${(filteredDoctors.length + 1) * 200}px`}
        >
          <GridItem
            position="sticky"
            left={0}
            top="47px"
            bg="white"
            zIndex="101"
            borderRight="1px solid #e2e8f0"
          >
            <Text fontWeight="bold" textAlign="left" pl={2}>
              Time
            </Text> {/* Added padding-left */}
          </GridItem>

          {filteredDoctors.map((doctor) => (
            <GridItem
              key={doctor.id}
              position="sticky"
              top="47px"
              bg="white"
              zIndex="100"
              width="200px"
            >
              <Text fontWeight="bold" textAlign="center">
                {doctor.name}
              </Text>
            </GridItem>
          ))}

          {timeSlots.map((time) => (
            <>
              <GridItem
                key={time}
                position="sticky"
                left={0}
                bg="white"
                zIndex="99"
                borderRight="1px solid #e2e8f0"
              >
                <Text textAlign="left" pl={2}>{time}</Text> {/* Added padding-left */}
              </GridItem>

              {filteredDoctors.map((doctor) => {
                const availability = getAvailabilityForDoctor(doctor.id);
                const appointments = getAppointmentsForDoctor(doctor.id);
                const isAvailable = availability.some(avail => dayjs(avail.startTime, 'HH:mm').isSame(dayjs(time, 'HH:mm')));
                const hasAppointment = appointments.some(app => dayjs(app.time, 'HH:mm').isSame(dayjs(time, 'HH:mm')));

                return (
                  <GridItem
                    key={`${time}-${doctor.id}`}
                    bg={hasAppointment ? 'red.200' : isAvailable ? 'green.200' : 'white'}
                  />
                );
              })}
            </>
          ))}
        </Grid>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New User</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <RadioGroup
              onChange={handleRoleChange}
              value={newUser.role}
              mb={4}
            >
              <Stack direction="row">
                <Radio value="patient">Patient</Radio>
                <Radio value="doctor">Doctor</Radio>
              </Stack>
            </RadioGroup>
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
            {newUser.role === 'doctor' && (
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
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" onClick={handleAddUser}>
              Add User
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default DailyViewCalendar;