import api from "./axios";

export const addExpenseApi = (data) => {
  return api.post("/manager/expenses/add", data);
};