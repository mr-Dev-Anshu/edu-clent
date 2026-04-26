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
  (response) => response,
  (error: AxiosError<ApiError>) => {
    // Backend se aane wala structured error message
    const backendMessage = error.response?.data?.message; 
    const fallbackMessage = error.message || "Something went wrong";
    
    // Custom error object taaki component mein 'error.message' direct mil sake
    const finalError = {
      ...error,
      message: backendMessage || fallbackMessage,
      stack: error.response?.data?.stack // Debugging ke liye stack bhi rakh sakte hain
    };

    return Promise.reject(finalError);
  }
);

export default api ; 