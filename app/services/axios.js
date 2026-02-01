"use client";

import { clearAuthInfo, getHeaderConfig } from "./utils";
import axios from "axios";

// Create a single axios instance
export const api = axios.create({
  baseURL: process.env.AUTH_BASE_URL,
  headers: getHeaderConfig().headers,
});

// Add interceptor ONCE
api.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    const message = error.response?.data?.message;
    const code = error.response?.data?.code;
    const nestedError = error.response?.data?.error?.message;

    if (
      code === 401 ||
      nestedError === "session expired" ||
      message === "Login session expired"
    ) {
      // window.location.assign("/auth/login");
      // clearAuthInfo();
    }

    return Promise.reject(error); // Always reject for consistent error handling
  },
);

// Function to update the language header dynamically
export function updateAxiosHeader(lang) {
  const newHeaders = getHeaderConfig(lang).headers;

  Object.keys(newHeaders).forEach((key) => {
    api.defaults.headers[key] = newHeaders[key];
  });
}
