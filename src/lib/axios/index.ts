import axios, { AxiosError } from "axios";
import { ApiError } from "@/types/api.types";
import { store } from "@/store";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Axios instance
const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// REQUEST INTERCEPTOR — token + x-tenant-id har request mein jaayega
api.interceptors.request.use(
  (config) => {
    const state    = store.getState() as { auth: { token: string | null; tenant: { id: string } | null } };
    const token    = state.auth?.token;
    const tenantId = state.auth?.tenant?.id;

    if (token)    config.headers.Authorization  = `Bearer ${token}`;
    if (tenantId) config.headers["x-tenant-id"] = tenantId;

    return config;
  },
  (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Something went wrong";

    console.error("API Error:", message);
    return Promise.reject(error);
  }
);

export default api;