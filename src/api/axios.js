import axios from "axios";

const api = axios.create({
  baseURL: "https://construction-api.easybizcart.com/public/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔥 ADD THIS (IMPORTANT)
api.interceptors.request.use((config) => {
  const token = global.token; // or from AsyncStorage / context

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  console.log("REQUEST TOKEN:", token); // DEBUG

  return config;
});

export default api;