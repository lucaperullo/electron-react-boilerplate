import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  RadioGroup,
  Radio,
  Stack,
} from '@chakra-ui/react';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  addUser: (user: any) => Promise<void>;
  refreshData: () => void;
}

const AddUserModal: React.FC<AddUserModalProps> = ({ isOpen, onClose, addUser, refreshData }) => {
  const [newUser, setNewUser] = useState({
    name: '',
    surname: '',
    role: 'patient' as 'patient' | 'doctor', // Explicitly typed to 'patient' or 'doctor'
    specialty: '',
    phone_number: '',
    email: '',
  });

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
    refreshData(); // Re-fetch data to ensure consistency
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (value: 'patient' | 'doctor') => {
    setNewUser((prev) => ({ ...prev, role: value }));
  };

  return (
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
  );
};

export default AddUserModal;