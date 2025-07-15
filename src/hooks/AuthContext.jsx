import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';
import { setAccessToken } from './tokenManager';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Tenta renovar o token ao carregar a aplicação
  useEffect(() => {
    const tryRefresh = async () => {
      try {
        const res = await api.post('/refresh-token');
        setAccessToken(res.data.token);
        setUser(res.data.user); // ou apenas set algo fictício se não vier user
      } catch (err) {
        console.log("Token inválido ou expirado");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    tryRefresh();
  }, []);

  const login = async (username, password) => {
    setLoading(true);
    try {
      const response = await api.post('/login', { username, password });
      setAccessToken(response.data.accessToken);
      setUser(response.data.user);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await api.post('/logout');
    setUser(null);
    setAccessToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);