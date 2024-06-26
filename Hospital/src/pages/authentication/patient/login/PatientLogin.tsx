import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import PatientImage from "../../../../assets/images/patient-image.png";
import "./PatientLogin.css";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import AuthProps from "../../../../interfaces/authProps";
import BASE_URL from "../../../../services/config";

interface FormValues {
  email: string;
  password: string;
  role: string;
}
interface ErrorValues {
  email?: string;
  password?: string;
  role?: string;
}

// eslint-disable-next-line react/prop-types
const PatientLogin: React.FC<AuthProps> = ({ checkAuthenticatedUser }) => {
  const navigate = useNavigate();

  const handleSubmit = async (
    values: FormValues,
    actions: FormikHelpers<FormValues>
  ) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/session`,
        {
          user: {
            email: values.email,
            password: values.password,
            role: values.role,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      localStorage.setItem("loggedInUser", JSON.stringify(response.data));
      checkAuthenticatedUser();
      navigate("/patient");
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
          <h2 className="text-center mb-4">Patient Login</h2>
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
                initialValues={{ email: "", password: "", role: "" }}
                validate={(values) => {
                  const errors: ErrorValues = {};
                  if (!values.email) {
                    errors.email = "Email Required";
                  } else if (
                    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
                      values.email
                    )
                  ) {
                    errors.email = "Invalid email address";
                  }
                  if (!values.password) {
                    errors.password = "Password Required";
                  }
                  if (!values.role) {
                    errors.role = "Please select a role";
                  }
                  return errors;
                }}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting }) => (
                  <Form>
                    <div className="form-group">
                      <label htmlFor="email" className="label-left">
                        Email
                      </label>
                      <Field
                        type="email"
                        name="email"
                        className="form-control"
                        placeholder="Enter your email"
                      />
                      <ErrorMessage
                        name="email"
                        component="div"
                        className="text-danger"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="password" className="label-left">
                        Password
                      </label>
                      <Field
                        type="password"
                        name="password"
                        className="form-control"
                        placeholder="Enter your password"
                      />
                      <ErrorMessage
                        name="password"
                        component="div"
                        className="text-danger"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="role" className="label-left">
                        Role
                      </label>
                      <Field as="select" name="role" className="form-control">
                        <option value="">Select Role</option>
                        <option value="patient">Patient</option>
                      </Field>
                      <ErrorMessage
                        name="role"
                        component="div"
                        className="text-danger"
                      />
                    </div>
                    <button
                      type="submit"
                      className="btn btn-primary btn-block form-control"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Logging in..." : "Login"}
                    </button>
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

export default PatientLogin;
