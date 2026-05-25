import axios from "axios";

// Vite proxy forwards /api → http://localhost:5000 in dev.
const api = axios.create({ baseURL: "/api" });

// Attach JWT to every request when present in localStorage.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// On 401, clear the token so ProtectedRoute redirects to login.
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    return Promise.reject(err);
  }
);

export default api;
