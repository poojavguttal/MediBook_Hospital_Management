import React from "react";
import { Modal, Button, Form } from "react-bootstrap";
import {
  Formik,
  Field,
  Form as FormikForm,
  ErrorMessage,
  FormikHelpers,
} from "formik";
import { createQualification as addQualification } from "../../../../services/qualificationService";
import QualificationValues from "../../../../interfaces/qualificationForm";
import { AxiosError } from "axios";
import ModalProps from "../../../../interfaces/modalProps";

interface FormErrors {
  degree?: string;
  description?: string;
}

const QualificationModal: React.FC<ModalProps> = ({ show, handleClose }) => {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser") || "");
  const token: string | undefined = loggedInUser?.user.authentication.token;

  const handleSubmit = async (
    values: QualificationValues,
    actions: FormikHelpers<QualificationValues>
  ) => {
    try {
      const response = await addQualification(token, values);
      alert(response.message);
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
    actions.setSubmitting(false);
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Create Qualification</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={{ degree: "", description: "" }}
          validate={(values) => {
            const errors: FormErrors = {};
            if (!values.degree) {
              errors.degree = "Degree Required";
            } else if (!/^[a-zA-Z ]+$/.test(values.degree)) {
              errors.degree =
                "Invalid degree name. No numericals or special characters allowed";
            }
            if (!values.description) {
              errors.description = "Description Required";
            } else if (!/^[a-zA-Z ]+$/.test(values.description)) {
              errors.description =
                "Invalid description. No numericals or special characters allowed";
            }
            return errors;
          }}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <FormikForm>
              <Form.Group controlId="degree">
                <Form.Label>Degree</Form.Label>
                <Field
                  type="text"
                  name="degree"
                  className="form-control mb-3"
                />
                <ErrorMessage
                  name="degree"
                  component="div"
                  className="text-danger"
                />
              </Form.Group>
              <Form.Group controlId="description">
                <Form.Label>Description</Form.Label>
                <Field
                  as="textarea"
                  name="description"
                  rows={3}
                  className="form-control"
                />
                <ErrorMessage
                  name="description"
                  component="div"
                  className="text-danger"
                />
              </Form.Group>
              <Button
                className="mt-3"
                type="submit"
                variant="primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Add Qualification"}
              </Button>
            </FormikForm>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

export default QualificationModal;
