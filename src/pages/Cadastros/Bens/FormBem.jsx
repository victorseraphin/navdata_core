import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { FiX } from "react-icons/fi";

export default function FormBem({ onSalvar, onCancelar, registro }) {
    const {
        register,
        handleSubmit,
        setValue,
        reset,
        watch,
        formState: { errors },
    } = useForm({
        defaultValues: {
            descricao: "",
            criterio: "",
            dataInicial: "",
            centro_custo: "",
            valor_novo: "",
            valor_sucata: "",
            vida_util: "",
            depreciacao_anual: "",
            depreciacao_mensal: "",
            km_atual: ""
        },
    });

    const criterioSelecionado = watch("criterio");
    const valorNovo = watch("valor_novo");
    const valorSucata = watch("valor_sucata");
    const vidaUtil = watch("vida_util");

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

    // Atualiza depreciação automaticamente
    useEffect(() => {
        const novo = parseFloat(valorNovo);
        const sucata = parseFloat(valorSucata);
        const vida = parseFloat(vidaUtil);

        if (!isNaN(novo) && !isNaN(sucata) && !isNaN(vida) && vida > 0) {
            const depreciacaoAnual = (novo - sucata) / vida;
            const depreciacaoMensal = criterioSelecionado === "UN"
                ? depreciacaoAnual / 12
                : (novo - sucata) / vida;

            if (criterioSelecionado === "UN") {
                setValue("depreciacao_anual", depreciacaoAnual.toFixed(2));
            } else {
                setValue("depreciacao_anual", "");
            }

            setValue("depreciacao_mensal", depreciacaoMensal.toFixed(2));
        } else {
            setValue("depreciacao_anual", "");
            setValue("depreciacao_mensal", "");
        }
    }, [valorNovo, valorSucata, vidaUtil, criterioSelecionado, setValue]);

    const onSubmit = (data) => {
        onSalvar({
            id: registro?.id || Date.now(),
            ...data,
            valor_novo: parseFloat(data.valor_novo),
            valor_sucata: parseFloat(data.valor_sucata),
            vida_util: parseFloat(data.vida_util),
            depreciacao_anual: parseFloat(data.depreciacao_anual),
            depreciacao_mensal: parseFloat(data.depreciacao_mensal),
            km_atual: parseFloat(data.km_atual || 0),
        });
    };

    return (
        <div className="fixed inset-0 z-50 bg-white flex flex-col overflow-auto">
            {/* Barra superior */}
            <div className="flex items-center justify-between h-14 border-b shadow-sm sticky top-0 bg-emerald-600 z-10 text-white">
                <button
                    onClick={onCancelar}
                    className="h-full aspect-square flex items-center justify-center hover:bg-emerald-700"
                    aria-label="Fechar"
                >
                    <FiX className="text-red-500 text-2xl" />
                </button>

                <h2 className="text-base font-semibold text-white">
                    {registro ? "Editar Bens" : "Cadastrar Bens"}
                </h2>

                <button
                    onClick={handleSubmit(onSubmit)}
                    className="h-full px-6 flex items-center justify-center text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700"
                >
                    Salvar
                </button>
            </div>

            {/* Conteúdo do formulário */}
            <div className="flex-1 px-6 py-6 overflow-y-auto">
                <form className="w-full flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
                    {/* Linha: Descrição e Critério */}
                    <div className="flex flex-col lg:flex-row gap-4 w-full">
                        <div className="w-full lg:w-2/4">
                            <label className="block text-sm font-medium text-gray-600 mb-1">Descrição</label>
                            <input
                                type="text"
                                {...register("descricao", { required: "Descrição obrigatória" })}
                                className="w-full border border-gray-300 px-3 py-1 rounded text-sm"
                                placeholder="Digite a descrição"
                            />
                            {errors.descricao && <p className="text-sm text-red-500 mt-1">{errors.descricao.message}</p>}
                        </div>

                        <div className="w-full lg:w-1/4">
                            <label className="block text-sm font-medium text-gray-600 mb-1">Critério</label>
                            <select
                                {...register("criterio", { required: "Critério obrigatório" })}
                                className="w-full border border-gray-300 px-3 py-1 rounded text-sm bg-white"
                            >
                                <option value="">Selecione...</option>
                                <option value="UN">UN - (FIXO)</option>
                                <option value="KM">KM</option>
                                <option value="HR">HR</option>
                            </select>
                            {errors.criterio && <p className="text-sm text-red-500 mt-1">{errors.criterio.message}</p>}
                        </div>

                        <div className="w-full md:w-1/4">
                            <label className="block text-sm font-medium text-gray-600 mb-1">Data Inicial</label>
                            <input
                                type="date"
                                {...register("dataInicial", { required: "Data Inicial obrigatória" })}
                                className="w-full border border-gray-300 px-3 py-1 rounded text-sm"
                            />
                            {errors.dataInicial && <p className="text-sm text-red-500 mt-1">{errors.dataInicial.message}</p>}
                        </div>

                        <div className="w-full lg:w-1/4">
                            <label className="block text-sm font-medium text-gray-600 mb-1">Centro de Custo</label>
                            <input
                                type="text"
                                {...register("centro_custo", { required: "Centro de custo obrigatório" })}
                                className="w-full border border-gray-300 px-3 py-1 rounded text-sm"
                            />
                            {errors.centro_custo && <p className="text-sm text-red-500 mt-1">{errors.centro_custo.message}</p>}
                        </div>
                    </div>

                    {/* Linha: Valores */}
                    <div className="flex flex-col md:flex-row gap-4 w-full">
                        <div className="w-full md:w-1/3">
                            <label className="block text-sm font-medium text-gray-600 mb-1">Valor novo</label>
                            <input
                                type="number"
                                step="0.01"
                                {...register("valor_novo", {
                                    required: "Valor novo obrigatório",
                                    min: { value: 0.01, message: "Valor deve ser maior que zero" },
                                })}
                                className="w-full border border-gray-300 px-3 py-1 rounded text-sm"
                            />
                            {errors.valor_novo && <p className="text-sm text-red-500 mt-1">{errors.valor_novo.message}</p>}
                        </div>

                        <div className="w-full md:w-1/3">
                            <label className="block text-sm font-medium text-gray-600 mb-1">Valor Sucata</label>
                            <input
                                type="number"
                                step="0.01"
                                {...register("valor_sucata", {
                                    required: "Valor sucata obrigatório",
                                    min: { value: 0.01, message: "Valor deve ser maior que zero" },
                                })}
                                className="w-full border border-gray-300 px-3 py-1 rounded text-sm"
                            />
                            {errors.valor_sucata && <p className="text-sm text-red-500 mt-1">{errors.valor_sucata.message}</p>}
                        </div>
                    </div>

                    {/* Campos condicionais */}
                    {criterioSelecionado && (
                        <div className="flex flex-col md:flex-row gap-4 w-full">
                            <div className="w-full md:w-1/4">
                                <label className="block text-sm font-medium text-gray-600 mb-1">
                                    Vida útil ({criterioSelecionado === 'UN' ? 'em anos' : criterioSelecionado === 'KM' ? 'em quilômetros' : 'em horas'})
                                </label>
                                <input
                                    type="number"
                                    step="1"
                                    {...register("vida_util", {
                                        required: "Vida útil obrigatória",
                                        min: { value: 1, message: "Deve ser maior que 0" }
                                    })}
                                    className="w-full border border-gray-300 px-3 py-1 rounded text-sm"
                                />
                                {errors.vida_util && <p className="text-sm text-red-500 mt-1">{errors.vida_util.message}</p>}
                            </div>

                            {criterioSelecionado === 'UN' && (
                                <div className="w-full md:w-1/4">
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Depreciação anual</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        {...register("depreciacao_anual")}
                                        className="w-full border border-gray-300 px-3 py-1 rounded text-sm"
                                        readOnly
                                    />
                                </div>
                            )}

                            {criterioSelecionado && (
                                <div className="w-full md:w-1/4">
                                    <label className="block text-sm font-medium text-gray-600 mb-1">
                                        {criterioSelecionado === 'UN' ? 'Depreciação mensal' : criterioSelecionado === 'KM' ? 'Depreciação por km' : 'Depreciação por hora'}
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        {...register("depreciacao_mensal")}
                                        className="w-full border border-gray-300 px-3 py-1 rounded text-sm"
                                        readOnly
                                    />
                                </div>
                            )}

                            {criterioSelecionado === 'KM' && (
                                <div className="w-full md:w-1/4">
                                    <label className="block text-sm font-medium text-gray-600 mb-1">KM atual</label>
                                    <input
                                        type="number"
                                        step="1"
                                        {...register("km_atual")}
                                        className="w-full border border-gray-300 px-3 py-1 rounded text-sm"
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}