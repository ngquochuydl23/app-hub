import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ── Request Interceptor ──
api.interceptors.request.use(
  (config) => {
    // Attach auth token if available
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ── Response Interceptor ──
api.interceptors.response.use(
  (response) => {
    // Unwrap the `data` field from the API envelope { success, data, ... }
    return response;
  },
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      // Handle unauthorized – redirect to login, clear token, etc.
      localStorage.removeItem("token");
      console.error("[API] Unauthorized – token cleared");
    }

    if (status === 403) {
      console.error("[API] Forbidden – insufficient permissions");
    }

    if (status === 500) {
      console.error("[API] Internal server error");
    }

    return Promise.reject(error);
  }
);

export default api;
