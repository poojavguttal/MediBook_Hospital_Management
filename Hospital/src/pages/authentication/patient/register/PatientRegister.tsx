import React from "react";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import { Row, Col, Button } from "react-bootstrap";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import "./PatientRegister.css";
import PatientImage from "../../../../assets/images/patient-image.png";
import PatientValues from "../../../../interfaces/patientForm";
import { createPatient } from "../../../../services/createPatientService";

interface ErrorValues {
  first_name?: string;
  last_name?: string;
  email?: string;
  password?: string;
  password_confirmation?: string;
  contact_number?: string;
}

const PatientRegister: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = async (
    values: PatientValues,
    actions: FormikHelpers<PatientValues>
  ) => {
    try {
      const response = await createPatient(values);
      alert(response.message);
      navigate("/patientlogin");
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
    actions.setSubmitting(false);
  };

  return (
    <div className="container">
      <div className="row justify-content-center align-items-center login-container">
        <div className="col-lg-9 border p-4">
          <h2 className="text-center mb-4">Patient Registration</h2>
          <div className="row">
            <div className="col-md-6 mt-4">
              <img
                src={PatientImage}
                alt="doctor"
                className="img-fluid border mb-4"
              />
            </div>
            <div className="col-md-6">
              <Formik
                initialValues={{
                  first_name: "",
                  last_name: "",
                  email: "",
                  password: "",
                  password_confirmation: "",
                  contact_number: "",
                }}
                validate={(values) => {
                  const errors: ErrorValues = {};
                  if (!values.first_name) {
                    errors.first_name = "First Name is required";
                  }
                  if (!values.last_name) {
                    errors.last_name = "Last Name is required";
                  }
                  if (!values.email) {
                    errors.email = "Email is required";
                  } else if (
                    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
                      values.email
                    )
                  ) {
                    errors.email = "Invalid email address";
                  }
                  if (!values.password) {
                    errors.password = "Password is required";
                  }
                  if (!values.password_confirmation) {
                    errors.password_confirmation =
                      "Confirm Password is required";
                  } else if (values.password_confirmation !== values.password) {
                    errors.password_confirmation = "Passwords do not match";
                  }
                  if (!values.contact_number) {
                    errors.contact_number = "Contact Number is required";
                  }
                  return errors;
                }}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting }) => (
                  <Form>
                    <Row>
                      <Col md={6}>
                        <div className="form-style">
                          <label className="label-lef">First Name</label>
                          <Field
                            type="text"
                            name="first_name"
                            className="form-control"
                          />
                          <ErrorMessage
                            name="first_name"
                            component="div"
                            className="text-danger"
                          />
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="form-style">
                          <label className="label-lef">Last Name</label>
                          <Field
                            type="text"
                            name="last_name"
                            className="form-control"
                          />
                          <ErrorMessage
                            name="last_name"
                            component="div"
                            className="text-danger"
                          />
                        </div>
                      </Col>
                    </Row>
                    <div className="form-style">
                      <label className="label-lef">Email</label>
                      <Field
                        type="email"
                        name="email"
                        className="form-control"
                      />
                      <ErrorMessage
                        name="email"
                        component="div"
                        className="text-danger"
                      />
                    </div>
                    <Row>
                      <Col md={6}>
                        <div className="form-style">
                          <label className="label-lef">Password</label>
                          <Field
                            type="password"
                            name="password"
                            className="form-control"
                          />
                          <ErrorMessage
                            name="password"
                            component="div"
                            className="text-danger"
                          />
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="form-style">
                          <label className="label-lef">Confirm Password</label>
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
                        </div>
                      </Col>
                    </Row>
                    <div className="form-style">
                      <label className="label-lef">Contact Number</label>
                      <Field
                        type="text"
                        name="contact_number"
                        className="form-control"
                      />
                      <ErrorMessage
                        name="contact_number"
                        component="div"
                        className="text-danger"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="btn btn-primary btn-block form-control"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Registering..." : "Register"}
                    </Button>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientRegister;
