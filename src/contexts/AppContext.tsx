import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import type { AccountsLedger, Expense, ExpenseType, Project } from '../types';

type AppState = {
  projects: Project[];
  ledgers: Record<string, AccountsLedger>;
  getLedger: (projectId: string) => AccountsLedger;
  setTotalAmount: (projectId: string, totalAmount: number) => Promise<void>;
  addExpense: (input: {
    projectId: string;
    managerId: string;
    name: string;
    type: ExpenseType;
    amount: number;
    description?: string;
    dateIso?: string;
  }) => Promise<Expense>;
};

const STORAGE_KEY = '@constructionERP/appState';

const seedProjects: Project[] = [
  { id: 'p-001', name: 'Green Valley Apartments', location: 'Sector 14', status: 'Active' },
  { id: 'p-002', name: 'City Flyover Expansion', location: 'NH-48', status: 'Active' },
  { id: 'p-003', name: 'Riverside Warehouse', location: 'Industrial Area', status: 'Paused' },
];

function createDefaultLedger(projectId: string): AccountsLedger {
  return { projectId, totalAmount: 100000, expenses: [] };
}

function makeId() {
  return `exp_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [projects] = useState<Project[]>(seedProjects);
  const [ledgers, setLedgers] = useState<Record<string, AccountsLedger>>({});

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (cancelled) return;
      if (!raw) return;
      try {
        const parsed = JSON.parse(raw) as { ledgers?: Record<string, AccountsLedger> };
        if (parsed?.ledgers) setLedgers(parsed.ledgers);
      } catch {
        // ignore corrupted state
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const persist = useCallback(async (nextLedgers: Record<string, AccountsLedger>) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ ledgers: nextLedgers }));
  }, []);

  const getLedger = useCallback(
    (projectId: string) => {
      return ledgers[projectId] ?? createDefaultLedger(projectId);
    },
    [ledgers],
  );

  const setTotalAmount = useCallback(
    async (projectId: string, totalAmount: number) => {
      const nextLedgers = {
        ...ledgers,
        [projectId]: { ...getLedger(projectId), totalAmount },
      };
      setLedgers(nextLedgers);
      await persist(nextLedgers);
    },
    [getLedger, ledgers, persist],
  );

  const addExpense = useCallback(
    async (input: {
      projectId: string;
      managerId: string;
      name: string;
      type: ExpenseType;
      amount: number;
      description?: string;
      dateIso?: string;
    }) => {
      const expense: Expense = {
        id: makeId(),
        projectId: input.projectId,
        managerId: input.managerId,
        dateIso: input.dateIso ?? new Date().toISOString(),
        name: input.name.trim(),
        type: input.type,
        amount: input.amount,
        description: input.description?.trim() || undefined,
      };

      const existing = getLedger(input.projectId);
      const nextLedger: AccountsLedger = {
        ...existing,
        expenses: [expense, ...existing.expenses],
      };
      const nextLedgers = { ...ledgers, [input.projectId]: nextLedger };
      setLedgers(nextLedgers);
      await persist(nextLedgers);
      return expense;
    },
    [getLedger, ledgers, persist],
  );

  const value = useMemo<AppState>(
    () => ({
      projects,
      ledgers,
      getLedger,
      setTotalAmount,
      addExpense,
    }),
    [projects, ledgers, getLedger, setTotalAmount, addExpense],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

