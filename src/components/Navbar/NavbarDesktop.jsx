import { useState, useRef, useEffect } from 'react';
import { FaBars, FaTimes, FaTachometerAlt, FaGift, FaSearch, FaCog, FaUser, FaChevronDown } from 'react-icons/fa';
import { FaRegRectangleList, FaCartShopping } from 'react-icons/fa6';
import { MdInsertChartOutlined } from 'react-icons/md';
import { Link, useNavigate } from 'react-router-dom';

export default function NavbarDesktop() {
  const submenuRef = useRef(null);
  const navigate = useNavigate();

  const [active, setActive] = useState('dashboard');

  // Estado único para controlar qual submenu está aberto, guardando o id do menu
  const [openSubmenu, setOpenSubmenu] = useState(null);

  // Dados menus principais
  const menu1 = [
    { id: 'dashboard', label: 'Dashboard', icon: <FaTachometerAlt />, withMenu: false },
    { id: 'cadastros', label: 'Cadastros', icon: <FaRegRectangleList />, withMenu: true },
    { id: 'despesas', label: 'Lançamento Despesa', icon: <FaCartShopping />, withMenu: true },
    { id: 'receitas', label: 'Lançamento Receita', icon: <FaGift />, withMenu: true },
    { id: 'relatorios', label: 'Relatórios Gerenciais', icon: <MdInsertChartOutlined />, withMenu: true },
  ];

  const menu2 = [
    { id: 'configuracoes', label: 'Configuração', icon: <FaCog />, withMenu: true },
    { id: 'usuarios', label: 'victorseraphin@gmail.com', icon: <FaUser />, withMenu: true },
  ];

  // Opções dos submenus
  const cadastrosOptions = [
    { url: 'cadastros/bens', label: 'Bens' },
    { url: 'cadastros/centro_custos', label: 'Centro de Custos' },
    { url: 'cadastros/centro_lucros', label: 'Centro de Lucros' },
    { url: 'cadastros/cliente_fornecedor', label: 'Clientes / Fornecedores' },
    { url: 'cadastros/funcionarios', label: 'Funcionários' },
    { url: 'cadastros/insumos', label: 'Insumos' },
    { url: 'cadastros/taxas', label: 'Taxas' },
    { url: 'cadastros/unidade_negocio', label: 'Unidade de Negócios' },
  ];

  const despesasOptions = [
    { url: '/despesas/insumos', label: 'Insumos' },
    { url: '/despesas/pagamento_funcionario', label: 'Pagamentos de Funcionários' },
  ];

  const receitasOptions = [{ url: '/receitas/produtos', label: 'Produtos' }];

  const relatoriosOptions = [
    { url: '/relatorios/demonstracao_resultado', label: 'Demonstração do Resultado' },
    { url: '/relatorios/resumo_despesa', label: 'Resumo de Despesas' },
    { url: '/relatorios/resumo_receita', label: 'Resumo de Receitas' },
  ];

  const configuracoesOptions = [{ url: '/system/enderecos', label: 'Endereços' }];

  const usuariosOptions = [
    { url: '/perfil', label: 'Perfil' },
    { url: '/sair', label: 'Sair' },
  ];

  // Fecha qualquer submenu clicando fora
  useEffect(() => {
    function handleClickOutside(event) {
      if (submenuRef.current && !submenuRef.current.contains(event.target)) {
        setOpenSubmenu(null);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Função pra abrir ou fechar submenu
  const toggleSubmenu = (id) => {
    setActive(id);
    setOpenSubmenu((current) => (current === id ? null : id));
  };

  // Função para renderizar submenu, recebe id do menu e lista de opções
  const renderSubmenu = (id, options, position = 'left') => {
    if (openSubmenu !== id) return null;

    const posClasses =
      position === 'right'
        ? 'absolute right-0 mt-2 w-40 bg-white text-gray-800 border border-gray-300 rounded-md z-50 shadow-lg'
        : 'absolute top-full left-0 mt-1 w-52 bg-white border border-gray-300 rounded z-50 shadow-lg';

    return (
      <ul className={posClasses} ref={submenuRef}>
        {options.map(({ url, label }) => (
          <li key={url}>
            <Link
              to={url}
              className="block w-full text-left px-4 py-2 text-[12px] hover:bg-emerald-500 hover:text-white"
              onClick={() => setOpenSubmenu(null)}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div>
      {/* Top bar */}
      <div className="bg-emerald-500 text-white px-6 py-3 flex justify-between items-center text-sm">
        <div className="text-lg font-bold">NavAgro</div>

        <div className="hidden md:flex items-center gap-4 relative">
          <div className="relative">
            <input
              type="text"
              placeholder="Procurar"
              className="bg-emerald-600 placeholder-white text-white px-4 py-1 rounded-full text-sm focus:outline-none"
            />
            <FaSearch className="absolute right-3 top-1.5 text-white text-xs" />
          </div>

          {/* menu2 */}
          {menu2.map(({ id, label, icon, withMenu }) => (
            <div key={id} className="relative">
              <button
                onClick={() => toggleSubmenu(id)}
                className="flex items-center gap-1"
                aria-expanded={openSubmenu === id}
                aria-haspopup="true"
              >
                <div className="text-xs">{icon}</div>
                <span>{label}</span>
                {withMenu && <FaChevronDown className={`text-xs transition-transform ${openSubmenu === id ? 'rotate-180' : ''}`} />}
              </button>

              {id === 'configuracoes' && renderSubmenu(id, configuracoesOptions, 'right')}
              {id === 'usuarios' && renderSubmenu(id, usuariosOptions, 'right')}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom menu */}
      <div className="bg-white border border-gray-300 relative">
        <ul className="hidden md:flex px-6 text-sm relative">
          {menu1.map(({ id, label, icon, withMenu }) => (
            <li key={id} className="relative border-l border-l-gray-300">
              {!withMenu ? (
                <Link
                  to={id}
                  onClick={() => {
                    setActive(id);
                    setOpenSubmenu(null);
                  }}
                  className={`flex flex-col items-center justify-center px-4 py-2 text-xs font-medium transition-colors duration-300
                  ${
                    active === id
                      ? 'text-black border-b-2 border-red-500'
                      : 'text-gray-400 hover:text-black hover:border-gray-300 border-b-2 border-transparent'
                  }`}
                >
                  <div className="text-xl">{icon}</div>
                  {label}
                </Link>
              ) : (
                <>
                  <button
                    onClick={() => toggleSubmenu(id)}
                    className={`flex flex-col items-center justify-center px-4 py-2 text-xs font-medium transition-colors duration-300
                    ${
                      active === id
                        ? 'text-black border-b-2 border-red-500'
                        : 'text-gray-400 hover:text-black hover:border-gray-300 border-b-2 border-transparent'
                    }`}
                    aria-expanded={openSubmenu === id}
                    aria-haspopup="true"
                  >
                    <div className="text-xl">{icon}</div>
                    {label}
                  </button>

                  {/* submenu */}
                  {id === 'cadastros' && renderSubmenu(id, cadastrosOptions)}
                  {id === 'despesas' && renderSubmenu(id, despesasOptions)}
                  {id === 'receitas' && renderSubmenu(id, receitasOptions)}
                  {id === 'relatorios' && renderSubmenu(id, relatoriosOptions)}
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
