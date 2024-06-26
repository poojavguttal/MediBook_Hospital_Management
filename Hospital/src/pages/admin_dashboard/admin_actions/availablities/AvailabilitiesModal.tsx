import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios, { AxiosError } from "axios";
import { FaTrashAlt, FaPlus } from "react-icons/fa";
import { fetchDoctor as fetchDoctors } from "../../../../services/fetchDoctorService";
import { Formik } from "formik";
import { fetchSchedules as fetchScheduleIds } from "../../../../services/fetchSchedulesService";
import DoctorData from "../../../../interfaces/doctorsData";
import ModalProps from "../../../../interfaces/modalProps";
import BASE_URL from "../../../../services/config";

interface Schedule {
  id: string;
  date: string;
}

const AvailabilitiesModal: React.FC<ModalProps> = ({ show, handleClose }) => {
  const [doctors, setDoctors] = useState<DoctorData[]>([]);
  const [scheduleIds, setScheduleIds] = useState<Schedule[]>([]);
  const [selectedscheduleId, setSelectedScheduleId] = useState<string>("");
  const [selectedTimes, setSelectedTimes] = useState<string[]>([""]);
  const [time, setTime] = useState<string>("");
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser") || "");
  const token: string | undefined = loggedInUser?.user.authentication.token;

  useEffect(() => {
    fetchAvailableDoctors();
  }, []);

  const fetchAvailableDoctors = async () => {
    try {
      const response = await fetchDoctors(token);
      setDoctors(response.doctors);
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        const errorMessage: string = (
          axiosError.response.data as { message: string }
        ).message;
        alert(errorMessage);
      }
      throw error;
    }
  };

  const fetchSchedules = async (doctorId: string) => {
    try {
      const response = await fetchScheduleIds(token, doctorId);
      const schedules: Schedule[] = response.schedules.map(
        (schedule: Schedule) => ({ id: schedule.id, date: schedule.date })
      );
      setScheduleIds(schedules);
      if (schedules.length === 0) {
        alert("No schedule available for the selected doctor");
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        const errorMessage: string = (
          axiosError.response.data as { message: string }
        ).message;
        alert(errorMessage);
      }
      throw error;
    }
  };

  const handleSubmit = async () => {
    // console.log(selectedTimes, selectedscheduleId);
    try {
      const response = await axios.post(
        `${BASE_URL}/availabilities`,
        {
          availabilities: {
            time: selectedTimes,
            schedule_id: selectedscheduleId,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert(response.data.message);
      handleClose();
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        const errorMessage: string = (
          axiosError.response.data as { message: string }
        ).message;
        alert(errorMessage);
      }
      throw error;
    }
    setSelectedTimes([""]);
    setDoctors([]);
    setScheduleIds([]);
    setSelectedScheduleId("");
  };

  const handleAddTimeSlot = () => {
    setSelectedTimes([...selectedTimes, time]);
    setTime("");
  };

  const handleRemoveTimeSlot = (index: number) => {
    const updatedTimes = [...selectedTimes];
    updatedTimes.splice(index, 1);
    setSelectedTimes(updatedTimes);
  };

  const handleTimeChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { value } = e.target;
    const updatedTimes = [...selectedTimes];
    updatedTimes[index] = value;
    setSelectedTimes(updatedTimes);
  };

  return (
    <Modal
      show={show}
      onHide={() => {
        handleClose(), setSelectedTimes([""]);
        setScheduleIds([]);
        setSelectedScheduleId("");
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title>Set Availabilities</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={{
            selectedDoctor: "",
            selectedSchedule: "",
            selectedTimes: [""],
          }}
          onSubmit={handleSubmit}
        >
          {({ handleSubmit, isSubmitting }) => (
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="selectedDoctor">
                <Form.Label>Select Doctor</Form.Label>
                <Form.Control
                  as="select"
                  name="selectedDoctor"
                  onChange={(e) => {
                    const selectedDoctorId = e.target.value;
                    fetchSchedules(selectedDoctorId);
                  }}
                >
                  <option value="">Select Doctor</option>
                  {doctors.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.first_name} {doctor.last_name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="selectedSchedule">
                <Form.Label>Select Date</Form.Label>
                <Form.Control
                  as="select"
                  name="selectedSchedule"
                  onChange={(e) => {
                    const selectedScheduleid = e.target.value;
                    setSelectedScheduleId(selectedScheduleid);
                  }}
                >
                  <option value="">Select Date</option>
                  {scheduleIds.map((schedule) => (
                    <option key={schedule.id} value={schedule.id}>
                      {schedule.date}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="selectedTimes">
                <Form.Label>Select Time Slots</Form.Label>
                {selectedTimes.map((time, index) => (
                  <div key={index} className="time-picker-container">
                    <input
                      type="text"
                      value={time}
                      onChange={(e) => handleTimeChange(e, index)}
                      className="time-picker"
                    />
                    <Button
                      variant="light"
                      onClick={() => handleRemoveTimeSlot(index)}
                      className="remove-time-slot-button"
                    >
                      <FaTrashAlt />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="primary"
                  onClick={handleAddTimeSlot}
                  className="add-time-slot-button"
                >
                  <FaPlus />
                </Button>
              </Form.Group>
              <Button
                className="mt-3"
                type="submit"
                variant="primary"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "Creating Availability..."
                  : "Create Availabiltiy"}
              </Button>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

export default AvailabilitiesModal;
