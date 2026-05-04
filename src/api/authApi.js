import axios from "axios";
import api from "./axios";

const API = axios.create({
  baseURL: "https://construction-api.easybizcart.com/public/api",
});

export const managerLogin = (data) => {
  return API.post("/auth/manager-login", data);
};

/** Uses Bearer token from axios interceptor. Adjust path/body keys if your backend differs. */
export const changePassword = (data) =>
  api.post("/manager/change-password", data);

export default API;