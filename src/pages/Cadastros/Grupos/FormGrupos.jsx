import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { FiX } from "react-icons/fi";

export default function FormSistemas({ onSalvar, onCancelar, registro }) {
    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            nome: "",
        },
    });

    // Preenche o formulário em modo edição
    useEffect(() => {
        if (registro) {
            Object.entries(registro).forEach(([chave, valor]) => {
                setValue(chave, valor);
            });
        } else {
            reset();
        }
    }, [registro, setValue, reset]);

    const onSubmit = (data) => {
        onSalvar({
            id: registro?.id || Date.now(),
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
                    {registro ? "Editar Grupo" : "Cadastrar Grupo"}
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
                                {...register("nome", { required: "Nome obrigatório" })}
                                className="w-full border border-gray-300 px-3 py-1 rounded text-sm"
                                placeholder="Digite o nome"
                            />
                            {errors.nome && <p className="text-sm text-red-500 mt-1">{errors.nome.message}</p>}
                        </div>
                    </div>
                    
                </form>
            </div>
        </div>
    );
}