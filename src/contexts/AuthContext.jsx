import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = '@constructionERP/auth';

const AuthContext = createContext(null);

const ACCOUNTS = [
  { id: 'adm-001', username: 'admin', password: 'admin123', name: 'Admin', role: 'admin', age: '34', gender: 'Male', phone: '9000000001' },
  { id: 'mgr-001', username: 'manager', password: 'manager123', name: 'Site Manager', role: 'manager', age: '31', gender: 'Male', phone: '9000000002' },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isRestoring, setIsRestoring] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        // Always require explicit sign-in when app starts.
        await AsyncStorage.removeItem(STORAGE_KEY);
        if (cancelled) return;
        setUser(null);
      } finally {
        if (!cancelled) setIsRestoring(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (params) => {
    const username = String(params.username || '').trim().toLowerCase();
    const password = String(params.password || '');

    const hit = ACCOUNTS.find((a) => a.username === username && a.password === password) || null;
    if (!hit) throw new Error('INVALID_CREDENTIALS');

    const nextUser = {
      id: hit.id,
      name: hit.name,
      role: hit.role,
      username: hit.username,
      companyName: 'Srutika Constructions',
      age: hit.age,
      gender: hit.gender,
      phone: hit.phone,
    };
    setUser(nextUser);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
  }, []);

  const logout = useCallback(async () => {
    setUser(null);
    await AsyncStorage.removeItem(STORAGE_KEY);
  }, []);

  const value = useMemo(() => ({ user, isRestoring, login, logout }), [user, isRestoring, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
