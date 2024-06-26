import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./CustomNavbar.css";

const CustomNavbar: React.FC = () => {
  return (
    <Navbar expand="lg" variant="light" className="custom-navbar">
      <Navbar.Brand as={Link} to="/" className="navbar-heading">
        <span className="logo-text">MediBook</span>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
        <Nav>
          <Nav.Link as={Link} to="/" className="nav-link">
            Home
          </Nav.Link>
          <Nav.Link as={Link} to="/about" className="nav-link">
            About Us
          </Nav.Link>
          <Nav.Link as={Link} to="/contact" className="nav-link">
            Contact Us
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};
export default CustomNavbar;
