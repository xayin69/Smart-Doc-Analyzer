import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000", // your FastAPI server
  withCredentials: true,            // REQUIRED for cookies
});

export default api;
