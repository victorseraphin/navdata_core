import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { FiX } from "react-icons/fi";
import { useAuth } from '../../../hooks/AuthContext';

export default function FormProgramas({ onSalvar, onCancelar, registro }) {
    const { user } = useAuth();

    // Pegar lista de sistemas para popular o select
    const availableSystems = user?.systemUnit?.systems || [];

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
            systemUnit: registro?.systemUnit || user.systemUnit,
            systemId: registro?.systemId || ""

        },
    });

    // Preenche o formulário em modo edição
    useEffect(() => {
        if (registro) {
            console.log(registro);
            
            Object.entries(registro).forEach(([chave, valor]) => {
                // Se for systems, setar os ids como string array
                if (chave === "systems" && Array.isArray(valor)) {
                    setValue(
                        chave,
                        valor.map(s => s.id.toString())
                    );
                } else {
                    setValue(chave, valor);
                }
            });
        } else {
            reset();
        }
    }, [registro, setValue, reset]);

    const onSubmit = (data) => {

        onSalvar({
            id: registro?.id || null,
            systemUnit: registro?.systemUnit || user.systemUnit,
            // Você pode enviar o array de ids, ou fazer fetch dos objetos completos no backend
          
            ...data,
        });
    };

    return (
        <div className="fixed inset-0 z-50 bg-white flex flex-col overflow-auto">
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
                    </div>

                    {/* Select múltiplo para systemId */}
                    <div className="w-full lg:w-2/3 mt-4">
                        <label className="block text-sm font-medium text-gray-600 mb-1">Sistemas</label>
                        <select                            
                            {...register("systemId", { required: "Selecione ao menos um sistema" })}
                            className="w-full border border-gray-300 px-3 py-1 rounded text-sm "
                        >
                            <option value="">Selecione...</option>
                            {availableSystems.map((sys) => (
                                <option key={sys.id} value={sys.id.toString()}>
                                    {sys.name}
                                </option>
                            ))}
                        </select>
                        {errors.systemId && <p className="text-sm text-red-500 mt-1">{errors.systemId.message}</p>}
                    </div>

                </form>
            </div>
        </div>
    );
}
