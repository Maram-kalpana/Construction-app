import api from "./axios";

export const getVendorsByType = () => {
  return api.get("/manager/vendors-by-type");
};