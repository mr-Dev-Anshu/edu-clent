import axios, { AxiosError } from "axios";
import { ApiError } from "@/types/api.types";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;


// Axios instance
const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// REQUEST INTERCEPTOR
api.interceptors.request.use(
  (config) => {
    // future: attach token here
    // config.headers.Authorization = `Bearer token`;
    return config;
  },
  (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (response) => {
    return response;
  },
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