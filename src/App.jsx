import { Routes, Route, Navigate } from 'react-router-dom';

import PrivateLayout from "./components/layouts/PrivateLayout";
import PublicLayout from "./components/layouts/PublicLayout";

import { useAuth } from './hooks/AuthContext';

import Dashboard from './pages/Dashboard/Dashboard';
import Empresas from './pages/Cadastros/Empresas/Empresas';
import Sistemas from './pages/Cadastros/Sistemas/Sistemas';
import Grupos from './pages/Cadastros/Grupos/Grupos';
import Programas from './pages/Cadastros/Programas/Programas';
import Usuarios from './pages/Cadastros/Usuarios/Usuarios';

import Login from './pages/Login/Login';

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="w-full h-screen flex items-center justify-center">Carregando...</div>;
  }
  
  return (
    <>

      <Routes>
        {/* PUBLIC ROUTES */}
        <Route element={<PublicLayout />}>
          <Route path="/login" element={<Login />} />
        </Route>

        {/* PRIVATE ROUTES */}
        <Route element={user ? <PrivateLayout /> : <Navigate to="/login" replace />}>

          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/cadastros/empresas" element={<Empresas />} />
          <Route path="/cadastros/sistemas" element={<Sistemas />} />
          <Route path="/cadastros/grupos" element={<Grupos />} />
          <Route path="/cadastros/programas" element={<Programas />} />
          <Route path="/cadastros/usuarios" element={<Usuarios />} />

          {/* Adicione os demais caminhos aqui */}

        </Route>

      </Routes>
    </>
  );
}