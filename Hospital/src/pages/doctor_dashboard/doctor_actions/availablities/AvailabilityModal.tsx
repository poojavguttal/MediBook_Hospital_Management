import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import axios, { AxiosError } from "axios";
import BASE_URL from "../../../../services/config";

interface AvailabilityModalProps {
  show: boolean;
  handleClose: () => void;
  scheduleId: string;
}

const AvailabilityModal: React.FC<AvailabilityModalProps> = ({
  show,
  handleClose,
  scheduleId,
}) => {
  const [availabilities, setAvailabilities] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);
  const [hasPrevPage, setHasPrevPage] = useState<boolean>(false);
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser") || "");
  const token: string | undefined = loggedInUser?.user.authentication.token;

  useEffect(() => {
    const fetchAvailabilities = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/schedules/${scheduleId}/availabilities?page=${page}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const { schedule, pagination } = response.data;
        setAvailabilities(schedule.availabilities);
        setHasNextPage(!!pagination.next);
        setHasPrevPage(!!pagination.prev);
      } catch (error) {
        const axiosError = error as AxiosError;
        if (axiosError.response) {
          const errorMessage: string = (
            axiosError.response.data as { message: string }
          ).message;
          alert(errorMessage);
        }
      }
    };

    if (show) {
      fetchAvailabilities();
    }
  }, [show, scheduleId, token, page]);

  const nextPage = () => {
    setPage(page + 1);
  };

  const prevPage = () => {
    setPage(page - 1);
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Availabilities</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ul>
          {availabilities.map((availability) => (
            <li key={availability.id}>{availability.time}</li>
          ))}
        </ul>
      </Modal.Body>
      <Modal.Footer>
        {hasPrevPage && (
          <Button variant="primary" onClick={prevPage}>
            Previous
          </Button>
        )}
        {hasNextPage && (
          <Button variant="primary" onClick={nextPage}>
            Next
          </Button>
        )}
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AvailabilityModal;
