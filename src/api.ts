import axios from "axios";
import type { AxiosRequestConfig } from "axios";

const authApi = axios.create({
  baseURL: "http://127.0.0.1:5000/api/",
  timeout: 1000,
  headers: {
    "Content-Type": "application/json",
  },
});

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
  await authApi.post("auth/register", { name, email, password });
}

export async function loginUser({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const { data } = await authApi.post("auth/login", { email, password });
  return data;
}

export async function logoutUser(accessToken: string) {
  await api.delete("auth/logout", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}
