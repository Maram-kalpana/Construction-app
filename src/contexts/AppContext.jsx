import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { getVendorsByType } from "../api/vendorApi";
import { sameScopedProject } from "../utils/labourProjectScope";

const STORAGE_KEY = '@constructionERP/appState_v2';

/* -------------------- HELPERS -------------------- */

function makeId(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function dateKey(d = new Date()) {
  return d.toISOString().slice(0, 10);
}

function bundleKey(projectId, day) {
  return `${projectId}_${day}`;
}

/* -------------------- CONTEXT -------------------- */

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [projects] = useState([
    { id: 'p-001', name: 'Green Valley Apartments', location: 'Sector 14', status: 'Active' },
  ]);

  const [vendors, setVendors] = useState([]);
  const [materials, setMaterials] = useState({});
  const [ledgerData, setLedgerData] = useState({});
  const [stockData, setStockData] = useState([]); // ✅ NEW

  /** Local labour work log lines keyed by date + vendor (shown on daily labour report cards). */
  const [labourWorkEntries, setLabourWorkEntries] = useState([]);

  const addLabourWorkEntry = useCallback((entry) => {
    const projectIdNorm =
      entry.projectId != null && entry.projectId !== ''
        ? String(entry.projectId)
        : undefined;
    setLabourWorkEntries((prev) => [
      ...prev,
      {
        id: makeId('lwork'),
        createdAt: Date.now(),
        ...entry,
        projectId: projectIdNorm,
      },
    ]);
  }, []);

  const updateLabourWorkEntry = useCallback((id, patch) => {
    if (!id) return;
    const next = { ...patch };
    if (next.projectId != null && next.projectId !== '') {
      next.projectId = String(next.projectId);
    }
    setLabourWorkEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...next } : e))
    );
  }, []);

  const removeLabourWorkEntriesForVendorDate = useCallback((date, vendorId, projectId) => {
    setLabourWorkEntries((prev) =>
      prev.filter(
        (e) =>
          !(
            e.date === date &&
            String(e.vendorId) === String(vendorId) &&
            sameScopedProject(e.projectId, projectId)
          )
      )
    );
  }, []);

  /* -------------------- FETCH VENDORS -------------------- */

  const fetchVendors = async () => {
    try {
      const res = await getVendorsByType();
      const raw = res?.data?.data ?? res?.data ?? [];
      const data = Array.isArray(raw) ? raw : [];

      setVendors(
        data.map((v) => ({
          id: v.id,
          name: v.name || 'Vendor',
          vendorType: String(v.vendor_type || v.type || v.category || '').trim(),
        }))
      );
    } catch (err) {
      console.log("Vendor error:", err);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  /* -------------------- MATERIALS -------------------- */

  const getDailyBundle = useCallback((projectId, day) => {
    return materials[bundleKey(projectId, day)] || {
      materialsIn: [],
      materialsOut: [],
    };
  }, [materials]);

  const addMaterialEntry = useCallback((projectId, payload, day) => {
    const key = bundleKey(projectId, day);

    const existing = materials[key] || {
      materialsIn: [],
      materialsOut: [],
    };

    const listKey = payload.direction === 'out' ? 'materialsOut' : 'materialsIn';

    const updatedList = payload.id
      ? existing[listKey].map((e) =>
          e.id === payload.id ? { ...e, ...payload } : e
        )
      : [...existing[listKey], { ...payload, id: makeId('mat') }];

    const next = {
      ...materials,
      [key]: {
        ...existing,
        [listKey]: updatedList,
      },
    };

    setMaterials(next);
  }, [materials]);

  const deleteMaterialEntry = useCallback((projectId, id, direction, day) => {
    const key = bundleKey(projectId, day);
    const existing = materials[key];

    if (!existing) return;

    const listKey = direction === 'out' ? 'materialsOut' : 'materialsIn';

    const next = {
      ...materials,
      [key]: {
        ...existing,
        [listKey]: existing[listKey].filter((e) => e.id !== id),
      },
    };

    setMaterials(next);
  }, [materials]);

  const materialItemOptions = useCallback(() => {
    const all = Object.values(materials)
      .flatMap((b) => [...(b.materialsIn || []), ...(b.materialsOut || [])])
      .map((e) => e.itemName);

    return [...new Set(all)];
  }, [materials]);

  /* -------------------- STOCK -------------------- */

const addStockEntry = useCallback((payload) => {
  setStockData((prev) => {
    // ✅ EDIT
    if (payload.id) {
      return prev.map((item) =>
        item.id === payload.id ? { ...item, ...payload } : item
      );
    }

    // ✅ NEW
    return [
      ...prev,
      {
        id: makeId('stock'),
        ...payload,
      },
    ];
  });
}, []);

const deleteStockEntry = useCallback((id) => {
  setStockData((prev) => prev.filter((item) => item.id !== id));
}, []);

const getStockByProject = useCallback((projectId) => {
  if (projectId == null) return [];
  return stockData.filter((s) => String(s.projectId) === String(projectId));
}, [stockData]);
/* -------------------- LEDGER -------------------- */

const getLedger = useCallback((projectId) => {
  return ledgerData[projectId] || {
    totalAmount: 0,
    expenses: [],
  };
}, [ledgerData]);

const addExpense = useCallback((projectId, expense) => {
  const newExpense = {
    id: makeId('exp'),
    ...expense,
  };

  const next = {
    ...ledgerData,
    [projectId]: {
      totalAmount: ledgerData[projectId]?.totalAmount || 0,
      expenses: [
        ...(ledgerData[projectId]?.expenses || []),
        newExpense,
      ],
    },
  };

  setLedgerData(next);

  return newExpense; // ✅ VERY IMPORTANT
}, [ledgerData]);

  const setTotalAmount = useCallback((projectId, totalAmount) => {
    const n = Number(totalAmount);
    const amt = Number.isFinite(n) && n >= 0 ? n : 0;
    setLedgerData((prev) => ({
      ...prev,
      [projectId]: {
        totalAmount: amt,
        expenses: prev[projectId]?.expenses || [],
      },
    }));
  }, []);

  /* -------------------- CONTEXT VALUE -------------------- */

  const value = useMemo(() => ({
  projects,
  vendors,

  // MATERIALS
  getDailyBundle,
  addMaterialEntry,
  deleteMaterialEntry,
  materialItemOptions,

  // STOCK
  addStockEntry,
  deleteStockEntry,   // ✅ ADD THIS (missing)
  getStockByProject,

  // LEDGER
  getLedger,
  addExpense,
  setTotalAmount,

  labourWorkEntries,
  addLabourWorkEntry,
  updateLabourWorkEntry,
  removeLabourWorkEntriesForVendorDate,

  dateKey,
}), [
  projects,
  vendors,
  materials,
  ledgerData,
  stockData,
  labourWorkEntries,
  addLabourWorkEntry,
  updateLabourWorkEntry,
  removeLabourWorkEntriesForVendorDate,
  addStockEntry,
  deleteStockEntry,
  getStockByProject,
  setTotalAmount,
]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

/* -------------------- HOOK -------------------- */

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}