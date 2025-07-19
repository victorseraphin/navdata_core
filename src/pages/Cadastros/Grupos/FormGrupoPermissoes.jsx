import React, { useEffect, useState } from "react";
import axios from "../../../api/axiosAuth";
import API_URL from "../../../services/apiAuthUrl";

const FormGrupoPermissoes = ({ registro, onSalvar, onCancelar }) => {
  const [programas, setProgramas] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    if (!registro) return;

    const carregarPermissoes = async () => {
      setCarregando(true);
      setErro(null);

      try {
        const response = await axios.get(
          `${API_URL}/v1/system_groups/${registro.id}/permissions`
        );
        setProgramas(response.data);
      } catch (err) {
        setErro("Erro ao carregar permissões: " + (err.response?.data?.message || err.message));
      } finally {
        setCarregando(false);
      }
    };

    carregarPermissoes();
  }, [registro]);

  const alterarPermissao = (programId) => {
    setProgramas((prev) =>
      prev.map((p) =>
        p.programId === programId ? { ...p, permitted: !p.permitted } : p
      )
    );
  };

  const salvar = async () => {
    const payload = programas.map((p) => (console.log(p),{
        
        
      programId: p.programId,
      permitted: p.permitted,
    }));

    try {
      await axios.put(
        `${API_URL}/v1/system_groups/${registro.id}/permissions`,
        payload
      );
      onSalvar?.(); // notifica a página principal
    } catch (err) {
      setErro("Erro ao salvar permissões: " + (err.response?.data?.message || err.message));
    }
  };

  if (!registro) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow-lg max-w-2xl w-full p-6 relative">
        <h2 className="text-xl font-bold mb-4">Permissões do Grupo: {registro.name}</h2>

        {carregando ? (
          <p className="text-gray-600">Carregando permissões...</p>
        ) : erro ? (
          <p className="text-red-600">{erro}</p>
        ) : (
          <div className="overflow-y-auto max-h-[60vh] border border-gray-300 rounded">
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
                {programas.map((programa) => (
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
        )}

        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={onCancelar}
            className="px-4 py-1 rounded bg-gray-400 text-white hover:bg-gray-500"
          >
            Cancelar
          </button>
          <button
            onClick={salvar}
            className="px-4 py-1 rounded bg-sky-600 text-white hover:bg-sky-700"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormGrupoPermissoes;
