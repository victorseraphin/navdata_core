import React, { useEffect, useState } from "react";
import axios from "../../../api/axiosAuth";
import API_URL from "../../../services/apiAuthUrl";
import { FiX } from "react-icons/fi";

export default function FormUsuarioPermissoes({ registro, onSalvar, onCancelar }) {
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);
  const [programas, setProgramas] = useState([]);
  const [grupos, setGrupos] = useState([]);

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

  const carregarPermissoes = async () => {
    setCarregando(true);
    setErro(null);

    try {
      const response = await axios.get(
        `${API_URL}/v1/system_users/${registro.id}/permissions`
      );
      setProgramas(response.data);
    } catch (err) {
      setErro("Erro ao carregar permissões: " + (err.response?.data?.message || err.message));
    } finally {
      setCarregando(false);
    }
  };  

  const [filtro, setFiltro] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 10;

  // Filtro aplicado
  const programasFiltrados = programas.filter((p) =>
    `${p.name} ${p.path} ${p.method}`.toLowerCase().includes(filtro.toLowerCase())
  );

  // Paginação local
  const totalPaginas = Math.ceil(programasFiltrados.length / itensPorPagina);
  const inicio = (paginaAtual - 1) * itensPorPagina;
  const fim = inicio + itensPorPagina;
  const programasPaginados = programasFiltrados.slice(inicio, fim);

  const alterarPermissao = (programId) => {
    setProgramas((prev) =>
      prev.map((p) =>
        p.programId === programId ? { ...p, permitted: !p.permitted } : p
      )
    );
  };

  const carregarGrupos = async () => {
    setCarregando(true);
    setErro(null);

    try {
      const response = await axios.get(
        `${API_URL}/v1/system_users/${registro.id}/groups`
      );
      console.log(response.data);
      
      setGrupos(response.data);
    } catch (err) {
      setErro("Erro ao carregar permissões: " + (err.response?.data?.message || err.message));
    } finally {
      setCarregando(false);
    }
  };

  const [filtroGrupos, setFiltroGrupos] = useState("");
  const [paginaAtualGrupos, setPaginaAtualGrupos] = useState(1);
  const itensPorPaginaGrupos = 10;

  // Filtro aplicado
  const gruposFiltrados = grupos.filter((p) =>
    `${p.name}`.toLowerCase().includes(filtroGrupos.toLowerCase())
  );

  // Paginação local
  const totalPaginasGrupo = Math.ceil(gruposFiltrados.length / itensPorPaginaGrupos);
  const inicioGrupo = (paginaAtualGrupos - 1) * itensPorPaginaGrupos;
  const fimGrupo = inicioGrupo + itensPorPaginaGrupos;
  const gruposPaginados = gruposFiltrados.slice(inicioGrupo, fimGrupo);

  const alterarGrupo = (groupId) => {
    setGrupos((prev) =>
      prev.map((p) =>
        p.groupId === groupId ? { ...p, permitted: !p.permitted } : p
      )
    );
  };

  useEffect(() => {
    if (!registro) return;

    carregarPermissoes();
    carregarGrupos();
    caregarListSystemUnits();
  }, [registro]);

  const salvar = async () => {
    const payloadProgramas = programas.map((p) => (console.log(p), {
      programId: p.programId,
      permitted: p.permitted,
    }));

    try {
      await axios.put(
        `${API_URL}/v1/system_users/${registro.id}/permissions`,
        payloadProgramas
      );
      onSalvar?.(); // notifica a página principal
    } catch (err) {
      setErro("Erro ao salvar permissões: " + (err.response?.data?.message || err.message));
    }

    const payloadGrupos = grupos.map((p) => (console.log(p), {
      groupId: p.groupId,
      permitted: p.permitted,
    }));

    try {
      await axios.put(
        `${API_URL}/v1/system_users/${registro.id}/groups`,
        payloadGrupos
      );
      onSalvar?.(); // notifica a página principal
    } catch (err) {
      setErro("Erro ao salvar permissões: " + (err.response?.data?.message || err.message));
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
          {registro ? "Editar Usuario" : "Cadastrar Usuario"}
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

          {/* Tabela Grupos */}
          <div className="bg-white rounded shadow-[0_0_10px_rgba(0,0,0,0.15)] w-full p-6 relative">
            <h2 className="text-xl font-bold mb-4">Grupos do Usuário</h2>

            {carregando ? (
              <p className="text-gray-600">Carregando grupos...</p>
            ) : erro ? (
              <p className="text-red-600">{erro}</p>
            ) : (
              <div>
                <div className="overflow-y-auto max-h-[60vh] border border-gray-300 rounded">
                  <div className="mb-4 flex justify-between items-center">
                    <input
                      type="text"
                      placeholder="Filtrar por nome..."
                      value={filtroGrupos}
                      onChange={(e) => {
                        setFiltroGrupos(e.target.value);
                        setPaginaAtualGrupos(1);
                      }}
                      className="border px-3 py-1 rounded text-sm w-1/2"
                    />
                    <span className="text-sm text-gray-600">
                      {gruposFiltrados.length} permissões encontradas
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
                      {gruposPaginados.map((grupo) => (
                        <tr key={grupo.groupId} className="border-t">
                          <td className="p-2">{grupo.name}</td>
                          <td className="p-2 text-center">
                            <input
                              type="checkbox"
                              checked={grupo.permitted}
                              onChange={() => alterarGrupo(grupo.groupId)}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex justify-center items-center gap-6 mt-6 text-gray-700">
                  <button
                    onClick={() => setPaginaAtualGrupos((p) => Math.max(1, p - 1))}
                    disabled={paginaAtualGrupos === 1}
                    className="disabled:opacity-50 px-3 py-1 rounded border border-gray-300 hover:bg-gray-100"
                  >
                    &lt;
                  </button>
                  <div className="bg-sky-500 text-white rounded-full px-4 py-1 font-semibold">
                    {paginaAtualGrupos}
                  </div>
                  <button
                    onClick={() => setPaginaAtualGrupos((p) => Math.min(totalPaginas, p + 1))}
                    disabled={paginaAtualGrupos === totalPaginasGrupo}
                    className="disabled:opacity-50 px-3 py-1 rounded border border-gray-300 hover:bg-gray-100"
                  >
                    &gt;
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded shadow-[0_0_10px_rgba(0,0,0,0.15)] w-full  p-6 relative">
          <h2 className="text-xl font-bold mb-4">Permissões do Usuario</h2>

          {carregando ? (
            <p className="text-gray-600">Carregando permissões...</p>
          ) : erro ? (
            <p className="text-red-600">{erro}</p>
          ) : (
            <div>
              <div className="overflow-y-auto max-h-[60vh] border border-gray-300 rounded">
                <div className="mb-4 flex justify-between items-center">
                  <input
                    type="text"
                    placeholder="Filtrar por nome, path ou método..."
                    value={filtro}
                    onChange={(e) => {
                      setFiltro(e.target.value);
                      setPaginaAtual(1); // volta pra primeira página ao filtrar
                    }}
                    className="border px-3 py-1 rounded text-sm w-1/2"
                  />

                  <span className="text-sm text-gray-600">
                    {programasFiltrados.length} permissões encontradas
                  </span>
                </div>
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-2 text-left">Nome</th>
                      <th className="p-2 text-left">Path</th>
                      <th className="p-2 text-left">Método</th>
                      <th className="p-2 text-center">Permitir</th>
                    </tr>
                  </thead>
                  <tbody>
                    {programasPaginados.map((programa) => (
                      <tr key={programa.programId} className="border-t">
                        <td className="p-2">{programa.name}</td>
                        <td className="p-2">{programa.path}</td>
                        <td className="p-2">{programa.method}</td>
                        <td className="p-2 text-center">
                          <input
                            type="checkbox"
                            checked={programa.permitted}
                            onChange={() => alterarPermissao(programa.programId)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-center items-center gap-6 mt-6 text-gray-700">
                <button
                  onClick={() => setPaginaAtual((p) => Math.max(1, p - 1))}
                  disabled={paginaAtual === 1}
                  className="disabled:opacity-50 px-3 py-1 rounded border border-gray-300 hover:bg-gray-100"
                >
                  &lt;
                </button>
                <div className="bg-sky-500 text-white rounded-full px-4 py-1 font-semibold">
                  {paginaAtual}
                </div>
                <button
                  onClick={() => setPaginaAtual((p) => Math.min(totalPaginas, p + 1))}
                  disabled={paginaAtual === totalPaginas}
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
  );
};

