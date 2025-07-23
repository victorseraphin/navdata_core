import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FiX } from "react-icons/fi";
import { useAuth } from "../../../hooks/AuthContext";
import axios from "../../../api/axiosAuth";
import API_URL from "../../../services/apiAuthUrl";

export default function FormUsuarios({ onSalvar, onCancelar, registro }) {
  const { user } = useAuth();
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);

  const [listUnits, setListUnits] = useState([]);

  const isAdmin = user?.id === 1;

  const carregarDados = async () => {
    setCarregando(true);
    setErro(null);
    try {
      const [unitsRes] = await Promise.all([
        isAdmin ? axios.get(`${API_URL}/v1/system_units`) : Promise.resolve({ data: [] })
      ]);
      if (isAdmin) setListUnits(unitsRes.data);
    } catch (err) {
      setErro(err.response?.data?.message || err.message || "Erro ao carregar dados.");
    } finally {
      setCarregando(false);
    }
  };


  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: registro?.name || "",
      email: registro?.email || "",
      password: registro?.password || "",
      doc: registro?.doc || "",
      fone: registro?.fone || "",
      isMaster: registro?.isMaster || false,
      active: registro?.active || true,
      systemUnitId: registro?.systemUnitId || user.systemUnitId,
      systemId: registro?.systemId || "",
    },
  });

  useEffect(() => {
    carregarDados();
  }, []);

  useEffect(() => {
    if (registro && listUnits.length > 0) {
      reset({
        ...registro,
        systemUnitId: isAdmin ? registro.systemUnitId : user.systemUnitId,
      });
    }
  }, [registro, listUnits]);

  const onSubmit = (data) => {
    console.log(data);

    onSalvar({
      ...data,
      id: registro?.id || null,
      systemUnitId: isAdmin ? Number(data.systemUnitId) : Number(user.systemUnitId),
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col overflow-auto">
      {carregando && <div className="text-center my-4 text-gray-600">Carregando dados...</div>}
      {erro && <div className="text-center my-4 text-red-500">Erro: {erro}</div>}

      {/* Header */}
      <div className="flex items-center justify-between h-14 border-b shadow-sm sticky top-0 bg-sky-600 z-10 text-white">
        <button onClick={onCancelar} className="h-full aspect-square flex items-center justify-center hover:bg-sky-700">
          <FiX className="text-red-500 text-2xl" />
        </button>
        <h2 className="text-base font-semibold">{registro ? "Editar Usuário" : "Cadastrar Usuário"}</h2>
        <button
          onClick={handleSubmit(onSubmit)}
          className="h-full px-6 flex items-center justify-center text-sm font-medium bg-sky-600 hover:bg-sky-700"
        >
          Salvar
        </button>
      </div>

      {/* Formulário */}
      <div className="flex-1 px-6 py-6 overflow-y-auto">
        <form className="w-full flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
          <div className="flex flex-col lg:flex-row gap-4 w-full items-center justify-center">
            <div className="w-full lg:w-2/3">
              <label className="block text-sm font-medium text-gray-600 mb-1">Nome</label>
              <input {...register("name", { required: "Nome obrigatório" })} className="w-full border border-gray-300 px-3 py-1 rounded text-sm" />
              {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
            </div>

            <div className="w-full lg:w-2/3">
              <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
              <input type="email" {...register("email")} className="w-full border border-gray-300 px-3 py-1 rounded text-sm" />
            </div>
          </div>
          <div className="flex flex-col lg:flex-row gap-4 w-full items-center justify-center">
            <div className="w-full lg:w-2/3">
              <label className="block text-sm font-medium text-gray-600 mb-1">Senha</label>
              <input type="password" {...register("password")} className="w-full border border-gray-300 px-3 py-1 rounded text-sm" />
            </div>
            <div className="w-full lg:w-2/3">
              <label className="block text-sm font-medium text-gray-600 mb-1">Documento</label>
              <input {...register("doc")} className="w-full border border-gray-300 px-3 py-1 rounded text-sm" />
            </div>

            <div className="w-full lg:w-2/3">
              <label className="block text-sm font-medium text-gray-600 mb-1">Telefone</label>
              <input {...register("fone")} className="w-full border border-gray-300 px-3 py-1 rounded text-sm" />
            </div>

          </div>
          <div className="flex flex-col lg:flex-row gap-4 w-full items-center justify-center">


            {isAdmin && (
              <div className="w-full lg:w-2/3">
                <label className="text-sm font-medium text-gray-600">Unidade</label>
                <select {...register("systemUnitId")} className="w-full border border-gray-300 px-3 py-1 rounded text-sm ">
                  <option value="">Selecione...</option>
                  {listUnits.map((unit) => (
                    <option key={unit.id} value={unit.id}>
                      {unit.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
          <div className="flex flex-col lg:flex-row gap-4 w-full items-center justify-center">

            <div className="flex items-center gap-4 mt-2">
              <label className="text-sm font-medium text-gray-600">Ativo</label>
              <input type="checkbox" {...register("active")} />
            </div>
          </div>
        </form>
        <div className="flex flex-col lg:flex-row gap-6 w-full my-6 ">
          {/* Tabela Sistemas */}
          <div className="bg-white rounded shadow-[0_0_10px_rgba(0,0,0,0.15)] w-full lg:w-1/2 p-6 relative ">
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
                      value={filtro}
                      onChange={(e) => {
                        setFiltro(e.target.value);
                        setPaginaAtual(1);
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
                        <th className="p-2 text-center">Permitir</th>
                      </tr>
                    </thead>
                    <tbody>
                      {programasPaginados.map((programa) => (
                        <tr key={programa.programId} className="border-t">
                          <td className="p-2">{programa.name}</td>
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
    </div>
  );
}
