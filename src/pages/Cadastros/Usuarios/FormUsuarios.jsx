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

  const [listSystems, setListSystems] = useState([]);
  const [listUnits, setListUnits] = useState([]);
  const [listGroups, setListGroups] = useState([]);
  const [listPrograms, setListPrograms] = useState([]);

  const isAdmin = user?.id === 1;

  const carregarDados = async () => {
    setCarregando(true);
    setErro(null);
    try {
      const [systemsRes, groupsRes, programsRes, unitsRes] = await Promise.all([
        axios.get(`${API_URL}/v1/systems`),
        axios.get(`${API_URL}/v1/system_groups`),
        axios.get(`${API_URL}/v1/system_programs`),
        isAdmin ? axios.get(`${API_URL}/v1/system_units`) : Promise.resolve({ data: [] })
      ]);

      setListSystems(systemsRes.data.filter((s) => !s.deletedAt));
      setListGroups(groupsRes.data);
      setListPrograms(programsRes.data);
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
    if (registro && listSystems.length > 0) {
      reset({
        ...registro,
        systemId: String(registro.systemId?.id || registro.systemId || ""),
        //systemGroups: registro.systemGroups?.map((g) => g.id) || [],
        //systemPrograms: registro.systemPrograms?.map((p) => p.id) || [],
        systemUnitId: isAdmin ? registro.systemUnitId : user.systemUnitId,
      });
    }
  }, [registro, listSystems, listGroups, listPrograms, listUnits]);

  const onSubmit = (data) => {
    console.log(data);
    
    onSalvar({
      ...data,
      id: registro?.id || null,
      systemId: Number(data.systemId),
      systemUnitId: isAdmin ? Number(data.systemUnitId) : Number(user.systemUnitId),
      //systemGroups: data.systemGroups.map(Number),
      //systemPrograms: data.systemPrograms.map(Number),
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

            <div className="w-full lg:w-2/3">
              <label className="text-sm font-medium text-gray-600">Sistema</label>
              <select {...register("systemId", { required: "Sistema obrigatório" })} className="w-full border border-gray-300 px-3 py-1 rounded text-sm ">
                <option value="">Selecione...</option>
                {listSystems.map((sys) => (
                  <option key={sys.id} value={sys.id}>
                    {sys.name}
                  </option>
                ))}
              </select>
              {errors.systemId && <p className="text-red-500 text-sm">{errors.systemId.message}</p>}
            </div>
          </div>
          <div className="flex flex-col lg:flex-row gap-4 w-full items-center justify-center">

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

            <div className="flex items-center gap-4 mt-2">
              <label className="text-sm font-medium text-gray-600">Ativo</label>
              <input type="checkbox" {...register("active")} />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
