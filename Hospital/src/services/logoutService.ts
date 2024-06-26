import axios from "axios";
import BASE_URL from "./config";


export const logoutUser = async(token: string | undefined) => {
        const response = await axios.delete(
          `${BASE_URL}/session`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        localStorage.removeItem("loggedInUser");
  
        return response.data
} 


