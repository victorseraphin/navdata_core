import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';
import { setAccessToken, getAccessToken, clearAccessToken } from './tokenManager';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await api.get('/me');
      setUser(res.data);
    } catch (error) {
      console.error("Erro ao obter dados do usuário:", error);
      setUser(null);
    }
  };

  useEffect(() => {
    const tryRestoreSession = async () => {
      try {
        await fetchUser();
      } catch (err) {
        console.log("Sessão expirada ou inválida");
        clearAccessToken();
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
      const res = await api.post('/login', { email, password });
      setAccessToken(res.data.accessToken);
      await fetchUser();
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.post('/logout');
    } catch (e) {
      console.warn("Erro ao fazer logout:", e);
    } finally {
      clearAccessToken();
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);