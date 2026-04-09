import type { Expense } from '../types';

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
};

export type AppTabsParamList = {
  Dashboard: undefined;
  Projects: undefined;
};

export type ProjectsStackParamList = {
  ProjectsHome: undefined;
  ProjectDetails: { projectId: string };
  Accounts: { projectId: string };
  AddExpense: { projectId: string };
  ExpenseList: { projectId: string };
  ExpenseDetails: { projectId: string; expense: Expense };
};

