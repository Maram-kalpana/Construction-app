import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { managerLogin } from '../api/authApi';

const STORAGE_KEY = '@constructionERP/auth';
const TOKEN_KEY = '@constructionERP/token';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isRestoring, setIsRestoring] = useState(true);

  // ✅ Restore user on app start
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const savedUser = await AsyncStorage.getItem(STORAGE_KEY);
        const savedToken = await AsyncStorage.getItem(TOKEN_KEY);

        if (!cancelled && savedUser && savedToken) {
          setUser(JSON.parse(savedUser));
        }
      } catch (e) {
        console.log('Restore error:', e);
      } finally {
        if (!cancelled) setIsRestoring(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // ✅ LOGIN WITH API
  const login = useCallback(async ({ username, password }) => {
    try {
      const res = await managerLogin({
        login: username,     // 🔥 API expects "login"
        password: password,
      });

      const { token, user } = res.data;

      // ✅ Store token
      await AsyncStorage.setItem(TOKEN_KEY, token);

      // ✅ Store user
      const nextUser = {
        id: user.id,
        name: user.name,
        role: user.role,
        email: user.email,
        phone: user.phone,
      };

      setUser(nextUser);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));

      return true;
    } catch (error) {
      console.log('Login error:', error.response?.data || error.message);
      throw new Error('INVALID_CREDENTIALS');
    }
  }, []);

  // ✅ LOGOUT
  const logout = useCallback(async () => {
    setUser(null);
    await AsyncStorage.removeItem(STORAGE_KEY);
    await AsyncStorage.removeItem(TOKEN_KEY);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isRestoring,
      login,
      logout,
    }),
    [user, isRestoring, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ✅ HOOK
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}