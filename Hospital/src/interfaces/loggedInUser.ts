interface LoggedInUser {
    user: {
      id: string;
      first_name: string;
      last_name: string;
      email: string;
      contact_number: string;
      role: string;
      authentication: {
        expires_at: string;
        token: string;
        refresh_token: string;
      };
    };
}

export default LoggedInUser;


