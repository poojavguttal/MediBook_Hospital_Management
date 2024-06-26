import "./Footer.css";

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="row" style={{ marginLeft: "130px" }}>
          <div className="col-md-6">
            <h5>Contact Us</h5>
            <p>Address: 123 Medical Street, City, Country</p>
            <p>Phone: +123-456-7890</p>
            <p>Email: medibook@example.com</p>
          </div>
          <div className="col-md-6">
            <h5>Opening Hours</h5>
            <p>Monday - Friday: 9:00 AM - 5:00 PM</p>
            <p>Saturday: 9:00 AM - 1:00 PM</p>
            <p>Sunday: Closed</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
