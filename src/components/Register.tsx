import { useState, useContext } from "react";
import { useNavigate, Navigate } from "react-router-dom";

import { registerNewUser } from "../api";
import { processServerError } from "../utils/errors";
import { validatePassword } from "../utils/validators";
import type { TNewUserDetails } from "../types/userTypes";
import { UserContext } from "../contexts/userContext";
import { handleDataEntry } from "../utils/dataEntry";

function Register() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<TNewUserDetails>({
    name: "",
    email: "",
    password: "",
  });
  const [missingData, setMissingData] = useState<boolean>(false);
  const [serverError, setServerError] = useState<any>(null);
  const [invalidPassword, setInvalidPassword] = useState<boolean>(false);
  const { loggedInUser } = useContext(UserContext);

  if (loggedInUser) {
    return <Navigate to="/applications" />;
  }

  function handleDataInput(value: string, key: "name" | "email" | "password") {
    setMissingData(false);
    handleDataEntry(key, value, setUserData);
  }

  async function registerUser(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (
      userData.name &&
      userData.email &&
      validatePassword(userData.password)
    ) {
      try {
        await registerNewUser(userData);
        navigate("/login");
      } catch (error: any) {
        setServerError(processServerError(error));
        if (serverError?.unknownError) {
          setUserData({ name: "", email: "", password: "" });
        }
      }
    } else if (!userData.email || !userData.name || !userData.password) {
      setMissingData(true);
    } else {
      setInvalidPassword(true);
    }
  }

  return (
    <section>
      <form action="submit" onSubmit={registerUser}>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          value={userData.name}
          onChange={(event) => {
            handleDataInput(event.target.value, "name");
          }}
        />
        <br />
        <label htmlFor="email">Email address</label>
        <input
          type="text"
          id="email"
          value={userData.email}
          onChange={(event) => {
            handleDataInput(event.target.value, "email");
          }}
        />
        {serverError?.duplicateUser && <p>{serverError.message}</p>}
        <br />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={userData.password}
          onChange={(event) => {
            setInvalidPassword(false);
            handleDataInput(event.target.value, "password");
          }}
        />
        {invalidPassword && (
          <p>The password must contain at least 8 characters and no spaces</p>
        )}
        <br />
        {missingData && <p>Please fill in all the fields</p>}
        {serverError?.unknownError && (
          <p>Something has gone wrong, please try again</p>
        )}
        <button type="submit">Sign up</button>
      </form>
    </section>
  );
}

export default Register;
