import axios from "axios";

const baseURL =
  process.env.NODE_ENV === "production"
    ? "https://ton-backend-vercel.vercel.app/api"
    : "http://localhost:4000/api";

const api = axios.create({
  baseURL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;