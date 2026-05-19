import React, { createContext, useContext, useState } from 'react';
import { apiClient } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('admin_token'));

  // Public website does not use legacy /api/admin/me — Supabase auth lives on the platform app.

  const login = async (email, password) => {
    const data = await apiClient('/admin/login', {
      body: { email, password },
    });
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('admin_token', data.token);
    return data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('admin_token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
