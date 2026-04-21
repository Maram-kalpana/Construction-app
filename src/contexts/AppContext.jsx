import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = '@constructionERP/appState_v2';
const LEGACY_STORAGE_KEY = '@constructionERP/appState';

const seedProjects = [
  { id: 'p-001', name: 'Green Valley Apartments', location: 'Sector 14', status: 'Active' },
  { id: 'p-002', name: 'City Flyover Expansion', location: 'NH-48', status: 'Active' },
  { id: 'p-003', name: 'Riverside Warehouse', location: 'Industrial Area', status: 'Paused' },
];

const seedVendors = [
  { id: 'ven_demo_1', name: 'Ravi Hire', phone: '9876500001', category: 'Machinery' },
  { id: 'ven_demo_2', name: 'ACC Dealer', phone: '9876500002', category: 'Cement' },
  { id: 'ven_demo_3', name: 'Sri Ganesh', phone: '9876500003', category: 'Material' },
];

const seedLabour = [
  { id: 'lab_demo_1', name: 'Raju Kumar', age: '32', gender: 'male', phone: '9000011111', vendorId: 'ven_demo_1', joinedDate: dateKey(), photoUri: null },
  { id: 'lab_demo_2', name: 'Lakshmi Devi', age: '28', gender: 'female', phone: '9000022222', vendorId: 'ven_demo_3', joinedDate: dateKey(), photoUri: null },
  { id: 'lab_demo_3', name: 'Siva Ram', age: '36', gender: 'male', phone: '9000033333', vendorId: 'ven_demo_1', joinedDate: dateKey(), photoUri: null },
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
  const todayKey = dateKey();
  const demoDailyByKey = useMemo(() => ({
    [bundleKey('p-001', todayKey)]: {
      labourEntries: [
        { id: 'lent_demo_1', labourId: 'lab_demo_1', masteryName: 'Raju Masonry Works', mason: '4', maleSkilled: '6', femaleUnskilled: '2', others: '1', workDone: "Brick work - 80 x 9' walls" },
        { id: 'lent_demo_2', labourId: 'lab_demo_2', masteryName: 'Sri Balaji Contractors', mason: '2', maleSkilled: '3', femaleUnskilled: '4', others: '0', workDone: 'PCC flooring - 1200 sq.ft' },
      ],
      machines: [
        { id: 'mac_demo_1', partyName: 'JCB Excavator', machineName: 'JCB Excavator', vendorId: 'ven_demo_1', startTime: '8:00 AM', endTime: '5:00 PM', totalHrs: '9.0', workDone: 'Excavation for foundation' },
        { id: 'mac_demo_2', partyName: 'Concrete Mixer', machineName: 'Concrete Mixer', vendorId: 'ven_demo_3', startTime: '9:30 AM', endTime: '4:30 PM', totalHrs: '7.0', workDone: 'PCC mixing ground slab' },
      ],
      materialsIn: [
        { id: 'mat_demo_1', direction: 'in', itemName: 'Cement (OPC 53)', qty: '120 bags', supplier: 'ACC Dealer', vendorId: 'ven_demo_2' },
        { id: 'mat_demo_2', direction: 'in', itemName: 'River Sand', qty: '4 loads', supplier: 'Ravi Sand Works', vendorId: 'ven_demo_3' },
      ],
      materialsOut: [
        { id: 'mat_demo_3', direction: 'out', itemName: 'Cement (consumed)', qty: '40 bags', supplier: '', vendorId: 'ven_demo_2' },
      ],
      cementConsumption: [
        { id: 'cem_demo_1', work: 'PCC work - ground floor slab', qty: '35' },
        { id: 'cem_demo_2', work: 'Brick work - 2nd floor walls', qty: '30' },
      ],
      cementStock: { openBal: '45', received: '120', cum: '165', bal: '80' },
      dailyHeader: { firm: '', site: '', workDone: '', referenceNo: '' },
      remarks: 'Demo daily remarks',
    },
  }), [todayKey]);
  const [projects] = useState(seedProjects);
  const [ledgers, setLedgers] = useState({});
  const [labourRegistry, setLabourRegistry] = useState(seedLabour);
  const [vendors, setVendors] = useState(seedVendors);
  const [dailyByKey, setDailyByKey] = useState(demoDailyByKey);
  const [attendance, setAttendance] = useState({
    [`p-001_${todayKey}_lab_demo_1`]: true,
    [`p-001_${todayKey}_lab_demo_2`]: true,
  });

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
        const parsedVendors = Array.isArray(parsed?.vendors) ? parsed.vendors : [];
        const mergedVendors = [...seedVendors, ...parsedVendors.filter((v) => !seedVendors.some((s) => s.id === v.id))];
        setVendors(mergedVendors);

        const parsedLabour = Array.isArray(parsed?.labourRegistry) ? parsed.labourRegistry : [];
        const mergedLabour = [...seedLabour, ...parsedLabour.filter((l) => !seedLabour.some((s) => s.id === l.id))];
        setLabourRegistry(mergedLabour);

        const mergedDaily = { ...demoDailyByKey, ...(parsed?.dailyByKey ?? {}) };
        setDailyByKey(mergedDaily);

        const mergedAttendance = {
          [`p-001_${todayKey}_lab_demo_1`]: true,
          [`p-001_${todayKey}_lab_demo_2`]: true,
          ...(parsed?.attendance ?? {}),
        };
        setAttendance(mergedAttendance);
        if (!raw && legacyRaw) {
          await AsyncStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({
              ledgers: parsed.ledgers ?? {},
              labourRegistry: parsed.labourRegistry ?? [],
              vendors: parsed.vendors ?? [],
              dailyByKey: parsed.dailyByKey ?? {},
              attendance: parsed.attendance ?? {},
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
        attendance: next.attendance ?? attendance,
      }),
    );
  }, [ledgers, labourRegistry, vendors, dailyByKey, attendance]);

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
        vendorId: person.vendorId ?? null,
        joinedDate: person.joinedDate ?? dateKey(),
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
        machineName: entry.machineName?.trim() ?? entry.partyName?.trim() ?? '',
        vendorId: entry.vendorId ?? null,
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
        vendorId: entry.vendorId ?? null,
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

  const attendanceKey = useCallback((projectId, day, labourId) => `${projectId}_${day}_${labourId}`, []);

  const attendanceFor = useCallback(
    (projectId, day, labourId) => {
      const key = attendanceKey(projectId, day, labourId);
      return attendance[key] ?? false;
    },
    [attendance, attendanceKey],
  );

  const toggleAttendance = useCallback(
    async (projectId, day, labourId) => {
      const key = attendanceKey(projectId, day, labourId);
      const next = { ...attendance, [key]: !(attendance[key] ?? false) };
      setAttendance(next);
      await persist({ attendance: next });
      return next[key];
    },
    [attendance, attendanceKey, persist],
  );

  const attendanceLabourIds = useCallback(
    (projectId, day) =>
      labourRegistry
        .filter((p) => attendanceFor(projectId, day, p.id))
        .map((p) => p.id),
    [attendanceFor, labourRegistry],
  );

  const dailyReports = useMemo(
    () =>
      Object.entries(dailyByKey)
        .map(([key, raw]) => {
          const splitAt = key.indexOf('_');
          if (splitAt < 0) return null;
          const projectId = key.slice(0, splitAt);
          const day = key.slice(splitAt + 1);
          const bundle = mergeDailyBundle(raw);
          const hasData =
            bundle.labourEntries.length ||
            bundle.machines.length ||
            bundle.materialsIn.length ||
            bundle.materialsOut.length ||
            bundle.cementConsumption.length ||
            Object.values(bundle.cementStock).some((v) => String(v || '').trim().length > 0) ||
            String(bundle.remarks || '').trim().length > 0;
          if (!hasData && attendanceLabourIds(projectId, day).length === 0) return null;
          return {
            key,
            projectId,
            day,
            labourEntries: bundle.labourEntries.length,
            machineEntries: bundle.machines.length,
            materialEntries: bundle.materialsIn.length + bundle.materialsOut.length,
            stockEntries: bundle.cementConsumption.length,
            attendanceCount: attendanceLabourIds(projectId, day).length,
            remarks: bundle.remarks,
          };
        })
        .filter(Boolean)
        .sort((a, b) => b.day.localeCompare(a.day)),
    [attendanceLabourIds, dailyByKey],
  );

  const dailyBundlesForProject = useCallback(
    (projectId) =>
      Object.entries(dailyByKey)
        .filter(([key]) => key.startsWith(`${projectId}_`))
        .map(([, raw]) => mergeDailyBundle(raw)),
    [dailyByKey],
  );

  const materialItemOptions = useCallback(
    (projectId) => {
      const options = new Set();
      dailyBundlesForProject(projectId).forEach((b) => {
        [...b.materialsIn, ...b.materialsOut].forEach((item) => {
          if (item.itemName?.trim()) options.add(item.itemName.trim());
        });
      });
      return Array.from(options);
    },
    [dailyBundlesForProject],
  );

  const machineNameOptions = useCallback(
    (projectId) => {
      const options = new Set();
      dailyBundlesForProject(projectId).forEach((b) => {
        b.machines.forEach((item) => {
          if (item.partyName?.trim()) options.add(item.partyName.trim());
        });
      });
      return Array.from(options);
    },
    [dailyBundlesForProject],
  );

  const stockWorkOptions = useCallback(
    (projectId) => {
      const options = new Set();
      dailyBundlesForProject(projectId).forEach((b) => {
        b.cementConsumption.forEach((item) => {
          if (item.work?.trim()) options.add(item.work.trim());
        });
      });
      return Array.from(options);
    },
    [dailyBundlesForProject],
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
      attendanceFor,
      toggleAttendance,
      attendanceLabourIds,
      dailyReports,
      materialItemOptions,
      machineNameOptions,
      stockWorkOptions,
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
      attendanceFor,
      toggleAttendance,
      attendanceLabourIds,
      dailyReports,
      materialItemOptions,
      machineNameOptions,
      stockWorkOptions,
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
