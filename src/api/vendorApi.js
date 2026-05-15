import api from "./axios";

export const getVendorsByType = () => {
  return api.get("/manager/vendors-by-type");
};

export const addVendorApi = (data) => {
  return api.post("/manager/vendors/add", data);
};

export const updateVendorApi = (id, data) => {
  return api.post(`/manager/vendors/update/${id}`, data);
};

export const deleteVendorApi = (id) => {
  return api.delete(`/manager/vendors/delete/${id}`);
};