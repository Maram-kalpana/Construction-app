import api from "./axios";

export const addExpenseApi = (data) => {
  return api.post("/manager/expenses/add", data);
};

// ─── MANAGER EXPENSES ────────────────────────────────────────────

// DASHBOARD (by project id)
export const getManagerExpenseDashboard = (projectId) => {
  return api.get(`/manager/manager-expenses/dashboard/${projectId}`);
};

// EXPENSE LIST (by project id)
export const getManagerExpenseList = (projectId) => {
  return api.get(`/manager/manager-expenses/list/${projectId}`);
};

// EXPENSE DETAILS (by expense id)
export const getManagerExpenseDetails = (expenseId) => {
  return api.get(`/manager/manager-expenses/details/${expenseId}`);
};

// ADD MANAGER EXPENSE
export const addManagerExpense = (data) => {
  return api.post("/manager/manager-expenses/add", data);
};