import React, { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import axios, { AxiosError } from "axios";
import BASE_URL from "../../../../services/config";

interface UpdateModalProps {
  show: boolean;
  handleClose: () => void;
  scheduleId: string;
  updateSchedules: () => void;
}

const UpdateModal: React.FC<UpdateModalProps> = ({
  show,
  handleClose,
  scheduleId,
  updateSchedules,
}) => {
  const [isHoliday, setIsHoliday] = useState(false);
  const [loading, setLoading] = useState(false);
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser") || "");
  const token: string | undefined = loggedInUser?.user.authentication.token;

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsHoliday(e.target.checked);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const response = await axios.patch(
        `${BASE_URL}/doctors/${loggedInUser?.user.id}/schedules/${scheduleId}`,
        {
          schedule: {
            is_holiday: isHoliday,
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
      setLoading(false);
      setIsHoliday(false);
      handleClose();
      updateSchedules();
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        const errorMessage: string = (
          axiosError.response.data as { message: string }
        ).message;
        alert(errorMessage);
      }
      setLoading(false);
    }
  };

  return (
    <Modal
      show={show}
      onHide={() => {
        setIsHoliday(false), handleClose();
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title>Update Schedule</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formBasicCheckbox">
            <Form.Check
              type="checkbox"
              label="Mark as Holiday"
              checked={isHoliday}
              onChange={handleCheckboxChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={loading}>
          {loading ? "Loading..." : "Submit"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UpdateModal;
