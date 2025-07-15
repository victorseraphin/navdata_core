import React, { useState } from 'react';
import { useAuth } from '../../hooks/AuthContext';

export default function LoginPage() {
  const { login, loading } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    try {
      await login(username, password);
      // redirecionar para página inicial ou dashboard
    } catch {
      setError('Usuário ou senha inválidos');
    }
  };

  return (
    <div className="flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-md shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center">Login</h2>
        {error && <p className="text-red-600 mb-4">{error}</p>}
        <input
          type="text"
          placeholder="E-mail"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="border p-3 rounded w-full mb-4"
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="border p-3 rounded w-full mb-6"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-emerald-600 text-white w-full py-3 rounded hover:bg-emerald-700 disabled:opacity-50"
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}
