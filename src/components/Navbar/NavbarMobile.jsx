import { useState, useEffect, useRef } from 'react';
import {
  FaBars, FaTimes, FaTachometerAlt, FaGift, FaSearch, FaCog, FaUser, FaChevronDown
} from 'react-icons/fa';
import { FaRegRectangleList, FaCartShopping } from 'react-icons/fa6';
import { MdInsertChartOutlined } from 'react-icons/md';
import { Link } from 'react-router-dom';

export default function NavbarMobile() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState('');
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const submenuRef = useRef(null);

  const handleToggle = (id) => {
    setActive(id);
    setOpenSubmenu((prev) => (prev === id ? null : id));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (submenuRef.current && !submenuRef.current.contains(event.target)) {
        setOpenSubmenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // URLs para as opções, seguindo o desktop (adicione/ajuste conforme necessidade)
  const urls = {
    cadastros: [
      { url: 'cadastros/bens', label: 'Bens' },
      { url: 'cadastros/centro_custos', label: 'Centro de Custos' },
      { url: 'cadastros/centro_lucros', label: 'Centro de Lucros' },
      { url: 'cadastros/cliente_fornecedor', label: 'Clientes / Fornecedores' },
      { url: 'cadastros/funcionarios', label: 'Funcionários' },
      { url: 'cadastros/insumos', label: 'Insumos' },
      { url: 'cadastros/taxas', label: 'Taxas' },
      { url: 'cadastros/unidade_negocio', label: 'Unidade de Negócios' },
    ],
    despesas: [
      { url: '/despesas/insumos', label: 'Insumos' },
      { url: '/despesas/pagamento_funcionario', label: 'Pagamentos de Funcionários' },
    ],
    receitas: [
      { url: '/receitas/produtos', label: 'Produtos' },
    ],
    relatorios: [
      { url: '/relatorios/demonstracao_resultado', label: 'Demonstração do Resultado' },
      { url: '/relatorios/resumo_despesa', label: 'Resumo de Despesas' },
      { url: '/relatorios/resumo_receita', label: 'Resumo de Receitas' },
    ],
    configuracoes: [
      { url: '/system/enderecos', label: 'Endereços' },
    ],
    usuario: [
      { url: '/perfil', label: 'Perfil' },
      { url: '/sair', label: 'Sair' },
    ],
  };

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <FaTachometerAlt />,
    },
    {
      id: 'cadastros',
      label: 'Cadastros',
      icon: <FaRegRectangleList />,
      options: urls.cadastros,
    },
    {
      id: 'despesas',
      label: 'Lançamento Despesa',
      icon: <FaCartShopping />,
      options: urls.despesas,
    },
    {
      id: 'receitas',
      label: 'Lançamento Receita',
      icon: <FaGift />,
      options: urls.receitas,
    },
    {
      id: 'relatorios',
      label: 'Relatórios Gerenciais',
      icon: <MdInsertChartOutlined />,
      options: urls.relatorios,
    },
    {
      id: 'configuracoes',
      label: 'Configurações',
      icon: <FaCog />,
      options: urls.configuracoes,
    },
    {
      id: 'usuario',
      label: 'victorseraphin@gmail.com',
      icon: <FaUser />,
      options: urls.usuario,
    },
  ];

  return (
    <div className="md:hidden bg-emerald-500 text-white">
      <div className="p-4 flex justify-between items-center">
        <span className="text-lg font-bold">NavAgro</span>
        <button
          onClick={() => {
            setMenuOpen(!menuOpen);
            setOpenSubmenu(null);
          }}
          aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {menuOpen && (
        <nav ref={submenuRef} className="bg-white text-black shadow-md">
          {menuItems.map(({ id, label, icon, options }) => (
            <div key={id}>
              {!options ? (
                // Menu sem submenu, link direto
                <Link
                  to={`/${id}`}
                  onClick={() => {
                    setActive(id);
                    setMenuOpen(false);
                    setOpenSubmenu(null);
                  }}
                  className={`flex items-center gap-2 px-4 py-3 border-t border-gray-200 text-sm font-medium hover:bg-gray-100
                    ${active === id ? 'bg-emerald-100 text-emerald-700' : ''}`}
                >
                  <span className="text-xl">{icon}</span>
                  {label}
                </Link>
              ) : (
                <>
                  <button
                    onClick={() => handleToggle(id)}
                    className={`flex justify-between items-center w-full px-4 py-3 border-t border-gray-200 text-sm font-medium hover:bg-gray-100
                      ${active === id ? 'bg-emerald-100 text-emerald-700' : ''}`}
                    aria-expanded={openSubmenu === id}
                    aria-haspopup="true"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{icon}</span>
                      {label}
                    </div>
                    <FaChevronDown
                      className={`transition-transform ${openSubmenu === id ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {openSubmenu === id && (
                    <ul className="pl-8 py-2 text-sm bg-gray-50 border-l border-gray-300">
                      {options.map(({ url, label: optionLabel }) => (
                        <li key={url} className="py-1">
                          <Link
                            to={url}
                            onClick={() => {
                              setMenuOpen(false);
                              setOpenSubmenu(null);
                              setActive(id);
                            }}
                            className="block hover:text-emerald-600"
                          >
                            {optionLabel}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}
            </div>
          ))}
        </nav>
      )}
    </div>
  );
}
