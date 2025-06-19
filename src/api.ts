import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:5000/api/",
  timeout: 1000,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function registerNewUser({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}) {
  await api.post("auth/register", { name, email, password });
}

export async function loginUser({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const { data } = await api.post("auth/login", { email, password });
  return data;
}
