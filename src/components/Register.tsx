import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { registerNewUser } from "../api";
import { processServerError } from "../utils/erros";

type TUserData = { name: string; email: string; password: string };

function Register() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<TUserData>({
    name: "",
    email: "",
    password: "",
  });
  const [missingData, setMissingData] = useState<boolean>(false);
  const [serverError, setServerError] = useState<any>(null);

  function handleDataInput(value: string, key: "name" | "email" | "password") {
    setMissingData(false);
    setUserData((current) => {
      return { ...current, [key]: value };
    });
  }

  async function registerUser(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (userData.name && userData.email && userData.password) {
      try {
        await registerNewUser(userData);
        navigate("/login");
      } catch (error: any) {
        setServerError(processServerError(error));
        if (serverError?.unknownError) {
          setUserData({ name: "", email: "", password: "" });
        }
      }
    } else {
      setMissingData(true);
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
            handleDataInput(event.target.value, "password");
          }}
        />
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
