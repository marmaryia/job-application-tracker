import { useState, useContext } from "react";
import { Link, Navigate } from "react-router-dom";

import type { TUserDetails } from "../types/userTypes";
import { loginUser } from "../api";
import { UserContext } from "../contexts/userContext";
import { processLoggingInError } from "../utils/errors";
import { handleDataEntry } from "../utils/dataEntry";
import { Box, Button } from "@mui/material";

function Login() {
  const [userDetails, setUserDetails] = useState<TUserDetails>({
    email: "",
    password: "",
  });
  const { loggedInUser, setLoggedInUser } = useContext(UserContext);
  const [loggingInError, setLoggingInError] = useState<any>(null);

  if (loggedInUser) {
    return <Navigate to="/applications" />;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (userDetails.email && userDetails.password) {
      try {
        const user = await loginUser(userDetails);
        setLoggedInUser({ ...user.user, accessToken: user.access_token });
      } catch (error: any) {
        setLoggingInError(processLoggingInError(error));
      }
    }
  }

  return (
    <section>
      <form action="submit" onSubmit={handleSubmit} className="auth-form">
        <h2>Log in</h2>

        <label htmlFor="email">Email address:</label>
        <input
          type="text"
          name="email"
          id="email"
          placeholder="Email address"
          onChange={(event) => {
            handleDataEntry("email", event.target.value, setUserDetails);
          }}
        />
        <br />

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Password"
          onChange={(event) => {
            handleDataEntry("password", event.target.value, setUserDetails);
          }}
        />
        <br />
        {loggingInError?.unknownError && <p>{loggingInError.message}</p>}
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            type="submit"
            variant="contained"
            sx={{
              backgroundColor: "var(--accent-color)",
              color: "black",

              marginTop: "1em",
            }}
            size="large"
          >
            Log in
          </Button>
        </Box>

        {loggingInError?.authenticationError && (
          <p className="error-message">{loggingInError.message}</p>
        )}
        <p>
          Do not have an account? <Link to="/register">Register</Link>
        </p>
      </form>
    </section>
  );
}

export default Login;
