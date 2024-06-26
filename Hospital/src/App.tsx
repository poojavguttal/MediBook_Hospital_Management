import "./App.css";
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import { Routing } from "./components/routing";
import { AdminLogin } from "./pages/authentication/admin_doctor";
import { AdminDashboard } from "./pages/admin_dashboard/admin_page";
import { useEffect, useState } from "react";
import { PatientRegister } from "./pages/authentication/patient/register";
import { PatientLogin } from "./pages/authentication/patient/login";
import { DoctorDashboard } from "./pages/doctor_dashboard/doctor_page";
import { PatientDashboard } from "./pages/patient_dashboard/patient_page";

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isDoctor, setIsDoctor] = useState(false);
  const [isPatient, setIsPatient] = useState(false);

  const checkAuthenticatedUser = () => {
    const isLoggedInUser = localStorage.getItem("loggedInUser");
    if (isLoggedInUser) {
      const parsedUser = JSON.parse(isLoggedInUser);
      setAuthenticated(true);
      if (parsedUser) {
        setIsAdmin(parsedUser.user.role === "admin");
        setIsDoctor(parsedUser.user.role === "doctor");
        setIsPatient(parsedUser.user.role === "patient");
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    checkAuthenticatedUser();
  }, []);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Routing />,
      children: [
        {
          path: "/adminlogin",
          element: (
            <AdminLogin checkAuthenticatedUser={checkAuthenticatedUser} />
          ),
        },
        {
          path: "/patientRegister",
          element: <PatientRegister />,
        },
        {
          path: "/patientlogin",
          element: (
            <PatientLogin checkAuthenticatedUser={checkAuthenticatedUser} />
          ),
        },
      ],
    },
    {
      path: "/admin",
      element: loading ? (
        <div>Loading</div>
      ) : authenticated && isAdmin ? (
        <AdminDashboard />
      ) : (
        <Navigate to="/" />
      ),
    },
    {
      path: "/doctor",
      element: loading ? (
        <div>Loading</div>
      ) : authenticated && isDoctor ? (
        <DoctorDashboard />
      ) : (
        <Navigate to="/" />
      ),
    },
    {
      path: "/patient",
      element: loading ? (
        <div>Loading</div>
      ) : authenticated && isPatient ? (
        <PatientDashboard />
      ) : (
        <Navigate to="/" />
      ),
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
