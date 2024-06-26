import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserCircle,
  faUserMd,
  faCalendarAlt,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import { Button, Table } from "react-bootstrap";
import { useState } from "react";
import "./AdminPage.css";
import { QualificationModal } from "../admin_actions/qualifications";
import { ScheduleModal } from "../admin_actions/schedules";
import { DoctorModal } from "../admin_actions/doctors";
import { Logout } from "../../../components/logout";
import { AvailabilitiesModal } from "../admin_actions/availablities";
// import Doctor from "../../../interfaces/doctorForm";
import axios, { AxiosError } from "axios";
import BASE_URL from "../../../services/config";

interface Pagination {
  page: number;
  items: number;
  count: number;
  from: number;
  last: number;
  next: number | null;
  pages: number;
  to: number;
}

interface Doctor {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password_confirmation: string;
  contact_number: string;
  qualifications: [
    {
      degree: string;
    },
  ];
}

const AdminPage: React.FC = () => {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser") || "");
  const token: string | undefined = loggedInUser?.user.authentication.token;
  const [showQualificationModal, setShowQualificationModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [showAvailableModal, setShowAvailableModal] = useState(false);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  useEffect(() => {
    fetchDoctorsData();
  }, []);

  const updateDoctors = async () => {
    fetchDoctorsData();
  };

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
      throw error;
    }
  };

  const handlePaginationClick = (page: number) => {
    fetchDoctorsData(page);
  };

  return (
    <div className="admin-page">
      <div className="sidebar">
        <div className="profile">
          <FontAwesomeIcon icon={faUserCircle} className="profile-icon" />
          <p className="admin-name">
            {loggedInUser?.user.first_name} {loggedInUser?.user.last_name}
          </p>
        </div>
        <ul className="activity-list">
          <li>
            <Button
              onClick={() => {
                setShowQualificationModal(true);
              }}
            >
              <FontAwesomeIcon icon={faUserMd} /> Create Qualification
            </Button>
          </li>
          <li>
            <Button
              onClick={() => {
                setShowScheduleModal(true);
              }}
            >
              <FontAwesomeIcon icon={faCalendarAlt} /> Create Schedules
            </Button>
          </li>
          <li>
            <Button
              onClick={() => {
                setShowAvailableModal(true);
              }}
            >
              <FontAwesomeIcon icon={faClock} /> Create Availability
            </Button>
          </li>
          <li>
            <Button
              onClick={() => {
                setShowDoctorModal(true);
              }}
            >
              <FontAwesomeIcon icon={faUserMd} /> Create Doctor
            </Button>
          </li>
          <li className="logout">
            <Logout />
          </li>
        </ul>
      </div>
      <div className="content">
        <h2>Doctors</h2>
        {doctors.length === 0 ? (
          <p>Loading...</p>
        ) : (
          <Table bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Contact Number</th>
                <th>Email</th>
                <th>Qualification</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((doctor, index) => (
                <tr key={doctor.id}>
                  <td>{index + 1}</td>
                  <td>{doctor.first_name}</td>
                  <td>{doctor.last_name}</td>
                  <td>{doctor.contact_number}</td>
                  <td>{doctor.email}</td>
                  <td>
                    {doctor.qualifications.map((qualification, index) => (
                      <span key={index}>
                        {qualification.degree}
                        {index !== doctor.qualifications.length - 1 && ", "}
                      </span>
                    ))}
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
              onClick={() => handlePaginationClick(pagination.page - 1)}
            >
              Previous
            </Button>
            <span>{`Page ${pagination.page} of ${pagination.pages}`}</span>
            <Button
              disabled={!pagination.next}
              onClick={() => handlePaginationClick(pagination.page + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </div>

      <QualificationModal
        show={showQualificationModal}
        handleClose={() => {
          setShowQualificationModal(false);
        }}
      />

      <AvailabilitiesModal
        show={showAvailableModal}
        handleClose={() => {
          setShowAvailableModal(false);
        }}
      />

      <ScheduleModal
        show={showScheduleModal}
        handleClose={() => {
          setShowScheduleModal(false);
        }}
      />

      <DoctorModal
        show={showDoctorModal}
        handleClose={() => setShowDoctorModal(false)}
        updateDoctors={updateDoctors}
      />
    </div>
  );
};

export default AdminPage;
