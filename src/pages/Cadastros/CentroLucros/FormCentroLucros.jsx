import { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";

export default function FormCentroLucros({ onSalvar, onCancelar, registro }) {
  const [descricao, setDescricao] = useState("");
  const [criterio, setCriterio] = useState("");
  const [valor, setValor] = useState("");

  // Preenche os campos se estiver em modo de edição
  useEffect(() => {
    if (registro) {
      setDescricao(registro.descricao || "");
      setCriterio(registro.criterio || "");
      setValor(registro.valor?.toString() || "");
    }
  }, [registro]);

  const handleSalvar = () => {
    if (!descricao || !criterio || !valor) {
      alert("Preencha todos os campos.");
      return;
    }

    const novoRegistro = {
      id: registro?.id || Date.now(), // se está editando, mantém o ID
      descricao,
      criterio,
      valor: parseFloat(valor),
    };

    onSalvar(novoRegistro);
  };

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col overflow-auto">
      {/* Barra superior */}
      <div className="flex items-center justify-between px-4 py-3 border-b shadow-sm sticky top-0 bg-lime-900 z-10 text-white">
        <button
          onClick={onCancelar}
          className="flex items-center gap-2 px-4 py-1.5 rounded-full hover:bg-lime-950"
          aria-label="Fechar"
        >
          <FiX className="text-red-500 text-xl bg-red rounded-full p-0.5" />
        </button>

        <h2 className="text-base font-semibold text-white">
          {registro ? "Editar Centro de Lucro" : "Novo Centro de Lucro"}
        </h2>

        <button
          onClick={handleSalvar}
          className="text-sm font-medium bg-lime-900 text-white px-4 py-1.5 rounded-full hover:bg-lime-950"
        >
          Salvar
        </button>
      </div>

      {/* Conteúdo do formulário */}
      <div className="flex-1 px-6 py-6 overflow-y-auto">
        <form onSubmit={(e) => e.preventDefault()} className="w-full flex flex-col gap-6">
          {/* Linha: Descrição e Critério */}
          <div className="flex flex-col lg:flex-row gap-4 w-full">
            <div className="w-full lg:w-2/3">
              <label className="block text-sm font-medium text-gray-600 mb-1">Descrição</label>
              <input
                type="text"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                className="w-full border border-gray-300 px-3 py-1 rounded text-sm"
                placeholder="Digite a descrição do registro"
              />
            </div>

            <div className="w-full lg:w-1/3">
              <label className="block text-sm font-medium text-gray-600 mb-1">Critério</label>
              <input
                type="text"
                value={criterio}
                onChange={(e) => setCriterio(e.target.value)}
                className="w-full border border-gray-300 px-3 py-1 rounded text-sm"
                placeholder="UN, KG, L, etc."
              />
            </div>
          </div>

          {/* Linha: Valor */}
          <div className="flex flex-col md:flex-row gap-4 w-full">
            <div className="w-full md:w-1/3">
              <label className="block text-sm font-medium text-gray-600 mb-1">Valor</label>
              <input
                type="number"
                step="0.01"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                className="w-full border border-gray-300 px-3 py-1 rounded text-sm"
                placeholder="Ex: 199.90"
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
