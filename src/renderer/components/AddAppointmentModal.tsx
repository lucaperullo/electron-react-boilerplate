import React, { useState, useEffect } from 'react';
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
  Select,
  Stack,
} from '@chakra-ui/react';
import dayjs from 'dayjs';
import { User } from '../db/types';

interface AddAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctors: User[];
  patients: User[];
  addAppointment: (appointment: { time: string; doctorID: number; patientID: number }) => Promise<void>;
  refreshData: () => void;
}

const roundUpToNearest5Minutes = (time: dayjs.Dayjs) => {
  const minutes = time.minute();
  const roundedMinutes = Math.ceil(minutes / 5) * 5;
  return time.minute(roundedMinutes).second(0);
};

const defaultTime = roundUpToNearest5Minutes(dayjs()).format('HH:mm');

const AddAppointmentModal: React.FC<AddAppointmentModalProps> = ({
  isOpen,
  onClose,
  doctors,
  patients,
  addAppointment,
  refreshData,
}) => {
  const [searchDoctor, setSearchDoctor] = useState('');
  const [searchPatient, setSearchPatient] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedPatient, setSelectedPatient] = useState('');
  const [appointmentDate, setAppointmentDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [appointmentTime, setAppointmentTime] = useState(defaultTime);

  const handleSearchDoctor = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchDoctor(e.target.value);
  };

  const handleSearchPatient = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchPatient(e.target.value);
  };

  const handleSubmitAppointment = async () => {
    await addAppointment({
      time: `${appointmentDate} ${appointmentTime}`,
      doctorID: Number(selectedDoctor),
      patientID: Number(selectedPatient),
    });
    onClose();
    refreshData();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add Appointment</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={4} mt={4}>
            <Input placeholder="Search for a doctor" value={searchDoctor} onChange={handleSearchDoctor} />
            <Select placeholder="Select Doctor" value={selectedDoctor} onChange={(e) => setSelectedDoctor(e.target.value)}>
              {doctors.length > 0
                ? doctors
                    .filter((doctor) => doctor.name.toLowerCase().includes((searchDoctor || '').toLowerCase()))
                    .map((doctor) => (
                      <option key={doctor.id} value={doctor.id}>
                        {doctor.name} {doctor.surname}
                      </option>
                    ))
                : null}
            </Select>

            <Input placeholder="Search for a patient" value={searchPatient} onChange={handleSearchPatient} />
            <Select placeholder="Select Patient" value={selectedPatient} onChange={(e) => setSelectedPatient(e.target.value)}>
              {patients.length > 0
                ? patients
                    .filter((patient) => patient.name.toLowerCase().includes((searchPatient || '').toLowerCase()))
                    .map((patient) => (
                      <option key={patient.id} value={patient.id}>
                        {patient.name} {patient.surname}
                      </option>
                    ))
                : null}
            </Select>

            <Input type="date" value={appointmentDate} onChange={(e) => setAppointmentDate(e.target.value)} />
            <Input type="time" value={appointmentTime} onChange={(e) => setAppointmentTime(e.target.value)} />
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={handleSubmitAppointment}>
            Add Appointment
          </Button>
          <Button onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddAppointmentModal;