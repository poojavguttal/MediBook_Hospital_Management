import axios from "axios";
import BASE_URL from "./config";


export const fetchDoctor = async(token:string | undefined,) => {
        const response = await axios.get(
          `${BASE_URL}/doctors`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        return response.data
} 


