import React, { useEffect, useState } from "react";
import axios from "../../../api/axiosAuth";
import API_URL from "../../../services/apiAuthUrl";
import { FiX } from "react-icons/fi";

export default function FormUsuarioSistemas({ registro, onSalvar, onCancelar }) {
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);
  const [sistemas, setSistemas] = useState([]);

  const [listSystemUnits, setListSystemUnits] = useState([]);

  const caregarListSystemUnits = async () => {
    setCarregando(true);
    setErro(null);
    try {
      const response = await axios.get(`${API_URL}/v1/system_units`);
      const dadosConvertidos = response.data
        .filter((item) => !item.deletedAt)
        .map((item) => ({
          id: item.id,
          name: item.name,
        }));
      setListSystemUnits(dadosConvertidos);
    } catch (err) {
      setErro(err.response?.data?.message || err.message || "Erro ao buscar sistemas");
    } finally {
      setCarregando(false);
    }
  };


  const carregarSistemas = async () => {
    setCarregando(true);
    setErro(null);

    try {
      const response = await axios.get(
        `${API_URL}/v1/system_users/${registro.id}/systems`
      );
      console.log(response.data);
      
      setSistemas(response.data);
    } catch (err) {
      setErro("Erro ao carregar permissões: " + (err.response?.data?.message || err.message));
    } finally {
      setCarregando(false);
    }
  };

  const [filtroSistemas, setFiltroSistemas] = useState("");
  const [paginaAtualSistemas, setPaginaAtualSistemas] = useState(1);
  const itensPorPaginaSistemas = 10;

  // Filtro aplicado
  const sistemasFiltrados = sistemas.filter((p) =>
    `${p.name}`.toLowerCase().includes(filtroSistemas.toLowerCase())
  );

  // Paginação local
  const totalPaginasSistema = Math.ceil(sistemasFiltrados.length / itensPorPaginaSistemas);
  const inicioSistema = (paginaAtualSistemas - 1) * itensPorPaginaSistemas;
  const fimSistema = inicioSistema + itensPorPaginaSistemas;
  const sistemasPaginados = sistemasFiltrados.slice(inicioSistema, fimSistema);

  const alterarSistema = (systemId) => {
    setSistemas((prev) =>
      prev.map((p) =>
        p.systemId === systemId ? { ...p, permitted: !p.permitted } : p
      )
    );
  };

  useEffect(() => {
    if (!registro) return;
    carregarSistemas();
    caregarListSystemUnits();
  }, [registro]);

  const salvar = async () => {

    const payloadSistemas = sistemas.map((p) => (console.log(p), {
      systemId: p.systemId,
      permitted: p.permitted,
    }));

    try {
      await axios.put(
        `${API_URL}/v1/system_users/${registro.id}/systems`,
        payloadSistemas
      );
      onSalvar?.(); // notifica a página principal
    } catch (err) {
      setErro("Erro ao salvar sistemas: " + (err.response?.data?.message || err.message));
    }
  };

  if (!registro) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col overflow-auto">
      {carregando && (
        <div className="text-center text-gray-600 my-4">Carregando dados...</div>
      )}
      {erro && (
        <div className="text-center text-red-500 my-4">Erro: {erro}</div>
      )}
      {/* Barra superior */}
      <div className="flex items-center justify-between h-14 border-b shadow-sm sticky top-0 bg-sky-600 z-10 text-white">
        <button
          onClick={onCancelar}
          className="h-full aspect-square flex items-center justify-center hover:bg-sky-700"
          aria-label="Fechar"
        >
          <FiX className="text-red-500 text-2xl" />
        </button>

        <h2 className="text-base font-semibold text-white">
          {registro ? "Editar acesso aos Sistemas" : "Cadastrar acesso aos Sistemas"}
        </h2>

        <button
          onClick={salvar}
          className="h-full px-6 flex items-center justify-center text-sm font-medium bg-sky-600 text-white hover:bg-sky-700"
        >
          Salvar
        </button>
      </div>
      <div className="flex-1 px-6 py-6 overflow-y-auto">
        <form className="w-full flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
          <div className="flex flex-col lg:flex-row gap-4 w-full items-center justify-center">
            <div className="w-full lg:w-2/3">
              <label className="block text-sm font-medium text-gray-600 mb-1">Nome</label>
              <input
                type="text"
                className="w-full border border-gray-300 px-3 py-1 rounded text-sm"
                placeholder="Digite o nome"
                disabled
                value={registro.name}
              />
            </div>

            <div className="w-full lg:w-2/3">
              <label className="block text-sm font-medium text-gray-600 mb-1">Unidade</label>
              <select
                className="w-full border border-gray-300 px-3 py-1 rounded text-sm "
                //value={systemUnitsSelecionado}
                disabled
              >
                {listSystemUnits.map((sys) => (
                  <option key={sys.id} value={sys.id.toString()}>
                    {sys.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

        </form>
        <div className="flex flex-col lg:flex-row gap-6 w-full my-6 ">
          {/* Tabela Sistemas */}
          <div className="bg-white rounded shadow-[0_0_10px_rgba(0,0,0,0.15)] w-full p-6 relative ">
            <h2 className="text-xl font-bold mb-4">Sistemas do Usuário</h2>

            {carregando ? (
              <p className="text-gray-600">Carregando sistemas...</p>
            ) : erro ? (
              <p className="text-red-600">{erro}</p>
            ) : (
              <div>
                <div className="overflow-y-auto max-h-[60vh] border border-gray-300 rounded">
                  <div className="mb-4 flex justify-between items-center">
                    <input
                      type="text"
                      placeholder="Filtrar por nome..."
                      value={filtroSistemas}
                      onChange={(e) => {
                        setFiltroSistemas(e.target.value);
                        setPaginaAtualSistemas(1);
                      }}
                      className="border px-3 py-1 rounded text-sm w-1/2"
                    />
                    <span className="text-sm text-gray-600">
                      {sistemasFiltrados.length} sistemas encontradas
                    </span>
                  </div>
                  <table className="min-w-full text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="p-2 text-left">Nome</th>
                        <th className="p-2 text-center">Permitir</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sistemasPaginados.map((sistema) => (
                        <tr key={sistema.systemId} className="border-t">
                          <td className="p-2">{sistema.name}</td>
                          <td className="p-2 text-center">
                            <input
                              type="checkbox"
                              checked={sistema.permitted}
                              onChange={() => alterarSistema(sistema.systemId)}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex justify-center items-center gap-6 mt-6 text-gray-700">
                  <button
                    onClick={() => setPaginaAtualSistemas((p) => Math.max(1, p - 1))}
                    disabled={paginaAtualSistemas === 1}
                    className="disabled:opacity-50 px-3 py-1 rounded border border-gray-300 hover:bg-gray-100"
                  >
                    &lt;
                  </button>
                  <div className="bg-sky-500 text-white rounded-full px-4 py-1 font-semibold">
                    {paginaAtualSistemas}
                  </div>
                  <button
                    onClick={() => setPaginaAtualSistemas((p) => Math.min(totalPaginas, p + 1))}
                    disabled={paginaAtualSistemas === totalPaginasSistema}
                    className="disabled:opacity-50 px-3 py-1 rounded border border-gray-300 hover:bg-gray-100"
                  >
                    &gt;
                  </button>
                </div>
              </div>
            )}
          </div>
          
        </div>

        
      </div>
    </div>
  );
};

