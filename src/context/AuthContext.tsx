'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export interface User {
  name: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  postalCode?: string;
  city?: string;
  state?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function fetchCurrentUser() {
      try {
        const res = await fetch('/api/auth/me', { cache: 'no-store' });
        const data = await res.json();
        if (data?.user) {
          setUser(data.user);
        }
      } catch {
        setUser(null);
      }
    }

    fetchCurrentUser();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const r = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await r.json().catch(() => null);
      if (!r.ok) {
        return { success: false, message: data?.error || 'Inloggning misslyckades.' };
      }
      const account = data.user;
      setUser(account);
      return { success: true, message: `Välkommen tillbaka, ${account.name}!` };
    } catch (err) {
      return { success: false, message: 'Serverfel vid inloggning.' };
    }
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    try {
      const r = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await r.json().catch(() => null);
      if (!r.ok) {
        return { success: false, message: data?.error || 'Registrering misslyckades.' };
      }
      const account = data.user;
      setUser(account);
      return { success: true, message: `Registrering lyckades! Välkommen, ${account.name}!` };
    } catch (err) {
      return { success: false, message: 'Serverfel vid registrering.' };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
    } catch {
      // ignore
    }
    setUser(null);
  }, []);

  const updateUser = useCallback((updatedUser: User) => {
    setUser(updatedUser);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
      updateUser,
    }),
    [user, login, register, logout, updateUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
