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
    // Backend se aane wala structured error message
    const backendMessage = error.response?.data?.message; 
    const fallbackMessage = error.message || "Something went wrong";
    
    // Custom error object taaki component mein 'error.message' direct mil sake
    const finalError = {
      ...error,
      message: backendMessage || fallbackMessage,
      stack: error.response?.data?.stack // Debugging ke liye stack bhi rakh sakte hain
    };

<<<<<<< HEAD
    console.error("API Error:", message);
    return Promise.reject(error);
=======
    return Promise.reject(finalError);
>>>>>>> 9be43ca85a0b2ce1d0b4219a8009b8f081fa6b34
  }
);

export default api ; 