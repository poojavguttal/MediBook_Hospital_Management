import axios from "axios";
import BASE_URL from "./config";
import Doctor from "../interfaces/doctorForm";

export const createDoctor = async(token: string | undefined, values: Doctor) => {
    const doctorData = {
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
        password: values.password,
        password_confirmation: values.password_confirmation,
        contact_number: values.contact_number,
        qualifications: values.qualifications,
      };
        const response = await axios.post(
          `${BASE_URL}/doctor`,
          { doctor: doctorData },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        return response.data;
} 




