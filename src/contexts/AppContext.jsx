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

  /* -------------------- FETCH VENDORS -------------------- */

  const fetchVendors = async () => {
    try {
      const res = await getVendorsByType();
      const data = res?.data?.data || [];

      setVendors(
        data.map((v) => ({
          id: v.id,
          name: v.name || 'Vendor',
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
  return stockData.filter((s) => s.projectId === projectId);
}, [stockData]);
/* -------------------- LEDGER -------------------- */

const getLedger = useCallback((projectId) => {
  return ledgerData[projectId] || {
    totalAmount: 0,
    expenses: [],
  };
}, [ledgerData]);

const addExpense = useCallback((projectId, expense) => {
  const next = {
    ...ledgerData,
    [projectId]: {
      totalAmount: ledgerData[projectId]?.totalAmount || 0,
      expenses: [
        ...(ledgerData[projectId]?.expenses || []),
        { id: makeId('exp'), ...expense },
      ],
    },
  };

  setLedgerData(next);
}, [ledgerData]);

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

  dateKey,
}), [projects, vendors, materials, ledgerData, stockData]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

/* -------------------- HOOK -------------------- */

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}