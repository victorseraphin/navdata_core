import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';
import { setAccessToken, getAccessToken, clearAccessToken } from './tokenManager';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const resRefresh = await api.post('/refresh-token', null, {
          withCredentials: true, // envia cookie HttpOnly
        });
        setAccessToken(resRefresh.data.accessToken);

        const resUser = await api.get('/me', {
          headers: {
            Authorization: `Bearer ${resRefresh.data.accessToken}`,
          },
        });
        setUser(resUser.data);
      } catch (err) {
        console.log('Sessão expirada');
        clearAccessToken();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.post('/login', { email, password }, { withCredentials: true });
      setAccessToken(res.data.accessToken);

      const me = await api.get('/me', {
        headers: {
          Authorization: `Bearer ${res.data.accessToken}`,
        },
      });

      setUser(me.data);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await api.post('/logout', null, { withCredentials: true });
    clearAccessToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
