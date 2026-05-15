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
  api.post("/manager/profile/change-password", data);

// GET PROFILE
export const getProfile = () => {
  return api.get("/manager/profile");
};

// UPDATE PROFILE IMAGE (multipart/form-data)
export const updateProfileImage = (formData) => {
  return api.post("/manager/profile/update-image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export default API;