import axios from "axios";
import BASE_URL from "./config";
import QualificationValues from "../interfaces/qualificationForm";

export const createQualification = async(token: string | undefined, values: QualificationValues) => {
        const response = await axios.post(
          `${BASE_URL}/qualifications`,
          {
            qualification: {
              degree: values.degree,
              description: values.description,
            },
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        return response.data
} 


