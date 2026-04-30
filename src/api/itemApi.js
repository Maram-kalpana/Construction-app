import api from "./axios";

export const getItems = () => {
  return api.get("/manager/get-material");
};