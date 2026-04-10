import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = '@constructionERP/appState_v2';
const LEGACY_STORAGE_KEY = '@constructionERP/appState';

const seedProjects = [
  { id: 'p-001', name: 'Green Valley Apartments', location: 'Sector 14', status: 'Active' },
  { id: 'p-002', name: 'City Flyover Expansion', location: 'NH-48', status: 'Active' },
  { id: 'p-003', name: 'Riverside Warehouse', location: 'Industrial Area', status: 'Paused' },
];

function makeId(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function normalizePhone(phone) {
  return String(phone || '').replace(/\D/g, '');
}

function dateKey(d = new Date()) {
  return d.toISOString().slice(0, 10);
}

function bundleKey(projectId, day = dateKey()) {
  return `${projectId}_${day}`;
}

function emptyDailyBundle() {
  return {
    labourEntries: [],
    machines: [],
    materialsIn: [],
    materialsOut: [],
    cementConsumption: [],
    cementStock: { openBal: '', received: '', cum: '', bal: '' },
    dailyHeader: { firm: '', site: '', workDone: '', referenceNo: '' },
    remarks: '',
  };
}

function mergeDailyBundle(raw) {
  const e = emptyDailyBundle();
  if (!raw) return e;
  return {
    ...e,
    ...raw,
    dailyHeader: { ...e.dailyHeader, ...(raw.dailyHeader || {}) },
    cementStock: { ...e.cementStock, ...(raw.cementStock || {}) },
  };
}

function createDefaultLedger(projectId) {
  return { projectId, totalAmount: 100000, expenses: [] };
}

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [projects] = useState(seedProjects);
  const [ledgers, setLedgers] = useState({});
  const [labourRegistry, setLabourRegistry] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [dailyByKey, setDailyByKey] = useState({});

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      const legacyRaw = raw ? null : await AsyncStorage.getItem(LEGACY_STORAGE_KEY);
      const source = raw || legacyRaw;
      if (cancelled || !source) return;
      try {
        const parsed = JSON.parse(source);
        if (parsed?.ledgers) setLedgers(parsed.ledgers);
        if (parsed?.labourRegistry) setLabourRegistry(parsed.labourRegistry);
        if (parsed?.vendors) setVendors(parsed.vendors);
        if (parsed?.dailyByKey) setDailyByKey(parsed.dailyByKey);
        if (!raw && legacyRaw) {
          await AsyncStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({
              ledgers: parsed.ledgers ?? {},
              labourRegistry: parsed.labourRegistry ?? [],
              vendors: parsed.vendors ?? [],
              dailyByKey: parsed.dailyByKey ?? {},
            }),
          );
        }
      } catch {
        // ignore
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const persist = useCallback(async (next) => {
    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        ledgers: next.ledgers ?? ledgers,
        labourRegistry: next.labourRegistry ?? labourRegistry,
        vendors: next.vendors ?? vendors,
        dailyByKey: next.dailyByKey ?? dailyByKey,
      }),
    );
  }, [ledgers, labourRegistry, vendors, dailyByKey]);

  const getLedger = useCallback(
    (projectId) => ledgers[projectId] ?? createDefaultLedger(projectId),
    [ledgers],
  );

  const setTotalAmount = useCallback(
    async (projectId, totalAmount) => {
      const nextLedgers = {
        ...ledgers,
        [projectId]: { ...getLedger(projectId), totalAmount },
      };
      setLedgers(nextLedgers);
      await persist({ ledgers: nextLedgers });
    },
    [getLedger, ledgers, persist],
  );

  const addExpense = useCallback(
    async (input) => {
      const expense = {
        id: makeId('exp'),
        projectId: input.projectId,
        managerId: input.managerId,
        dateIso: input.dateIso ?? new Date().toISOString(),
        name: input.name.trim(),
        type: input.type,
        amount: input.amount,
        description: input.description?.trim() || undefined,
      };
      const existing = getLedger(input.projectId);
      const nextLedger = { ...existing, expenses: [expense, ...existing.expenses] };
      const nextLedgers = { ...ledgers, [input.projectId]: nextLedger };
      setLedgers(nextLedgers);
      await persist({ ledgers: nextLedgers });
      return expense;
    },
    [getLedger, ledgers, persist],
  );

  const getDailyBundle = useCallback(
    (projectId, day = dateKey()) => {
      const key = bundleKey(projectId, day);
      return mergeDailyBundle(dailyByKey[key]);
    },
    [dailyByKey],
  );

  const setDailyBundle = useCallback(
    async (projectId, bundle, day = dateKey()) => {
      const key = bundleKey(projectId, day);
      const next = { ...dailyByKey, [key]: mergeDailyBundle(bundle) };
      setDailyByKey(next);
      await persist({ dailyByKey: next });
    },
    [dailyByKey, persist],
  );

  const updateDailyPartial = useCallback(
    async (projectId, partial, day = dateKey()) => {
      const prev = getDailyBundle(projectId, day);
      await setDailyBundle(
        projectId,
        {
          ...prev,
          ...partial,
          dailyHeader: partial.dailyHeader ? { ...prev.dailyHeader, ...partial.dailyHeader } : prev.dailyHeader,
          cementStock: partial.cementStock ? { ...prev.cementStock, ...partial.cementStock } : prev.cementStock,
        },
        day,
      );
    },
    [getDailyBundle, setDailyBundle],
  );

  const findLabourByPhone = useCallback(
    (phone) => {
      const n = normalizePhone(phone);
      if (!n) return null;
      return labourRegistry.find((p) => normalizePhone(p.phone) === n) ?? null;
    },
    [labourRegistry],
  );

  const upsertLabourPerson = useCallback(
    async (person) => {
      const id = person.id ?? makeId('lab');
      const nextPerson = {
        id,
        name: person.name.trim(),
        age: String(person.age ?? ''),
        gender: person.gender,
        phone: person.phone.trim(),
        photoUri: person.photoUri || null,
      };
      const others = labourRegistry.filter((p) => p.id !== id && normalizePhone(p.phone) !== normalizePhone(nextPerson.phone));
      const next = [...others, nextPerson];
      setLabourRegistry(next);
      await persist({ labourRegistry: next });
      return nextPerson;
    },
    [labourRegistry, persist],
  );

  const addLabourEntry = useCallback(
    async (projectId, entry, day = dateKey()) => {
      const b = getDailyBundle(projectId, day);
      const row = {
        id: entry.id ?? makeId('lent'),
        labourId: entry.labourId,
        masteryName: entry.masteryName?.trim() ?? '',
        mason: entry.mason ?? '',
        maleSkilled: entry.maleSkilled ?? '',
        femaleUnskilled: entry.femaleUnskilled ?? '',
        others: entry.others ?? '',
        workDone: entry.workDone?.trim() ?? '',
      };
      const labourEntries = [...b.labourEntries.filter((e) => e.id !== row.id), row];
      await updateDailyPartial(projectId, { labourEntries }, day);
      return row;
    },
    [getDailyBundle, updateDailyPartial],
  );

  const deleteLabourEntry = useCallback(
    async (projectId, entryId, day = dateKey()) => {
      const b = getDailyBundle(projectId, day);
      await updateDailyPartial(
        projectId,
        { labourEntries: b.labourEntries.filter((e) => e.id !== entryId) },
        day,
      );
    },
    [getDailyBundle, updateDailyPartial],
  );

  const addMachineEntry = useCallback(
    async (projectId, entry, day = dateKey()) => {
      const b = getDailyBundle(projectId, day);
      const row = {
        id: entry.id ?? makeId('mac'),
        partyName: entry.partyName?.trim() ?? '',
        startTime: entry.startTime ?? '',
        endTime: entry.endTime ?? '',
        totalHrs: entry.totalHrs ?? '',
        workDone: entry.workDone?.trim() ?? '',
      };
      const machines = [...b.machines.filter((e) => e.id !== row.id), row];
      await updateDailyPartial(projectId, { machines }, day);
      return row;
    },
    [getDailyBundle, updateDailyPartial],
  );

  const deleteMachineEntry = useCallback(
    async (projectId, entryId, day = dateKey()) => {
      const b = getDailyBundle(projectId, day);
      await updateDailyPartial(projectId, { machines: b.machines.filter((e) => e.id !== entryId) }, day);
    },
    [getDailyBundle, updateDailyPartial],
  );

  const addMaterialEntry = useCallback(
    async (projectId, entry, day = dateKey()) => {
      const b = getDailyBundle(projectId, day);
      const row = {
        id: entry.id ?? makeId('mat'),
        direction: entry.direction,
        itemName: entry.itemName?.trim() ?? '',
        qty: entry.qty ?? '',
        supplier: entry.supplier?.trim() ?? '',
      };
      const listKey = entry.direction === 'out' ? 'materialsOut' : 'materialsIn';
      const list = b[listKey].filter((e) => e.id !== row.id);
      await updateDailyPartial(projectId, { [listKey]: [...list, row] }, day);
      return row;
    },
    [getDailyBundle, updateDailyPartial],
  );

  const deleteMaterialEntry = useCallback(
    async (projectId, entryId, direction, day = dateKey()) => {
      const b = getDailyBundle(projectId, day);
      const listKey = direction === 'out' ? 'materialsOut' : 'materialsIn';
      await updateDailyPartial(
        projectId,
        { [listKey]: b[listKey].filter((e) => e.id !== entryId) },
        day,
      );
    },
    [getDailyBundle, updateDailyPartial],
  );

  const addCementConsumption = useCallback(
    async (projectId, line, day = dateKey()) => {
      const b = getDailyBundle(projectId, day);
      const row = {
        id: line.id ?? makeId('cem'),
        work: line.work?.trim() ?? '',
        qty: line.qty ?? '',
      };
      const cementConsumption = [...b.cementConsumption.filter((e) => e.id !== row.id), row];
      await updateDailyPartial(projectId, { cementConsumption }, day);
      return row;
    },
    [getDailyBundle, updateDailyPartial],
  );

  const deleteCementConsumption = useCallback(
    async (projectId, lineId, day = dateKey()) => {
      const b = getDailyBundle(projectId, day);
      await updateDailyPartial(
        projectId,
        { cementConsumption: b.cementConsumption.filter((e) => e.id !== lineId) },
        day,
      );
    },
    [getDailyBundle, updateDailyPartial],
  );

  const saveVendor = useCallback(
    async (vendor) => {
      const id = vendor.id ?? makeId('ven');
      const row = {
        id,
        name: vendor.name.trim(),
        phone: vendor.phone?.trim() ?? '',
        category: vendor.category?.trim() ?? '',
      };
      const next = [...vendors.filter((v) => v.id !== id), row];
      setVendors(next);
      await persist({ vendors: next });
      return row;
    },
    [vendors, persist],
  );

  const deleteVendor = useCallback(
    async (vendorId) => {
      const next = vendors.filter((v) => v.id !== vendorId);
      setVendors(next);
      await persist({ vendors: next });
    },
    [vendors, persist],
  );

  const labourPersonById = useCallback(
    (id) => labourRegistry.find((p) => p.id === id) ?? null,
    [labourRegistry],
  );

  const value = useMemo(
    () => ({
      projects,
      ledgers,
      labourRegistry,
      vendors,
      getLedger,
      setTotalAmount,
      addExpense,
      getDailyBundle,
      setDailyBundle,
      updateDailyPartial,
      findLabourByPhone,
      upsertLabourPerson,
      addLabourEntry,
      deleteLabourEntry,
      addMachineEntry,
      deleteMachineEntry,
      addMaterialEntry,
      deleteMaterialEntry,
      addCementConsumption,
      deleteCementConsumption,
      saveVendor,
      deleteVendor,
      labourPersonById,
      dateKey,
    }),
    [
      projects,
      ledgers,
      labourRegistry,
      vendors,
      getLedger,
      setTotalAmount,
      addExpense,
      getDailyBundle,
      setDailyBundle,
      updateDailyPartial,
      findLabourByPhone,
      upsertLabourPerson,
      addLabourEntry,
      deleteLabourEntry,
      addMachineEntry,
      deleteMachineEntry,
      addMaterialEntry,
      deleteMaterialEntry,
      addCementConsumption,
      deleteCementConsumption,
      saveVendor,
      deleteVendor,
      labourPersonById,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

export { bundleKey, dateKey, normalizePhone };
