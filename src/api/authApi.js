import axios from "axios";

const API = axios.create({
  baseURL: "https://construction-api.easybizcart.com/public/api",
});

export const managerLogin = (data) => {
  return API.post("/auth/manager-login", data);
};

export default API;