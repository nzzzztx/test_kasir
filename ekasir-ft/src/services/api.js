import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.2.20:5000/api",
  withCredentials: true,
});
// Auto inject token
api.interceptors.request.use((config) => {
  const auth = JSON.parse(localStorage.getItem("auth"));

  if (auth?.token) {
    config.headers.Authorization = `Bearer ${auth.token}`;
  }

  return config;
});

export default api;
