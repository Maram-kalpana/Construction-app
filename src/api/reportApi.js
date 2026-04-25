import api from "./axios";

// CREATE REPORT
export const createReport = (data) => {
  return api.post("/manager/labours/reports", data);
};

// GET REPORTS
export const getReports = () => {
  return api.get("/manager/labours/reports");
};

// UPDATE REPORT
export const updateReport = (id, data) => {
  return api.post(`/manager/labours/update-reports/${id}`, data);
};