import api from "./axios";
// GET MATERIAL REPORT
export const getMaterialReport = (data) => {
  return api.post("/manager/stock/material-report", data);
};

export const addMaterialConsumption = (data) => {
  return api.post("/manager/stock/material-consumptions/add", data);
};

export const getMaterialConsumptions = (params) => {
  return api.get("/manager/stock/material-consumptions", {
    params,
  });
};