import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "react-bootstrap";
import { logoutUser as logout } from "../../services/logoutService";

import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";

const Logout: React.FC = () => {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser") || "");
  const token: string | undefined = loggedInUser?.user.authentication.token;
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      console.log({ token });

      await logout(token);

      navigate("/");
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
    <>
      <Button onClick={handleLogout}>
        <FontAwesomeIcon icon={faSignOutAlt} /> Logout
      </Button>
    </>
  );
};

export default Logout;
