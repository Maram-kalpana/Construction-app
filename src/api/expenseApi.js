import api from "./axios";

export const addExpenseApi = (data) => {
  return api.post("/manager/expenses/add", data);
};

/** Map manager expense list/detail row → shape used by ExpenseList / ExpenseDetails. */
export function normalizeManagerExpenseRow(raw) {
  if (!raw || typeof raw !== "object") return null;
  const name =
    raw.vendor?.name ??
    raw.vendor_name ??
    raw.party_name ??
    raw.payee_name ??
    raw.name ??
    "—";
  const type =
    raw.expense_type ??
    raw.expense_category ??
    raw.category ??
    raw.type ??
    "—";
  const dateRaw = raw.expense_date ?? raw.date ?? raw.entry_date ?? raw.created_at;
  let dateIso = new Date().toISOString();
  if (dateRaw != null && dateRaw !== "") {
    const s = String(dateRaw).trim();
    if (/^\d{4}-\d{2}-\d{2}/.test(s)) {
      dateIso = `${s.slice(0, 10)}T12:00:00.000Z`;
    } else {
      const d = new Date(s);
      if (!Number.isNaN(d.getTime())) dateIso = d.toISOString();
    }
  }
  const id = raw.id ?? raw.expense_id;
  return {
    id: id ?? `row_${String(name)}_${dateIso}`,
    name: String(name),
    type: String(type),
    amount: Number(raw.amount ?? 0),
    dateIso,
    partyId: raw.vendor_id ?? raw.vendor?.id ?? null,
  };
}

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