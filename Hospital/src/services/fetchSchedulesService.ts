import axios from "axios";
import BASE_URL from "./config";


export const fetchSchedules = async(token:string | undefined, doctorId:string) => {
        const response = await axios.get(
          `${BASE_URL}/doctors/${doctorId}/schedules`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        return response.data
} 


