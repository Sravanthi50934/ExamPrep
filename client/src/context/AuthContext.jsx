import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('exam_tracker_token') || '');
  const [loading, setLoading] = useState(true);

  // Initialize and check token validity
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('exam_tracker_token');
      if (savedToken) {
        try {
          const res = await api.getProfile();
          if (res.success && res.data) {
            setUser(res.data);
            setToken(savedToken);
          } else {
            logout();
          }
        } catch (err) {
          console.error('Session expired or invalid:', err.message);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await api.login(email, password);
    if (res.success && res.data) {
      localStorage.setItem('exam_tracker_token', res.data.token);
      setToken(res.data.token);
      setUser(res.data);
      return res.data;
    }
    throw new Error(res.message || 'Login failed');
  };

  const register = async (name, email, password, targetExam) => {
    const res = await api.register(name, email, password, targetExam);
    if (res.success && res.data) {
      localStorage.setItem('exam_tracker_token', res.data.token);
      setToken(res.data.token);
      setUser(res.data);
      return res.data;
    }
    throw new Error(res.message || 'Registration failed');
  };

  const logout = () => {
    localStorage.removeItem('exam_tracker_token');
    setToken('');
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const res = await api.getProfile();
      if (res.success && res.data) {
        setUser(res.data);
      }
    } catch (err) {
      console.error('Failed to refresh user:', err);
    }
  };

  const updateUser = async (updates) => {
    const res = await api.updateProfile(updates);
    if (res.success && res.data) {
      setUser(res.data);
      return res.data;
    }
    throw new Error(res.message || 'Update failed');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token && !!user,
        login,
        register,
        logout,
        refreshUser,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
