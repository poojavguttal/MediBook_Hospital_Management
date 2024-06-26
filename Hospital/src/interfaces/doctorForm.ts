interface DoctorForm {
    id:string;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    password_confirmation: string;
    contact_number: string;
    qualifications: string[];
}

export default DoctorForm;