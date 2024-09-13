import { useState, forwardRef } from 'react';
import {
  Box,
  Grid,
  GridItem,
  Text,
  Button,
  Flex,
  Select,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Input,
  useDisclosure,
} from '@chakra-ui/react';
import { FaArrowLeft, FaArrowRight, FaUserPlus } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ChevronDownIcon } from '@chakra-ui/icons';
import dayjs from 'dayjs';
import updateLocale from 'dayjs/plugin/updateLocale';
import { useGlobalState } from '../context/GlobalStateProvider';

dayjs.extend(updateLocale);

const doctors = [
  'Dr. Triforce',
  'Dr. Taric',
  'Dr. Better',
  'Dr. Than',
  'Dr. Tryhard',
  'Dr. Lee Sin',
  'Dr. XD',
];

const generateTimeSlots = () => {
  const startTime = dayjs().hour(8).minute(0);
  const endTime = dayjs().hour(20).minute(0);
  const slots = [];

  let currentTime = startTime;
  while (currentTime.isBefore(endTime) || currentTime.isSame(endTime)) {
    slots.push(currentTime.format('HH:mm'));
    currentTime = currentTime.add(15, 'minute');
  }
  return slots;
};

const timeSlots = generateTimeSlots();

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

interface CustomInputProps {
  value: string;
  onClick: () => void;
}

const CustomInput = forwardRef<HTMLButtonElement, CustomInputProps>(
  ({ value, onClick }, ref) => (
    <Button
      onClick={onClick}
      ref={ref}
      width="60px"
      mr={2}
      textAlign="center"
      fontWeight="normal"
      fontSize="md"
      border="1px solid #e2e8f0"
      borderRadius="md"
      bg="white"
      _hover={{ bg: 'gray.100' }}
      _focus={{ boxShadow: 'outline' }}
      rightIcon={<ChevronDownIcon />}
    >
      {value}
    </Button>
  ),
);

const DailyViewCalendar = () => {
  const { users, addUser, refreshData } = useGlobalState(); // Use global state
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedDate, setSelectedDate] = useState(dayjs().toDate());

  const [newPatient, setNewPatient] = useState({
    name: '',
    surname: '',
    role: 'patient' as 'patient', // Explicitly typed to 'patient'
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

  const handleAddPatient = async () => {
    if (!newPatient.name || !newPatient.surname || !newPatient.phone_number) {
      alert('Please fill in all required fields.');
      return;
    }
    const patientWithId = {
      ...newPatient,
      id: Date.now(), // Assign a unique ID
    };
    await addUser(patientWithId); // Add the patient using context function
    setNewPatient({
      name: '',
      surname: '',
      role: 'patient',
      phone_number: '',
      email: '',
    });
    onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewPatient((prev) => ({ ...prev, [name]: value }));
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
                <option key={month} value={index}>
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
            aria-label="Add Patient"
            icon={<FaUserPlus />}
            colorScheme="teal"
            onClick={onOpen}
          />
        </Flex>
      </Box>

      <Box overflowX="auto">
        <Grid
          templateColumns={`repeat(${doctors.length + 1}, 1fr)`}
          gap={4}
          minWidth={`${(doctors.length + 1) * 200}px`}
        >
          <GridItem
            position="sticky"
            left={0}
            top="47px"
            bg="white"
            zIndex="101"
            borderRight="1px solid #e2e8f0"
          >
            <Text fontWeight="bold" textAlign="center">
              Time
            </Text>
          </GridItem>

          {doctors.map((doctor) => (
            <GridItem
              key={doctor}
              position="sticky"
              top="47px"
              bg="white"
              zIndex="100"
              width="200px"
            >
              <Text fontWeight="bold" textAlign="center">
                {doctor}
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
                <Text textAlign="center">{time}</Text>
              </GridItem>

              {doctors.map((doctor) => (
                <GridItem
                  key={`${doctor}-${time}`}
                  border="1px solid gray"
                  p={2}
                  textAlign="center"
                  width="200px"
                >
                  Available
                </GridItem>
              ))}
            </>
          ))}
        </Grid>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Patient</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              placeholder="Name"
              name="name"
              value={newPatient.name}
              onChange={handleInputChange}
              mb={4}
            />
            <Input
              placeholder="Surname"
              name="surname"
              value={newPatient.surname}
              onChange={handleInputChange}
              mb={4}
            />
            <Input
              placeholder="Phone Number"
              name="phone_number"
              value={newPatient.phone_number}
              onChange={handleInputChange}
              mb={4}
            />
            <Input
              placeholder="Email (Optional)"
              name="email"
              value={newPatient.email}
              onChange={handleInputChange}
            />
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" onClick={handleAddPatient}>
              Add Patient
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default DailyViewCalendar;
