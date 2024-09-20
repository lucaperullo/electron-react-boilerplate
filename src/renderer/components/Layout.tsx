import {
  Box,
  Flex,
  Button,
  VStack,
  Icon,
} from '@chakra-ui/react';
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
import DailyViewCalendar from './DailyView'; // Import DailyViewCalendar component

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const { users, addAppointment, refreshData } = useGlobalState();

  const handleAddAppointment = () => {
    setModalOpen(true);
  };

  const handleExitApp = () => {
    window.close(); // Electron API to close the app
  };

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
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
        w={isSidebarOpen ? 'calc(100vw - 250px)' : 'calc(100vw - 80px)'}
        h="100vh"
        overflowY="auto"
        transition="margin-left 0.3s ease, width 0.3s ease"
      >
        <DailyViewCalendar /> {/* Render DailyViewCalendar here */}
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

            {/* Modal content here */}
          </Box>
        </>
      )}
    </Flex>
  );
};

export default Layout;