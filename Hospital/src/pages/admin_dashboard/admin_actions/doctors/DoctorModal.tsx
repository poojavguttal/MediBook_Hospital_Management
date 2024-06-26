import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { Formik, Field, ErrorMessage } from "formik";
import axios, { AxiosError } from "axios";
import DoctorForm from "../../../../interfaces/doctorForm";
import { createDoctor as addDoctor } from "../../../../services/createDoctorService";
import BASE_URL from "../../../../services/config";

interface Qualification {
  id: string;
  degree: string;
}

interface FormErrors {
  first_name?: string;
  last_name?: string;
  email?: string;
  password?: string;
  password_confirmation?: string;
  contact_number?: string;
  qualifications?: string[];
}
interface DoctorModalProps {
  show: boolean;
  handleClose: () => void;
  updateDoctors: () => void;
}

const DoctorModal: React.FC<DoctorModalProps> = ({
  show,
  handleClose,
  updateDoctors,
}) => {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser") || "");
  const token: string | undefined = loggedInUser?.user.authentication.token;
  const [qualifications, setQualifications] = useState<Qualification[]>([]);

  useEffect(() => {
    const fetchQualifications = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/qualifications?page=1`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        setQualifications(response.data.qualifications);
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

    fetchQualifications();
  }, []);

  const handleSubmit = async (values: DoctorForm) => {
    try {
      const response = await addDoctor(token, values);

      alert(response.message);

      handleClose();
      updateDoctors();
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
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Create Doctor</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={{
            id: "",
            first_name: "",
            last_name: "",
            email: "",
            password: "",
            password_confirmation: "",
            contact_number: "",
            qualifications: [],
          }}
          onSubmit={handleSubmit}
          validate={(values) => {
            const errors: FormErrors = {};
            if (!values.first_name) {
              errors.first_name = "First Name is required";
            } else if (!/^[a-zA-Z]+$/.test(values.first_name)) {
              errors.first_name = "Invalid first name";
            }
            if (!values.last_name) {
              errors.last_name = "Last Name is required";
            } else if (!/^[a-zA-Z]+$/.test(values.last_name)) {
              errors.last_name = "Invalid last name";
            }
            if (!values.email) {
              errors.email = "Email is required";
            } else if (!/^\S+@\S+\.\S+$/.test(values.email)) {
              errors.email = "Invalid email address";
            }
            if (!values.password) {
              errors.password = "Password is required";
            } else if (values.password.length < 8) {
              errors.password = "Password must be at least 8 characters";
            }
            if (!values.password_confirmation) {
              errors.password_confirmation =
                "Password Confirmation is required";
            } else if (values.password !== values.password_confirmation) {
              errors.password_confirmation = "Passwords do not match";
            }
            if (!values.contact_number) {
              errors.contact_number = "Contact Number is required";
            } else if (!/^\d{10}$/.test(values.contact_number)) {
              errors.contact_number = "Invalid contact number";
            }

            return errors;
          }}
        >
          {({ handleSubmit, isSubmitting }) => (
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col>
                  <Form.Group controlId="first_name">
                    <Form.Label className="mt-2">First Name</Form.Label>
                    <Field name="first_name" className="form-control" />
                    <ErrorMessage
                      name="first_name"
                      component="div"
                      className="text-danger"
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="last_name">
                    <Form.Label className="mt-2">Last Name</Form.Label>
                    <Field name="last_name" className="form-control" />
                    <ErrorMessage
                      name="last_name"
                      component="div"
                      className="text-danger"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group controlId="email">
                    <Form.Label className="mt-2">Email</Form.Label>
                    <Field type="email" name="email" className="form-control" />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-danger"
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="password">
                    <Form.Label className="mt-2">Password</Form.Label>
                    <Field
                      type="password"
                      name="password"
                      className="form-control"
                      autoComplete="new-password"
                    />
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-danger"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group controlId="password_confirmation">
                    <Form.Label className="mt-2">
                      Password Confirmation
                    </Form.Label>
                    <Field
                      type="password"
                      name="password_confirmation"
                      className="form-control"
                    />
                    <ErrorMessage
                      name="password_confirmation"
                      component="div"
                      className="text-danger"
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="contact_number">
                    <Form.Label className="mt-2">Contact Number</Form.Label>
                    <Field name="contact_number" className="form-control" />
                    <ErrorMessage
                      name="contact_number"
                      component="div"
                      className="text-danger"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group controlId="qualifications">
                    <Form.Label className="mt-2">Qualifications</Form.Label>
                    <Field
                      as="select"
                      name="qualifications"
                      className="form-control"
                      multiple
                    >
                      {/* <option value="">Select Qualification</option> */}
                      {qualifications?.map((qualification) => (
                        <option key={qualification.id} value={qualification.id}>
                          {qualification.degree}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="qualifications"
                      component="div"
                      className="text-danger"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Button
                className="mt-3"
                type="submit"
                variant="primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating Doctor..." : "Create Doctor"}
              </Button>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

export default DoctorModal;
