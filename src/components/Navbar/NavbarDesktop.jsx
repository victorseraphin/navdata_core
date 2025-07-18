import { useState, useRef, useEffect } from 'react';
import { FaBars, FaTimes, FaTachometerAlt, FaGift, FaSearch, FaCog, FaUser, FaChevronDown } from 'react-icons/fa';
import { FaRegRectangleList, FaCartShopping } from 'react-icons/fa6';
import { MdInsertChartOutlined } from 'react-icons/md';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/AuthContext';

export default function NavbarDesktop() {
  const submenuRef = useRef(null);
  const { logout } = useAuth();
  const { user } = useAuth();

  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };


  const [active, setActive] = useState('dashboard');

  // Estado único para controlar qual submenu está aberto, guardando o id do menu
  const [openSubmenu, setOpenSubmenu] = useState(null);

  // Dados menus principais
  const menu1 = [
    { id: 'dashboard', label: 'Dashboard', icon: <FaTachometerAlt />, withMenu: false },
    { id: 'cadastros', label: 'Cadastros', icon: <FaRegRectangleList />, withMenu: true },
  ];

  const menu2 = [
    { id: 'usuarios', label: user.email, icon: <FaUser />, withMenu: true },
  ];

  // Opções dos submenus
  const cadastrosOptions = [
    { url: 'cadastros/empresas', label: 'Empresas' },
    { url: 'cadastros/sistemas', label: 'Sistemas' },
    { url: 'cadastros/programas', label: 'Programas' },
    { url: 'cadastros/grupos', label: 'Grupos' },
    { url: 'cadastros/usuarios', label: 'Usuários' },
  ];

  const usuariosOptions = [
    { url: '/system/enderecos', label: 'Endereços' },
    { url: '/perfil', label: 'Perfil' },
    { action: handleLogout, label: 'Sair' },
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
        {options.map(({ url, label, action }) => (
          <li key={url || label || index}>
            {action ? (
              <button
                onClick={() => {
                  action();
                  setOpenSubmenu(null);
                }}
                className="w-full text-left px-4 py-2 text-[12px] hover:bg-sky-700 hover:text-white"
              >
                {label}
              </button>
            ) : (
              <Link
                to={url}
                className="block w-full text-left px-4 py-2 text-[12px] hover:bg-sky-700 hover:text-white"
                onClick={() => setOpenSubmenu(null)}
              >
                {label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div>
      {/* Top bar */}
      <div className="bg-sky-700 text-white px-6 py-3 flex justify-between items-center text-sm">
        <div className="text-lg font-bold">NavCore</div>

        <div className="hidden md:flex items-center gap-4 relative">
          <div className="relative">
            <input
              type="text"
              placeholder="Procurar"
              className="bg-sky-800 placeholder-white text-white px-4 py-1 rounded-full text-sm focus:outline-none"
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
                  ${active === id
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
                    ${active === id
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
