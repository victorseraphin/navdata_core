import { useState } from "react";
import { FiX } from "react-icons/fi"; // ícone X preto

export default function FormPagamentoFuncionarios({ onSalvar, onCancelar }) {
    const [descricao, setDescricao] = useState("");
    const [criterio, setCriterio] = useState("");
    const [valor, setValor] = useState("");

    const handleSalvar = () => {
        if (!descricao || !criterio || !valor) {
            alert("Preencha todos os campos.");
            return;
        }

        const novoRegistro = {
            id: Date.now(),
            descricao,
            criterio,
            valor: parseFloat(valor),
        };

        onSalvar(novoRegistro);
    };

    return (
        <div className="fixed inset-0 z-50 bg-white flex flex-col overflow-auto">
            {/* Barra superior preta */}
            <div className="flex items-center justify-between px-4 py-3 border-b shadow-sm sticky top-0 bg-black z-10 text-white">
                {/* Botão X com texto vermelho */}
                <button
                    onClick={onCancelar}
                    className="flex items-center gap-2 px-4 py-1.5 rounded-full hover:bg-gray-900"
                    aria-label="Fechar"
                >
                    <FiX className="text-white text-xl bg-black p-0.1 hover:bg-gray-900" />
                </button>

                {/* Título centralizado */}
                <h2 className="text-base font-semibold text-white">Pagamento de Funcionários</h2>

                {/* Botão Salvar com fundo preto (igual à barra) */}
                <button
                    onClick={handleSalvar}
                    className="text-sm font-medium bg-black text-white px-4 py-1.5 rounded-full hover:bg-gray-900"
                >
                    Salvar
                </button>
            </div>

            {/* Conteúdo do formulário */}
            <form onSubmit={(e) => e.preventDefault()} className="p-6 space-y-6 w-full mx-auto">
                {/* Linha: Descrição e Critério */}
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="w-full lg:w-2/4">
                    <label className="block text-sm font-medium text-gray-600 mb-1">Descrição</label>
                    <input
                        type="text"
                        value={descricao}
                        onChange={(e) => setDescricao(e.target.value)}
                        className="w-full border border-gray-300 px-3 py-1 rounded"
                        placeholder="Digite a descrição do bem"
                    />
                    </div>

                    <div className="w-full lg:w-1/4">
                    <label className="block text-sm font-medium text-gray-600 mb-1">Critério</label>
                    <input
                        type="text"
                        value={criterio}
                        onChange={(e) => setCriterio(e.target.value)}
                        className="w-full border border-gray-300 px-3 py-1 rounded"
                        placeholder="UN, KG, L, etc."
                    />
                    </div>

                    <div className="w-full md:w-1/4">
                    <label className="block text-sm font-medium text-gray-600 mb-1">Valor</label>
                    <input
                        type="number"
                        step="0.01"
                        value={valor}
                        onChange={(e) => setValor(e.target.value)}
                        className="w-full border border-gray-300 px-3 py-1 rounded"
                        placeholder="Ex: 199.90"
                    />
                    </div>
                </div>
            </form>
        </div>
    );
}
