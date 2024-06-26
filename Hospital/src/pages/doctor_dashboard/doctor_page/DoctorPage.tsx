import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserCircle,
  faMailReply,
  faPhone,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import "./DoctorPage.css";
import { Logout } from "../../../components/logout";
import { Button, Table } from "react-bootstrap";
import axios, { AxiosError } from "axios";
import { UpdateModal } from "../doctor_actions/update_availablity";
import AvailabilityModal from "../doctor_actions/availablities/AvailabilityModal";
import BASE_URL from "../../../services/config";

const DoctorPage: React.FC = () => {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser") || "");
  const token: string | undefined = loggedInUser?.user.authentication.token;
  const [schedules, setSchedules] = useState<
    { id: string; date: string; is_holiday: boolean }[]
  >([]);
  const [page, setPage] = useState<number>(1);
  const [hasNext, setHasNext] = useState<boolean>(false);
  const [hasPrevious, setHasPrevious] = useState<boolean>(false);
  const [selectedScheduleId, setSelectedScheduleId] = useState<string>("");
  const [showAvailabilityModal, setShowAvailabilityModal] =
    useState<boolean>(false);
  const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false);

  useEffect(() => {
    fetchSchedules();
  }, [page]);

  const fetchSchedules = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/doctors/${loggedInUser?.user.id}/schedules?page=${page}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { schedules: fetchedSchedules, pagination } = response.data;
      setSchedules(fetchedSchedules);
      setHasNext(pagination.next !== null);
      setHasPrevious(pagination.page > 1);
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

  const handleNextPage = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    setPage((prevPage) => prevPage - 1);
  };

  const handleScheduleClick = async (scheduleId: string) => {
    setSelectedScheduleId(scheduleId);
    setShowAvailabilityModal(true);
  };

  const handleUpdateClick = (scheduleId: string) => {
    setSelectedScheduleId(scheduleId);
    setShowUpdateModal(true);
  };

  const handleCloseAvailabilityModal = () => {
    setShowAvailabilityModal(false);
    setSelectedScheduleId("");
  };

  const handleCloseUpdateModal = () => {
    setShowUpdateModal(false);
    setSelectedScheduleId("");
  };

  const updateSchedules = async () => {
    fetchSchedules();
  };

  return (
    <>
      <div className="doctor-page-container">
        <div className="sidebar">
          <div className="profile">
            <FontAwesomeIcon icon={faUserCircle} className="profile-icon" />
            <p className="doctor-name">
              Dr. {loggedInUser?.user.first_name} {loggedInUser?.user.last_name}
            </p>
          </div>
          <ul className="activity-list">
            <li>
              <p>Doctor Details</p>
            </li>
            <li>
              <Button>
                <FontAwesomeIcon icon={faArrowRight} />
                Role {loggedInUser?.user.role}
              </Button>
            </li>
            <li>
              <Button>
                <FontAwesomeIcon icon={faMailReply} />
                {loggedInUser?.user.email}
              </Button>
            </li>
            <li>
              <Button>
                <FontAwesomeIcon icon={faPhone} />
                {loggedInUser?.user.contact_number}
              </Button>
            </li>
            <li></li>
            <li className="logout">
              <Logout />
            </li>
          </ul>
        </div>
        <div className="content">
          <h2>Schedules</h2>
          <div className="schedule-table-container">
            <Table bordered hover>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {schedules.length === 0 ? (
                  <p>No schedules created</p>
                ) : (
                  schedules.map((schedule) => (
                    <tr key={schedule.id}>
                      <td>{schedule.date}</td>
                      <td>
                        {schedule.is_holiday ? (
                          <span>Holiday</span>
                        ) : (
                          <>
                            <Button
                              size="sm"
                              className="action-button"
                              variant="primary"
                              style={{ marginRight: "20px" }}
                              onClick={() => handleScheduleClick(schedule.id)}
                            >
                              View Availabilities
                            </Button>
                            <Button
                              size="sm"
                              className="action-button"
                              variant="success"
                              onClick={() => handleUpdateClick(schedule.id)}
                            >
                              Update
                            </Button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
            <div className="pagination-buttons">
              {hasPrevious && (
                <Button onClick={handlePreviousPage} variant="primary">
                  Previous
                </Button>
              )}
              {hasNext && (
                <Button onClick={handleNextPage} variant="primary">
                  Next
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      <AvailabilityModal
        show={showAvailabilityModal}
        handleClose={handleCloseAvailabilityModal}
        scheduleId={selectedScheduleId}
      />
      <UpdateModal
        show={showUpdateModal}
        handleClose={handleCloseUpdateModal}
        scheduleId={selectedScheduleId}
        updateSchedules={updateSchedules}
      />
    </>
  );
};

export default DoctorPage;
