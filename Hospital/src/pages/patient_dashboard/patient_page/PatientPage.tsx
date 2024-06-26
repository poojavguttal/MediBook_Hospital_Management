import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserCircle,
  faMailReply,
  faPhone,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import "./PatientPage.css";

import { Logout } from "../../../components/logout";
import { Button, Table, Spinner } from "react-bootstrap";
import axios, { AxiosError } from "axios";
import { AppointmentModal } from "../patient_actions";
import BASE_URL from "../../../services/config";

const PatientPage: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [doctors, setDoctors] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any | null>(null);
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser") || "");
  const token: string | undefined = loggedInUser?.user.authentication.token;

  useEffect(() => {
    fetchDoctorsData();
  }, []);

  const fetchDoctorsData = async (page = 1) => {
    try {
      const response = await axios.get(`${BASE_URL}/doctors?page=${page}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setDoctors(response.data.doctors);
      setPagination(response.data.pagination);
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

  const handleBookAppointment = (doctorId: string) => {
    setSelectedDoctorId(doctorId);
    setShowModal(true);
  };

  return (
    <div className="patient-page-container">
      <div className="sidebar">
        <div className="profile">
          <FontAwesomeIcon icon={faUserCircle} className="profile-icon" />
          <p className="patient-name">
            {loggedInUser?.user.first_name} {loggedInUser?.user.last_name}
          </p>
        </div>

        <ul className="activity-list">
          <li>
            <p>Patient Details</p>
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
        <h2>Doctors</h2>
        {doctors.length === 0 && !pagination ? (
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        ) : (
          <Table bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Qualifications</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((doctor, index) => (
                <tr key={doctor.id}>
                  <td>{index + 1}</td>
                  <td>{doctor.first_name}</td>
                  <td>{doctor.last_name}</td>
                  <td>
                    {doctor.qualifications.map(
                      (qualification: { degree: string }) => (
                        <span key={qualification.degree}>
                          {qualification.degree}
                          <br />
                        </span>
                      )
                    )}
                  </td>
                  <td>
                    <Button onClick={() => handleBookAppointment(doctor.id)}>
                      Book Appointment
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
        {pagination && (
          <div className="pagination">
            <Button
              disabled={pagination.page === 1}
              onClick={() => fetchDoctorsData(pagination.page - 1)}
            >
              Previous
            </Button>
            <span>{`Page ${pagination.page} of ${pagination.pages}`}</span>
            <Button
              disabled={!pagination.next}
              onClick={() => fetchDoctorsData(pagination.page + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </div>

      <AppointmentModal
        doctorId={selectedDoctorId}
        showModal={showModal}
        closeModal={() => setShowModal(false)}
      />
    </div>
  );
};

export default PatientPage;
