import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';
import { setAccessToken, setUser as saveUserToStorage, getUser as getUserFromStorage } from './tokenManager';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // estado reativo
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tryRestoreSession = async () => {
      const storedUser = getUserFromStorage();

      if (storedUser) {
        setUser(storedUser); // restaura no estado do React
      }

      try {
        const res = await api.post('/refresh-token');
        setAccessToken(res.data.token);
        saveUserToStorage(res.data.systemUser);
        setUser(res.data.systemUser); // atualiza o estado do contexto
      } catch (err) {
        console.log("Token inválido ou expirado");
        setAccessToken(null);
        saveUserToStorage(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    tryRestoreSession();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await api.post('/login', { email, password });

      setAccessToken(response.data.accessToken);
      saveUserToStorage(response.data.systemUser);
      setUser(response.data.systemUser);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await api.post('/logout');
    saveUserToStorage(null);
    setAccessToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
