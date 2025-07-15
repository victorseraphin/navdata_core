import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';

import PrivateRoute from './components/layouts/PrivateRoute';
import PrivateLayout from "./components/layouts/PrivateLayout";
import PublicLayout from "./components/layouts/PublicLayout";

import { useAuth } from './hooks/AuthContext';

import Dashboard from './pages/Dashboard/Dashboard';
import Bens from './pages/Cadastros/Bens/Bens';
import CentroCustos from './pages/Cadastros/CentroCustos/CentroCustos';
import CentroLucros from './pages/Cadastros/CentroLucros/CentroLucros';
import ClienteFornecedor from './pages/Cadastros/ClienteFornecedor/ClienteFornecedor';
import Funcionarios from './pages/Cadastros/Funcionarios/Funcionarios';
import CadInsumos from './pages/Cadastros/Insumos/Insumos';
import Taxas from './pages/Cadastros/Taxas/Taxas';
import UnidadeNegocios from './pages/Cadastros/UnidadeNegocios/UnidadeNegocios';

import Insumos from './pages/Despesas/Insumos/Insumos';
import PagamentoFuncionarios from './pages/Despesas/PagamentoFuncionarios/PagamentoFuncionarios';

import Produtos from './pages/Receitas/Produtos/Produtos';

import DemonstracaoResultado from './pages/RelatoriosGerenciais/DemonstracaoResultado/DemonstracaoResultado';
import ResumoDespesas from './pages/RelatoriosGerenciais/ResumoDespesas/ResumoDespesas';
import ResumoReceitas from './pages/RelatoriosGerenciais/ResumoReceitas/ResumoReceitas';

import Enderecos from './pages/System/Enderecos/Enderecos';

import Login from './pages/Login/Login';

export default function App() {
  const { user, loading } = useAuth();

  if (loading) return <div>Carregando...</div>;

  return (
    <>

      <Routes>
        {/* PUBLIC ROUTES */}
        <Route element={<PublicLayout />}>
          <Route path="/login" element={<Login />} />
        </Route>

        {/* PRIVATE ROUTES */}
        <Route element={!user ? <PrivateLayout /> : <Navigate to="/login" replace /> }>

          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/cadastros/bens" element={<Bens />} />
          <Route path="/cadastros/centro_custos" element={<CentroCustos />} />
          <Route path="/cadastros/centro_lucros" element={<CentroLucros />} />
          <Route path="/cadastros/cliente_fornecedor" element={<ClienteFornecedor />} />
          <Route path="/cadastros/funcionarios" element={<Funcionarios />} />
          <Route path="/cadastros/insumos" element={<CadInsumos />} />
          <Route path="/cadastros/taxas" element={<Taxas />} />
          <Route path="/cadastros/unidade_negocio" element={<UnidadeNegocios />} />

          <Route path="/despesas/insumos" element={<Insumos />} />
          <Route path="/despesas/pagamento_funcionario" element={<PagamentoFuncionarios />} />

          <Route path="/receitas/produtos" element={<Produtos />} />

          <Route path="/relatorios/demonstracao_resultado" element={<DemonstracaoResultado />} />
          <Route path="/relatorios/resumo_despesa" element={<ResumoDespesas />} />
          <Route path="/relatorios/resumo_receita" element={<ResumoReceitas />} />

          <Route path="/perfil" element={<Enderecos />} />
          <Route path="/system/enderecos" element={<Enderecos />} />

          {/* Adicione os demais caminhos aqui */}

        </Route>

      </Routes>
    </>
  );
}