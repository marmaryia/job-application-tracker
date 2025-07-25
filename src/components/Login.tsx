import { useState, useContext } from "react";
import type { TUserDetails } from "../types/userTypes";
import { loginUser } from "../api";
import { UserContext } from "../contexts/userContext";
import { processLoggingInError } from "../utils/errors";
import { Navigate } from "react-router-dom";
import { handleDataEntry } from "../utils/dataEntry";

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
      {loggingInError?.authenticationError && <p>{loggingInError.message}</p>}
      <form action="submit" onSubmit={handleSubmit}>
        <label htmlFor="email">Email address</label>
        <input
          type="text"
          name="email"
          id="email"
          onChange={(event) => {
            handleDataEntry("email", event.target.value, setUserDetails);
          }}
        />
        <br />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          onChange={(event) => {
            handleDataEntry("password", event.target.value, setUserDetails);
          }}
        />
        <br />
        {loggingInError?.unknownError && <p>{loggingInError.message}</p>}
        <button>Log in</button>
      </form>
    </section>
  );
}

export default Login;
