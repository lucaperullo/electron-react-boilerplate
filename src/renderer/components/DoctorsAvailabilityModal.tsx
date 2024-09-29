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
  VStack,
  Select,
  Input,
} from '@chakra-ui/react';
import { User } from '../db/types';
import dayjs from 'dayjs';

interface DoctorAvailabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctors: User[];
  addAvailability: (doctorID: number, date: string, startTime: string, endTime: string, duration: number) => Promise<void>;
  refreshData: () => void;
}

const DoctorAvailabilityModal: React.FC<DoctorAvailabilityModalProps> = ({ isOpen, onClose, doctors, addAvailability, refreshData }) => {
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [availabilityDate, setAvailabilityDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('18:00');
  const [appointmentDuration, setAppointmentDuration] = useState(30);

  const handleSubmit = async () => {
    await addAvailability(Number(selectedDoctor), availabilityDate, startTime, endTime, appointmentDuration);
    onClose();
    refreshData();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Register Doctor Availability</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="start">
            <Select
              placeholder="Select Doctor"
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
            >
              {doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.name} {doctor.surname}
                </option>
              ))}
            </Select>
            <Input
              type="date"
              value={availabilityDate}
              onChange={(e) => setAvailabilityDate(e.target.value)}
            />
            <Input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
            <Input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
            <Select
              placeholder="Select Appointment Duration"
              value={appointmentDuration}
              onChange={(e) => setAppointmentDuration(Number(e.target.value))}
            >
              {[...Array(11)].map((_, i) => {
                const value = 10 + i * 5;
                return (
                  <option key={value} value={value}>
                    {value} minutes
                  </option>
                );
              })}
            </Select>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={handleSubmit}>
            Save
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DoctorAvailabilityModal;