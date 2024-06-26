import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { Formik, ErrorMessage } from "formik";
import { FaTrashAlt, FaPlus } from "react-icons/fa";
import axios, { AxiosError } from "axios";
import DoctorData from "../../../../interfaces/doctorsData";

import "./ScheduleModal.css";
import { fetchDoctor as fetchDoctors } from "../../../../services/fetchDoctorService";
import ModalProps from "../../../../interfaces/modalProps";
import BASE_URL from "../../../../services/config";

interface FormErrors {
  selectedDoctor?: string;
  selectedDay?: string;
  selectedTimes?: string[];
}

interface FormValues {
  selectedDoctor: string;
  selectedDay: string;
  selectedTimes: string[];
}

const ScheduleModal: React.FC<ModalProps> = ({ show, handleClose }) => {
  const [availableDoctors, setAvailableDoctors] = useState<DoctorData[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<string>("");
  const [selectedDay, setSelectedDay] = useState<string>("Sunday");
  const [selectedTimes, setSelectedTimes] = useState<string[]>([""]);
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser") || "");
  const token: string | undefined = loggedInUser?.user.authentication.token;

  useEffect(() => {
    fetchAvailableDoctors();
  }, []);

  const fetchAvailableDoctors = async () => {
    try {
      const response = await fetchDoctors(token);
      setAvailableDoctors(response.doctors);
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

  const handleSubmit = async (values: FormValues) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/schedules`,
        {
          schedule: {
            doctor: values.selectedDoctor,
            days: [
              {
                day: values.selectedDay,
                time: values.selectedTimes,
              },
            ],
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
  };

  return (
    <Modal
      show={show}
      onHide={() => {
        handleClose();
        setSelectedDoctor("");
        setSelectedDay("Sunday");
        setSelectedTimes([""]);
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title>Create Schedule</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={{
            selectedDoctor: selectedDoctor,
            selectedDay: selectedDay,
            selectedTimes: selectedTimes,
          }}
          validate={(values) => {
            const errors: FormErrors = {};

            if (!values.selectedDoctor) {
              errors.selectedDoctor = "Please select a doctor";
            }

            if (!values.selectedDay) {
              errors.selectedDay = "Please select a day";
            }

            values.selectedTimes.forEach((time, index) => {
              if (!time.match(/^\d{2}:\d{2} (am|pm)$/i)) {
                errors.selectedTimes = errors.selectedTimes || [];
                errors.selectedTimes[index] =
                  "Please enter a valid time format (HH:MM am/pm)";
              }
            });

            return errors;
          }}
          onSubmit={handleSubmit}
        >
          {({
            handleSubmit,
            isSubmitting,
            handleChange,
            values,
            errors,
            setFieldValue,
          }) => (
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="selectedDoctor">
                <Form.Label>Select Doctor</Form.Label>
                <Form.Control
                  as="select"
                  name="selectedDoctor"
                  onChange={handleChange}
                  value={values.selectedDoctor}
                  isInvalid={!!errors.selectedDoctor}
                >
                  <option value="">Select Doctor</option>
                  {availableDoctors.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.first_name} {doctor.last_name}
                    </option>
                  ))}
                </Form.Control>
                <ErrorMessage
                  name="selectedDoctor"
                  component="div"
                  className="text-danger"
                />
              </Form.Group>
              <Form.Group controlId="selectedDay">
                <Form.Label>Select Day</Form.Label>
                <Form.Control
                  as="select"
                  name="selectedDay"
                  onChange={handleChange}
                  value={values.selectedDay}
                  isInvalid={!!errors.selectedDay}
                >
                  <option value="">Select Day</option>
                  {[
                    "Sunday",
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                  ].map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </Form.Control>
                <ErrorMessage
                  name="selectedDay"
                  component="div"
                  className="text-danger"
                />
              </Form.Group>
              <Form.Group controlId="selectedTimes">
                <Form.Label>Select Time Slots</Form.Label>
                {values.selectedTimes.map((time, index) => (
                  <div key={index} className="time-picker-container">
                    <input
                      type="text"
                      value={time}
                      onChange={(e) => {
                        // Update selectedTimes using setFieldValue
                        setFieldValue(
                          `selectedTimes[${index}]`,
                          e.target.value
                        );
                      }}
                      className="time-picker"
                    />
                    <Button
                      variant="light"
                      onClick={() => {
                        setFieldValue(
                          "selectedTimes",
                          values.selectedTimes.filter((_, i) => i !== index)
                        );
                      }}
                      className="remove-time-slot-button"
                    >
                      <FaTrashAlt />
                    </Button>
                    {errors.selectedTimes && errors.selectedTimes[index] && (
                      <div className="text-danger">
                        {errors.selectedTimes[index]}
                      </div>
                    )}
                  </div>
                ))}
                {/* Add time slot button */}
                <Button
                  variant="primary"
                  onClick={() => {
                    setFieldValue("selectedTimes", [
                      ...values.selectedTimes,
                      "",
                    ]);
                  }}
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
                {isSubmitting ? "Creating Schedule..." : "Create Schedule"}
              </Button>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

export default ScheduleModal;
