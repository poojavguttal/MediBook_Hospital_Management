import { Outlet } from "react-router-dom";
import { Navbar } from "../navbar";
import { Footer } from "../footer";
import { Link } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import DoctorImage from "../../assets/images/login-image.png";
import PatientImage from "../../assets/images/patient-image.png";
import "./Routing.css";

const Routing: React.FC = () => {
  return (
    <>
      <Navbar />
      <main>
        <Row className="justify-content-center mt-5">
          <Col xs={6} className="text-center">
            <h2>Welcome to MediBook</h2>
            <p>Find the best healthcare services here.</p>
          </Col>
        </Row>
        <Row className="justify-content-center mt-5">
          <Col xs={6} md={3} className="text-center">
            <div className="home-section">
              <img src={DoctorImage} alt="Doctor" className="home-image" />
              <Link to="/adminlogin" className="home-link">
                Admin / Doctor Login
              </Link>
            </div>
          </Col>
          <Col xs={6} md={3} className="text-center">
            <div className="home-section">
              <img src={PatientImage} alt="Patient" className="home-image" />
              <Link to="/patientRegister" className="home-link">
                Register Patient
              </Link>
              <Link to="/patientlogin" className="home-link">
                Patient Login
              </Link>
            </div>
          </Col>
        </Row>
        <Outlet />
      </main>
      <br></br>
      <br></br>
      <br></br>
      <Footer />
    </>
  );
};

export default Routing;
