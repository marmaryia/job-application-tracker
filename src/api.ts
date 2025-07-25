import axios from "axios";
import type { TApplication, TNewApplication } from "./types/applicationTypes";

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

export async function getApplicationsByUserId(
  accessToken: string,
  userId: number,
  sortBy: string | null,
  order: string | null,
  status: string | null
) {
  let url = `users/${userId}/applications?sort_by=${
    sortBy ? sortBy : "date_created"
  }&order=${order ? order : "desc"}`;

  if (status) {
    url += `&status=${status}`;
  }
  const {
    data: { applications },
  } = await api.get(url, {
    headers: {
      ...api.defaults.headers.common,
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return applications;
}

export async function patchApplicationStatus(
  accessToken: string,
  applicationId: number,
  newStatus: string
) {
  const {
    data: { application },
  } = await api.patch(
    `applications/${applicationId}`,
    { new_status: newStatus },
    {
      headers: {
        ...api.defaults.headers.common,
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return application;
}

export async function postNewApplication(
  accessToken: string,
  applicationData: TNewApplication
) {
  const {
    data: { application },
  } = await api.post("applications", applicationData, {
    headers: {
      ...api.defaults.headers.common,
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return application;
}

export async function deleteApplicationById(
  accessToken: string,
  applicationId: number
) {
  await api.delete(`applications/${applicationId}`, {
    headers: {
      ...api.defaults.headers.common,
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export async function getApplicationById(
  accessToken: string,
  applicationId: number
) {
  const {
    data: { application },
  } = await api.get(`applications/${applicationId}`, {
    headers: {
      ...api.defaults.headers.common,
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return application;
}

export async function editApplicationById(
  accessToken: string,
  applicationData: Omit<TApplication, "latest_event">
) {
  const { application_id, ...newData } = applicationData;

  const {
    data: { application },
  } = await api.put(`applications/${application_id}`, newData, {
    headers: {
      ...api.defaults.headers.common,
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return application;
}
