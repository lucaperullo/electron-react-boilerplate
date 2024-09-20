import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  VStack,
  Text,
  Box, // Import Box from Chakra UI
} from '@chakra-ui/react';
import { User } from '../db/types';

interface DoctorsModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctors: User[];
}

const DoctorsModal: React.FC<DoctorsModalProps> = ({ isOpen, onClose, doctors }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Doctors</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="start">
            {doctors.map((doctor) => (
              <Box key={doctor.id} p={4} borderWidth="1px" borderRadius="md" w="100%">
                <Text><strong>Name:</strong> {doctor.name} {doctor.surname}</Text>
                <Text><strong>Specialty:</strong> {doctor.specialty}</Text>
                <Text><strong>Phone:</strong> {doctor.phone_number}</Text>
                {doctor.email && <Text><strong>Email:</strong> {doctor.email}</Text>}
              </Box>
            ))}
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DoctorsModal;