import { useState, useMemo, useEffect } from "react";
import FormEmpresas from "./FormEmpresas";
import axios from "../../../api/axiosAuth";
import API_URL from "../../../services/apiAuthUrl";


export default function EmpresasPage() {
    const [dados, setDados] = useState([]);
    const [filtroNome, setFiltroNome] = useState("");
    const [documento, setDocumento] = useState("");
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [carregando, setCarregando] = useState(false); // ← ADICIONE ESTA LINHA
    const [erro, setErro] = useState(null);

    const buscarDados = async () => {
        setCarregando(true);
        setErro(null);

        try {
            const params = {};
            if (filtroNome) params.name = filtroNome;

            const response = await axios.get(`${API_URL}/v1/system_units`, { params });

            const dadosConvertidos = response.data
                .filter((item) => !item.deletedAt)
                .map((item) => ({
                    id: item.id,
                    name: item.name,
                    documento: item.documento,
                    matricula: item.matricula,
                    localizacao: item.localizacao,
                    inscricao: item.inscricao,
                }));

            setDados(dadosConvertidos);
            setPaginaAtual(1);
        } catch (err) {
            setErro(err.response?.data?.message || err.message || "Erro ao buscar sistemas");
        } finally {
            setCarregando(false);
        }
    };



    const itensPorPagina = 10;

    // Filtra dados pela descrição e critério de alocação (se usar)
    const dadosFiltrados = useMemo(() => {
        return dados.filter((b) =>
            b.name.toLowerCase().includes(filtroNome.toLowerCase())
            // Aqui você pode incluir filtro pelo critérioAlocacao, se fizer sentido no seu domínio
        );
    }, [dados, filtroNome]);

    const totalPaginas = Math.ceil(dadosFiltrados.length / itensPorPagina);
    const dadosPaginaAtual = dadosFiltrados.slice(
        (paginaAtual - 1) * itensPorPagina,
        paginaAtual * itensPorPagina
    );

    // Checkbox handlers
    const toggleSelecionado = (id) => {
        setSelectedIds((prev) => {
            const novo = new Set(prev);
            if (novo.has(id)) novo.delete(id);
            else novo.add(id);
            return novo;
        });
    };

    const selecionarTodos = (e) => {
        if (e.target.checked) {
            setSelectedIds(new Set(dadosPaginaAtual.map((b) => b.id)));
        } else {
            setSelectedIds(new Set());
        }
    };

    // Botões ações (exemplo)
    const [exibindoFormulario, setExibindoFormulario] = useState(false);
    const [registroEditando, setRegistroEditando] = useState(null);

    const handleIncluir = () => {
        setRegistroEditando(null); // modo inclusão
        setExibindoFormulario(true);
    };

    const salvarFormulario = async (registro) => {
        setCarregando(true);
        setErro(null);

        try {
            if (registroEditando) {
                // PUT ou PATCH (edição)
                const response = await axios.put(`/v1/system_units/${registro.id}`, registro);
                buscarDados();
            } else {
                // POST (criação)
                const response = await axios.post(`/v1/system_units`, registro);
                buscarDados();
            }

            setExibindoFormulario(false);
            setRegistroEditando(null);
            setSelectedIds(new Set());
        } catch (err) {
            setErro(err.response?.data?.message || err.message || "Erro ao salvar o sistema");
        } finally {
            setCarregando(false);
        }
    };

    const cancelarModal = () => {
        setExibindoFormulario(false);
    };

    const handleEditar = () => {
        if (selectedIds.size !== 1) {
            alert("Selecione exatamente 1 item para editar");
            return;
        }

        const idParaEditar = [...selectedIds][0];
        const registroSelecionado = dados.find((b) => b.id === idParaEditar);

        setRegistroEditando(registroSelecionado); // envia o registro pro modal
        setExibindoFormulario(true);
    };

    const handleExcluir = async () => {
        if (selectedIds.size === 0) {
            alert("Selecione pelo menos 1 item para excluir");
            return;
        }

        if (!window.confirm(`Excluir ${selectedIds.size} item(s)?`)) return;

        setCarregando(true);
        setErro(null);

        try {
            // Convertendo o Set em Array
            const idsParaExcluir = Array.from(selectedIds);

            // Requisições DELETE em paralelo
            await Promise.all(
                idsParaExcluir.map((id) =>
                    axios.delete(`/v1/system_units/${id}`)
                )
            );

            // Remover localmente após sucesso
            setDados((prev) => prev.filter((b) => !selectedIds.has(b.id)));
            setSelectedIds(new Set());
        } catch (err) {
            console.error(err);
            setErro(err.response?.data?.message || err.message || "Erro ao excluir item(s)");
        } finally {
            setCarregando(false);
        }
    };

    useEffect(() => {
        buscarDados();
    }, []);

    return (
        <div className="p-4 px-8 max-w-full mx-auto">
            {/* Filtros */}
            <div className="mb-6 border border-gray-300 rounded bg-gray-50 p-4 shadow-sm">
                <h2 className="font-semibold text-xl mb-4 text-gray-700">Empresas</h2>

                {/* Cada input em sua linha */}
                <div className="flex flex-col gap-4 w-full">
                    {/* Linha 1 - Descrição (col-4) */}
                    <div className="w-full lg:w-1/3">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-600 mb-1">
                            Nome
                        </label>
                        <input
                            id="name"
                            type="text"
                            placeholder="Nome"
                            className="border border-gray-300 rounded px-3 py-0.5 focus:outline-none focus:ring-2 focus:ring-sky-400 w-full"
                            value={filtroNome}
                            onChange={(e) => setFiltroNome(e.target.value)}
                        />
                    </div>
                </div>


                {/* Botão alinhado à esquerda, abaixo dos inputs */}
                <div className="mt-6 flex justify-start">
                    <button
                        onClick={buscarDados}
                        className="bg-sky-500 text-white px-3 py-0.5 rounded hover:bg-sky-600 transition-shadow shadow-md"
                    >
                        Procurar
                    </button>
                </div>
            </div>


            {/* Ações */}
            <div className="mb-1 flex flex-wrap gap-2">
                <button
                    onClick={handleIncluir}
                    className="bg-gray-700 text-white px-3 py-0.5 rounded hover:bg-sky-500 transition"
                >
                    Incluir
                </button>
                <button
                    onClick={handleEditar}
                    disabled={selectedIds.size !== 1}
                    className="bg-gray-700 text-white px-3 py-0.5 rounded hover:bg-sky-500 transition disabled:opacity-50"
                >
                    Editar
                </button>
                <button
                    onClick={handleExcluir}
                    disabled={selectedIds.size === 0}
                    className="bg-gray-700 text-white px-3 py-0.5 rounded hover:bg-sky-500 transition disabled:opacity-50"
                >
                    Excluir
                </button>
            </div>

            {/* Tabela */}
            <div className="overflow-x-auto border border-gray-300 rounded shadow-sm">
                {carregando && (
                    <div className="text-center text-gray-600 my-4">Carregando dados...</div>
                )}
                {erro && (
                    <div className="text-center text-red-500 my-4">Erro: {erro}</div>
                )}
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-100 border-b border-gray-300">
                        <tr>
                            <th className="p-3 text-center w-12">
                                <input
                                    type="checkbox"
                                    checked={
                                        dadosPaginaAtual.length > 0 &&
                                        dadosPaginaAtual.every((b) => selectedIds.has(b.id))
                                    }
                                    onChange={selecionarTodos}
                                />
                            </th>
                            <th className="p-3 text-left font-semibold">Nome</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dadosPaginaAtual.length === 0 && (
                            <tr>
                                <td colSpan={4} className="p-6 text-center text-gray-500">
                                    Nenhum registro encontrado.
                                </td>
                            </tr>
                        )}

                        {dadosPaginaAtual.map(({ id, name, status }) => (
                            <tr

                                key={id}
                                onClick={() => toggleSelecionado(id)}
                                className={`border-b border-gray-200 ${selectedIds.has(id) ? "bg-sky-100" : ""
                                    }`}
                            >
                                <td className="p-3 text-center" onClick={(e) => e.stopPropagation()}>
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.has(id)}
                                        onChange={() => toggleSelecionado(id)}
                                    />
                                </td>
                                <td className="p-3">{name}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Paginação */}
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
            {exibindoFormulario && (
                <FormEmpresas
                    onSalvar={salvarFormulario}
                    onCancelar={cancelarModal}
                    registro={registroEditando} // ← importante
                />
            )}
        </div>
    );
}
