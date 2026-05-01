'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export interface User {
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => { success: boolean; message: string };
  register: (name: string, email: string, password: string) => { success: boolean; message: string };
  logout: () => void;
  getAuthLogs: () => AuthLog[];
  getAllUsers: () => User[];
}

const AuthContext = createContext<AuthContextType | null>(null);

const USERS_KEY = 'vikingfuel_users';
const CURRENT_USER_KEY = 'vikingfuel_current_user';
const AUTH_LOGS_KEY = 'vikingfuel_auth_logs';

interface AuthLog {
  action: 'login' | 'register' | 'logout';
  email: string;
  timestamp: string;
}

function getStoredUsers(): Array<{ name: string; email: string; password: string }> {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Array<{ name: string; email: string; password: string }>;
  } catch {
    return [];
  }
}

function setStoredUsers(users: Array<{ name: string; email: string; password: string }>) {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch {
    // ignore
  }
}

function getStoredCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

function setStoredCurrentUser(user: User | null) {
  try {
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  } catch {
    // ignore
  }
}

function getStoredAuthLogs(): AuthLog[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(AUTH_LOGS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as AuthLog[];
  } catch {
    return [];
  }
}

function setStoredAuthLogs(logs: AuthLog[]) {
  try {
    localStorage.setItem(AUTH_LOGS_KEY, JSON.stringify(logs));
  } catch {
    // ignore
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(getStoredCurrentUser());
  }, []);

  const login = useCallback((email: string, password: string) => {
    const users = getStoredUsers();
    const account = users.find((item) => item.email.toLowerCase() === email.toLowerCase());
    if (!account) {
      return { success: false, message: 'Det gick inte att hitta något konto med denna e-post.' };
    }
    if (account.password !== password) {
      return { success: false, message: 'Lösenordet är felaktigt. Försök igen.' };
    }
    const loggedInUser = { name: account.name, email: account.email };
    setUser(loggedInUser);
    setStoredCurrentUser(loggedInUser);
    const logs = getStoredAuthLogs();
    logs.push({
      action: 'login',
      email: account.email,
      timestamp: new Date().toISOString(),
    });
    setStoredAuthLogs(logs);
    return { success: true, message: `Välkommen tillbaka, ${account.name}!` };
  }, []);

  const register = useCallback((name: string, email: string, password: string) => {
    const users = getStoredUsers();
    const existing = users.find((item) => item.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return { success: false, message: 'Det finns redan ett konto med denna e-postadress.' };
    }
    const newUser = { name, email, password };
    const nextUsers = [...users, newUser];
    setStoredUsers(nextUsers);
    const loggedInUser = { name, email };
    setUser(loggedInUser);
    setStoredCurrentUser(loggedInUser);
    const logs = getStoredAuthLogs();
    logs.push({
      action: 'register',
      email,
      timestamp: new Date().toISOString(),
    });
    setStoredAuthLogs(logs);
    return { success: true, message: `Registrering lyckades! Välkommen, ${name}!` };
  }, []);

  const logout = useCallback(() => {
    // Log the logout event before clearing user
    if (user) {
      const logs = getStoredAuthLogs();
      logs.push({
        action: 'logout',
        email: user.email,
        timestamp: new Date().toISOString(),
      });
      setStoredAuthLogs(logs);
    }
    setUser(null);
    setStoredCurrentUser(null);
  }, [user]);

  const getAuthLogs = useCallback(() => {
    return getStoredAuthLogs();
  }, []);

  const getAllUsers = useCallback(() => {
    return getStoredUsers().map(({ password, ...user }) => user); // Exclude passwords for security
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
      getAuthLogs,
      getAllUsers,
    }),
    [user, login, register, logout, getAuthLogs, getAllUsers]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
