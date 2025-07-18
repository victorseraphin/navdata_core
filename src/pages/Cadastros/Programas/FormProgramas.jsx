import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FiX } from "react-icons/fi";
import { useAuth } from '../../../hooks/AuthContext';
import axios from "../../../api/axiosAuth";
import API_URL from "../../../services/apiAuthUrl";

export default function FormProgramas({ onSalvar, onCancelar, registro }) {
    const { user } = useAuth();
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState(null);

    // Pegar lista de sistemas para popular o select
    //const listSystems = user?.systemUnit?.systems || [];

    const [listSystems, setListSystems] = useState([]);

    const careggarListSystems = async () => {
        setCarregando(true);
        setErro(null);

        try {

            const response = await axios.get(`${API_URL}/v1/systems`);

            const dadosConvertidos = response.data
                .filter((item) => !item.deletedAt)
                .map((item) => ({
                    id: item.id,
                    name: item.name,
                }));

            setListSystems(dadosConvertidos);
        } catch (err) {
            setErro(err.response?.data?.message || err.message || "Erro ao buscar sistemas");
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
            name: "",
            path: "",
            method: "",
            systemUnitId: registro?.systemUnitId || user.systemUnit.id,
            systemId: String(registro?.systemId || "")

        },
    });

    useEffect(() => {
        careggarListSystems();
    }, []);

    // Preenche o formulário em modo edição
    useEffect(() => {
        if (registro && listSystems.length > 0) {
            const id = typeof registro.systemId === "object" ? registro.systemId.id : registro.systemId;
            reset({ ...registro, systemId: String(id) });
        } else if (!registro && listSystems.length > 0) {
            reset();
        }
    }, [registro, listSystems, reset]);



    const onSubmit = (data) => {
        console.log(data);


        onSalvar({
            id: registro?.id || null,
            systemUnitId: registro?.systemUnitId || user.systemUnit.id,
            systemId: Number(data.systemId),
            // Você pode enviar o array de ids, ou fazer fetch dos objetos completos no backend

            ...data,
        });
    };

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
                    {registro ? "Editar Programa" : "Cadastrar Programa"}
                </h2>

                <button
                    onClick={handleSubmit(onSubmit)}
                    className="h-full px-6 flex items-center justify-center text-sm font-medium bg-sky-600 text-white hover:bg-sky-700"
                >
                    Salvar
                </button>
            </div>

            {/* Conteúdo do formulário */}
            <div className="flex-1 px-6 py-6 overflow-y-auto">
                <form className="w-full flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
                    <div className="flex flex-col lg:flex-row gap-4 w-full items-center justify-center">
                        <div className="w-full lg:w-2/3">
                            <label className="block text-sm font-medium text-gray-600 mb-1">Nome</label>
                            <input
                                type="text"
                                {...register("name", { required: "Nome obrigatório" })}
                                className="w-full border border-gray-300 px-3 py-1 rounded text-sm"
                                placeholder="Digite o nome"
                            />
                            {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
                        </div>
                        <div className="w-full lg:w-2/3">
                            <label className="block text-sm font-medium text-gray-600 mb-1">Path</label>
                            <input
                                type="text"
                                {...register("path", { required: "Path obrigatório" })}
                                className="w-full border border-gray-300 px-3 py-1 rounded text-sm"
                                placeholder="Digite o path"
                            />
                            {errors.path && <p className="text-sm text-red-500 mt-1">{errors.path.message}</p>}
                        </div>
                        <div className="w-full lg:w-2/3">
                            <label className="block text-sm font-medium text-gray-600 mb-1">Method</label>
                            <input
                                type="text"
                                {...register("method", { required: "Method obrigatório" })}
                                className="w-full border border-gray-300 px-3 py-1 rounded text-sm"
                                placeholder="Digite o method"
                            />
                            {errors.method && <p className="text-sm text-red-500 mt-1">{errors.method.message}</p>}
                        </div>

                        {/* Select múltiplo para systemId */}
                        <div className="w-full lg:w-2/3">
                            <label className="block text-sm font-medium text-gray-600 mb-1">Sistemas</label>
                            <select
                                {...register("systemId", { required: "Selecione ao menos um sistema" })}
                                className="w-full border border-gray-300 px-3 py-1 rounded text-sm "
                            >
                                <option value="">Selecione...</option>
                                {listSystems.map((sys) => (
                                    <option key={sys.id} value={sys.id.toString()}>
                                        {sys.name}
                                    </option>
                                ))}
                            </select>
                            {errors.systemId && <p className="text-sm text-red-500 mt-1">{errors.systemId.message}</p>}
                        </div>
                    </div>

                </form>
            </div>
        </div>
    );
}
