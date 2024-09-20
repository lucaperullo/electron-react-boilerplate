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

interface PatientsModalProps {
  isOpen: boolean;
  onClose: () => void;
  patients: User[];
}

const PatientsModal: React.FC<PatientsModalProps> = ({ isOpen, onClose, patients }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Patients</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="start">
            {patients.map((patient) => (
              <Box key={patient.id} p={4} borderWidth="1px" borderRadius="md" w="100%">
                <Text><strong>Name:</strong> {patient.name} {patient.surname}</Text>
                <Text><strong>Phone:</strong> {patient.phone_number}</Text>
                {patient.email && <Text><strong>Email:</strong> {patient.email}</Text>}
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

export default PatientsModal;