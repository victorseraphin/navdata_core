import { useState, useMemo } from "react";
import FormProdutos from "./FormProdutos";

const dadosIniciais = [
    { id: 1, descricao: "BOMBA FILTRO INTERNO JP-023F", criterio: "UN", valor: 95.0 },
    { id: 2, descricao: "BOMBA SUBMERSA 2500 L/H", criterio: "UN", valor: 239.0 },
    { id: 3, descricao: "CERCA ARAME FARPADO", criterio: "UN", valor: 10000.0 },
    { id: 4, descricao: "CHOCADERA ELÉTRICA", criterio: "UN", valor: 660.0 },
    { id: 5, descricao: "LAMPADA DE AQUECIMENTO", criterio: "UN", valor: 220.0 },
    { id: 6, descricao: "MANGUEIRO (CURRAL)", criterio: "UN", valor: 12000.0 },
    { id: 7, descricao: "PISCINA CIRCULAR INFLAVEL 2.400 LITROS", criterio: "UN", valor: 315.0 },
];

export default function ProdutosPage() {
    const [dados, setBens] = useState(dadosIniciais);
    const [filtroDescricao, setFiltroDescricao] = useState("");
    const [criterioAlocacao, setCriterioAlocacao] = useState("");
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [paginaAtual, setPaginaAtual] = useState(1);

    const itensPorPagina = 5;

    // Filtra dados pela descrição e critério de alocação (se usar)
    const dadosFiltrados = useMemo(() => {
        return dados.filter((b) =>
            b.descricao.toLowerCase().includes(filtroDescricao.toLowerCase())
            // Aqui você pode incluir filtro pelo critérioAlocacao, se fizer sentido no seu domínio
        );
    }, [dados, filtroDescricao]);

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

    const handleIncluir = () => {
        setExibindoFormulario(true);
    };

    const salvarFormulario = (novoBem) => {
        setBens((prev) => [...prev, novoBem]);
        setExibindoFormulario(false);
    };

    const cancelarModal = () => {
        setExibindoFormulario(false);
    };

    const handleEditar = () => {
        if (selectedIds.size !== 1) {
            alert("Selecione exatamente 1 item para editar");
            return;
        }
        alert("Editar item id: " + [...selectedIds][0]);
    };
    const handleExcluir = () => {
        if (selectedIds.size === 0) {
            alert("Selecione pelo menos 1 item para excluir");
            return;
        }
        if (window.confirm(`Excluir ${selectedIds.size} item(s)?`)) {
            setBens((prev) => prev.filter((b) => !selectedIds.has(b.id)));
            setSelectedIds(new Set());
        }
    };
    const handleRateio = () => alert("Rateio clicado");
    const handleDepreciacao = () => alert("Depreciação clicada");

    return (
        <div className="p-4 px-8 max-w-full mx-auto">
            {/* Filtros */}
            <div className="mb-6 border border-gray-300 rounded bg-gray-50 p-4 shadow-sm">
                <h2 className="font-semibold text-xl mb-4 text-gray-700">Saída de Produtos</h2>

                {/* Cada input em sua linha */}
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col">
                        <label htmlFor="descricao" className="mb-1 font-medium text-sm text-gray-600">
                            Descrição
                        </label>
                        <input
                            id="descricao"
                            type="text"
                            placeholder="Descrição"
                            className="border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-400 w-full md:min-w-[300px] "
                            value={filtroDescricao}
                            onChange={(e) => setFiltroDescricao(e.target.value)}
                            />
                    </div>
                </div>

                {/* Botão alinhado à esquerda, abaixo dos inputs */}
                <div className="mt-6 flex justify-start">
                    <button
                        onClick={() => setPaginaAtual(1)}
                        className="bg-emerald-500 text-white px-4 py-1 rounded hover:bg-emerald-600 transition-shadow shadow-md"
                    >
                        Procurar
                    </button>
                </div>
            </div>


            {/* Ações */}
            <div className="mb-1 flex flex-wrap gap-2">
                <button
                    onClick={handleIncluir}
                    className="bg-gray-700 text-white px-4 py-1 rounded hover:bg-gray-800 transition"
                >
                    Incluir
                </button>
                <button
                    onClick={handleEditar}
                    disabled={selectedIds.size !== 1}
                    className="bg-gray-400 text-gray-700 px-4 py-1 rounded disabled:opacity-50"
                >
                    Editar
                </button>
                <button
                    onClick={handleExcluir}
                    disabled={selectedIds.size === 0}
                    className="bg-gray-400 text-gray-700 px-4 py-1 rounded disabled:opacity-50"
                >
                    Excluir
                </button>
                <button
                    onClick={handleRateio}
                    disabled={selectedIds.size === 0}
                    className="bg-gray-400 text-gray-700 px-4 py-1 rounded disabled:opacity-50"
                >
                    Rateio
                </button>
                <button
                    onClick={handleDepreciacao}
                    disabled={selectedIds.size === 0}
                    className="bg-gray-400 text-gray-700 px-4 py-1 rounded disabled:opacity-50"
                >
                    Depreciação
                </button>
            </div>

            {/* Tabela */}
            <div className="overflow-x-auto border border-gray-300 rounded shadow-sm">
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
                            <th className="p-3 text-left font-semibold">Descrição</th>
                            <th className="p-3 text-left font-semibold">Critério</th>
                            <th className="p-3 text-left font-semibold">Valor</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dadosPaginaAtual.length === 0 && (
                            <tr>
                                <td colSpan={4} className="p-6 text-center text-gray-500">
                                    Nenhum bem encontrado.
                                </td>
                            </tr>
                        )}

                        {dadosPaginaAtual.map(({ id, descricao, criterio, valor }) => (
                            <tr
                                key={id}
                                className={`border-b border-gray-200 ${selectedIds.has(id) ? "bg-emerald-100" : ""
                                    }`}
                            >
                                <td className="p-3 text-center">
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.has(id)}
                                        onChange={() => toggleSelecionado(id)}
                                    />
                                </td>
                                <td className="p-3">{descricao}</td>
                                <td className="p-3">{criterio}</td>
                                <td className="p-3">
                                    {valor.toLocaleString("pt-BR", {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}
                                </td>
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
                <div className="bg-emerald-500 text-white rounded-full px-4 py-1 font-semibold">
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
                <FormProdutos onSalvar={salvarFormulario} onCancelar={cancelarModal} />
            )}
        </div>
    );
}
