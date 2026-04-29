import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getVendorsByType } from "../api/vendorApi";

const STORAGE_KEY = '@constructionERP/appState_v2';
const LEGACY_STORAGE_KEY = '@constructionERP/appState';

/* -------------------- HELPERS -------------------- */

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

/* -------------------- DEFAULT DATA -------------------- */

const seedProjects = [
  { id: 'p-001', name: 'Green Valley Apartments', location: 'Sector 14', status: 'Active' },
];

const seedLabour = [];

/* -------------------- CONTEXT -------------------- */

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [projects] = useState(seedProjects);
  const [labourRegistry, setLabourRegistry] = useState(seedLabour);

  // 🔥 IMPORTANT: vendors now from API only
  const [vendors, setVendors] = useState([]);

  const [attendance, setAttendance] = useState({});

  /* -------------------- API: FETCH VENDORS -------------------- */

  const fetchVendors = async () => {
    try {
      const res = await getVendorsByType();

      console.log("API VENDORS:", res.data);

      const data = res?.data?.data || [];

      const formatted = data.map((v) => ({
  id: v.id,
  name: v.name || v.vendor_name || 'Vendor',
  phone: v.phone,
  category: v.category,
}));

      setVendors(formatted);

    } catch (err) {
      console.log("Vendor API error:", err.response?.data || err.message);
    }
  };

  /* -------------------- LOAD DATA -------------------- */

  useEffect(() => {
    fetchVendors(); // 🔥 always load vendors from API

    let cancelled = false;

    (async () => {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      const legacyRaw = raw ? null : await AsyncStorage.getItem(LEGACY_STORAGE_KEY);
      const source = raw || legacyRaw;

      if (cancelled || !source) return;

      try {
        const parsed = JSON.parse(source);

        // ❌ DO NOT LOAD vendors from storage anymore

        const parsedLabour = Array.isArray(parsed?.labourRegistry) ? parsed.labourRegistry : [];
        setLabourRegistry(parsedLabour);

        const parsedAttendance = parsed?.attendance || {};
        setAttendance(parsedAttendance);

      } catch {
        // ignore
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  /* -------------------- PERSIST -------------------- */

  const persist = useCallback(async (next) => {
    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        labourRegistry: next.labourRegistry ?? labourRegistry,
        attendance: next.attendance ?? attendance,
        // ❌ DO NOT store vendors
      }),
    );
  }, [labourRegistry, attendance]);

  /* -------------------- LABOUR -------------------- */

  const upsertLabourPerson = useCallback(
    async (person) => {
      const id = person.id ?? makeId('lab');

      const nextPerson = {
        id,
        name: person.name,
        age: person.age,
        gender: person.gender,
        phone: person.phone,
        vendorId: person.vendorId,
      };

      const next = [...labourRegistry.filter((p) => p.id !== id), nextPerson];

      setLabourRegistry(next);
      await persist({ labourRegistry: next });

      return nextPerson;
    },
    [labourRegistry, persist],
  );

  /* -------------------- ATTENDANCE -------------------- */

  const attendanceKey = useCallback((projectId, day, labourId) => {
    return `${projectId}_${day}_${labourId}`;
  }, []);

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
      const next = { ...attendance, [key]: !attendance[key] };

      setAttendance(next);
      await persist({ attendance: next });

      return next[key];
    },
    [attendance, attendanceKey, persist],
  );

  /* -------------------- CONTEXT VALUE -------------------- */

  const value = useMemo(
    () => ({
      projects,
      labourRegistry,
      vendors,
      fetchVendors, // 🔥 exposed if needed

      upsertLabourPerson,
      attendanceFor,
      toggleAttendance,
      dateKey,
    }),
    [
      projects,
      labourRegistry,
      vendors,
      attendanceFor,
      toggleAttendance,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

/* -------------------- HOOK -------------------- */

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

export { bundleKey, dateKey, normalizePhone };