import { useState } from 'react';
import {
  Box,
  Grid,
  GridItem,
  Text,
  Button,
  Flex,
  Select,
} from '@chakra-ui/react';
import dayjs from 'dayjs';
import updateLocale from 'dayjs/plugin/updateLocale';

// Add support for custom locale formatting
dayjs.extend(updateLocale);

// Mock data for doctors (more than 5 to demonstrate scrolling)
const doctors = [
  'Dr. Smith',
  'Dr. Johnson',
  'Dr. Brown',
  'Dr. Filipe',
  'Dr. Luca',
  'Dr. Taylor',
  'Dr. Lee',
];

// Generate time slots from 8:00 AM to 8:00 PM in 15-minute intervals
const generateTimeSlots = () => {
  const startTime = dayjs().hour(8).minute(0); // Start at 8:00 AM
  const endTime = dayjs().hour(20).minute(0); // End at 8:00 PM
  const slots = [];

  let currentTime = startTime;
  while (currentTime.isBefore(endTime) || currentTime.isSame(endTime)) {
    slots.push(currentTime.format('HH:mm')); // Add current time slot to array
    currentTime = currentTime.add(15, 'minute'); // Increment by 15 minutes
  }
  return slots;
};

const timeSlots = generateTimeSlots(); // Call function to generate slots

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

const DailyViewCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs()); // Start with today's date

  // Generate year options for dropdown (current year - 10 years + 10 years into the future)
  const currentYear = dayjs().year();
  const years = Array.from(
    { length: 21 },
    (_, index) => currentYear - 10 + index,
  );

  // Handle day, month, and year navigation
  const goToPreviousDay = () =>
    setSelectedDate(selectedDate.subtract(1, 'day'));
  const goToNextDay = () => setSelectedDate(selectedDate.add(1, 'day'));

  // Explicitly type the event for the Select inputs
  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMonth = parseInt(e.target.value);
    setSelectedDate(selectedDate.month(newMonth));
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newYear = parseInt(e.target.value);
    setSelectedDate(selectedDate.year(newYear));
  };

  return (
    <Box w="100%">
      {/* Sticky Calendar Navigation */}
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
          <Button onClick={goToPreviousDay}>Previous Day</Button>

          <Flex align="center">
            <Select
              value={selectedDate.month()}
              onChange={handleMonthChange}
              width="150px"
              mr={4}
            >
              {months.map((month: string, index: number) => (
                <option key={month} value={index}>
                  {month}
                </option>
              ))}
            </Select>

            <Select
              value={selectedDate.year()}
              onChange={handleYearChange}
              width="100px"
            >
              {years.map((year: number) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </Select>
          </Flex>

          <Text fontSize="xl" fontWeight="bold">
            {selectedDate.format('MMMM D, YYYY')}
          </Text>

          <Button onClick={goToNextDay}>Next Day</Button>
        </Flex>
      </Box>

      {/* Scrollable doctors list */}
      <Box overflowX="auto">
        {/* Limit the number of visible doctors to 5 and enable horizontal scrolling */}
        <Grid
          templateColumns={`repeat(${doctors.length + 1}, 1fr)`}
          gap={4}
          minWidth={`${(doctors.length + 1) * 200}px`} // Ensure enough width to scroll horizontally
        >
          {/* Sticky Time Slots on the y-axis */}
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

          {/* Render sticky doctor names on the x-axis */}
          {doctors.map((doctor) => (
            <GridItem
              key={doctor}
              position="sticky"
              top="47px"
              bg="white"
              zIndex="100"
              width="200px" // Ensure fixed width for each doctor column
            >
              <Text fontWeight="bold" textAlign="center">
                {doctor}
              </Text>
            </GridItem>
          ))}

          {/* Render time slots on the y-axis and cells for each doctor/time slot */}
          {timeSlots.map((time) => (
            <>
              {/* Time slot on the y-axis */}
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

              {/* Cells for each doctor/time slot */}
              {doctors.map((doctor) => (
                <GridItem
                  key={`${doctor}-${time}`}
                  border="1px solid gray"
                  p={2}
                  textAlign="center"
                  width="200px" // Ensure fixed width for each time slot
                >
                  {/* Placeholder for availability, appointments, etc. */}
                  Available
                </GridItem>
              ))}
            </>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default DailyViewCalendar;
