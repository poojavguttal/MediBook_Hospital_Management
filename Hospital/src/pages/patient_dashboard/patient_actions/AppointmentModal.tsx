import React, { ChangeEvent, useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { Formik, Field, ErrorMessage, FormikHelpers } from "formik";
import axios, { AxiosError } from "axios";
import BASE_URL from "../../../services/config";

interface Schedule {
  id: string;
  date: string;
  is_holiday: boolean;
}

interface Availability {
  id: string;
  time: string;
}

interface Props {
  doctorId: string;
  showModal: boolean;
  closeModal: () => void;
}

const AppointmentModal: React.FC<Props> = ({
  doctorId,
  showModal,
  closeModal,
}) => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser") || "");
  const token: string | undefined = loggedInUser?.user.authentication.token;

  useEffect(() => {
    if (showModal) {
      fetchSchedules();
    }
  }, [showModal]);

  const fetchSchedules = async () => {
    try {
      const response = await axios.get<{ schedules: Schedule[] }>(
        `${BASE_URL}/doctors/${doctorId}/schedules`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const filteredSchedules = response.data.schedules.filter(
        (schedule) => !schedule.is_holiday
      );
      setSchedules(filteredSchedules);
    } catch (error) {
      console.error("Error fetching schedules:", error);
    }
  };

  const handleScheduleChange = async (scheduleId: string) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/schedules/${scheduleId}/availabilities`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAvailabilities(response.data.schedule.availabilities);
    } catch (error) {
      console.error("Error fetching availabilities:", error);
    }
  };

  const handleSubmit = async (
    values: { schedule: string; availability: string },
    actions: FormikHelpers<{ schedule: string; availability: string }>
  ) => {
    try {
      console.log(doctorId, values.schedule, values.availability);
      const appointmentData = {
        appointment: {
          doctor_id: doctorId,
          schedule_id: values.schedule,
          availability_id: values.availability,
        },
      };
      await axios.post(
        "https://psl-test2-b8593d29856b.herokuapp.com/api/v1/appointments",
        appointmentData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Appointment Booked Successfully");
      closeModal();
      setAvailabilities([]);
    } catch (error) {
      console.log(error);
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        const errorMessage: string = (
          axiosError.response.data as { message: string }
        ).message;
        console.log(errorMessage);
      }
      throw error;
    }
    actions.setSubmitting(false);
  };

  const validate = (values: { schedule?: string; availability?: string }) => {
    const errors: { schedule?: string; availability?: string } = {};
    if (!values.schedule) {
      errors.schedule = "Schedule is required";
    }
    if (!values.availability) {
      errors.availability = "Availability is required";
    }
    return errors;
  };

  return (
    <Modal
      show={showModal}
      onHide={() => {
        setAvailabilities([]), closeModal();
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title>Book Appointment</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {schedules.length === 0 ? (
          <div>No dates available</div>
        ) : (
          <Formik
            initialValues={{ schedule: "", availability: "" }}
            validate={validate}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, handleSubmit, setFieldValue }) => (
              <Form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="schedule">Select Schedule:</label>
                  <Field
                    as="select"
                    name="schedule"
                    className="form-control"
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                      const selectedScheduleId = e.target.value;
                      setFieldValue("schedule", selectedScheduleId);
                      handleScheduleChange(selectedScheduleId);
                    }}
                  >
                    <option value="">Select</option>
                    {schedules.map((schedule) => (
                      <option key={schedule.id} value={schedule.id}>
                        {schedule.date}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="schedule"
                    component="div"
                    className="text-danger"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="availability">Select Availability:</label>
                  <Field
                    as="select"
                    name="availability"
                    className="form-control"
                  >
                    <option value="">Select</option>
                    {availabilities?.map((availability) => (
                      <option key={availability.id} value={availability.id}>
                        {availability.time}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="availability"
                    component="div"
                    className="text-danger"
                  />
                </div>
                <Button variant="primary" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Book Appointment"}
                </Button>
              </Form>
            )}
          </Formik>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default AppointmentModal;
