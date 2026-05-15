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

// ─── STOCK REPORT ────────────────────────────────────────────────

// STOCK REPORT LIST (optional ?date= query)
export const getStockReportList = (params) => {
  return api.get("/manager/stock-report/list", { params: params || undefined });
};

// STOCK REPORT DETAILS
export const getStockReportDetails = (id) => {
  return api.get(`/manager/stock-report/details/${id}`);
};

// UPDATE STOCK REPORT
export const updateStockReport = (id, data) => {
  return api.put(`/manager/stock-report/update/${id}`, data);
};

// DELETE STOCK REPORT
export const deleteStockReport = (id) => {
  return api.delete(`/manager/stock-report/delete/${id}`);
};

// ADD STOCK REPORT
export const addStockReport = (data) => {
  return api.post("/manager/stock-report/add", data);
};