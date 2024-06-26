import axios from "axios";
import BASE_URL from "./config";
import PatientValues from "../interfaces/patientForm";

export const createPatient = async(values: PatientValues) => {
        const response = await axios.post(
          `${BASE_URL}/patients`,
          { patient: values },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
  
        return response.data;
} 




