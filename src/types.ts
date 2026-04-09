export type Role = 'manager' | 'admin';

export type User = {
  id: string;
  name: string;
  role: Role;
  emailOrPhone: string;
};

export type ProjectStatus = 'Active' | 'Paused' | 'Completed';

export type Project = {
  id: string;
  name: string;
  location: string;
  status: ProjectStatus;
};

export type ExpenseType = 'Labour' | 'Material' | 'Machinery';

export type Expense = {
  id: string;
  projectId: string;
  managerId: string;
  dateIso: string;
  name: string;
  type: ExpenseType;
  amount: number;
  description?: string;
};

export type AccountsLedger = {
  projectId: string;
  totalAmount: number;
  expenses: Expense[];
};

