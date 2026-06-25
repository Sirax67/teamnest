"use client"

import { useMutation, useQuery } from "@tanstack/react-query"
import { StartupsSchema, stageEnum} from "../../lib/schemas/startups"
import { api } from "@/src/app/lib/client/api"
import z from "zod/v4"
import { useForm } from "@tanstack/react-form"
import { queryClient } from "../../lib/client/query-client"
import { useState } from "react"



export function StartupForm () {
    const [logoFile, setLogoFile] = useState<File | null>(null);

    const createStartupMutatiom = useMutation({
            mutationKey: ["create-startups"],
            mutationFn: async (data: z.infer<typeof StartupsSchema>) => {
                await api.startups.post(data);
            },
            onSuccess: () => {
                alert("Стартап создан");
                queryClient.invalidateQueries({
                    queryKey: ["startups"],
                });
            },
            onError: (e) => {
                alert(`Ошибка ${e.message}`)
            }
    });

    const startupForm = useForm({
        defaultValues: { } as z.infer<typeof StartupsSchema>,
        onSubmit: async ({ value }) => {
            let logo = value.logo;

            if (logoFile) {
                const uploaded = await api.files.post({ file: logoFile });
                logo = uploaded.data as string;
            }

            createStartupMutatiom.mutate({ ...value, logo });
        },
        validators: {
            onSubmit: StartupsSchema,
        },
    });

    const { data: sectors } = useQuery({
        queryKey: ["sectors"],
        queryFn: async () => {
            return (await api.sectors.get()).data;
        },
    })

   

    return(
        <form 
            className="flex flex-col w-80 gap-4 bg-gray-200 border border-gray-200 rounded-xl py-2 px-4 outline-gray-300 text-center text-gray-500"
            onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                startupForm.handleSubmit(e);
            }}
        >
            <div className="flex flex-col gap-2">
                <input
                    type="file"
                    accept="image/*"
                    className="bg-gray-100 border border-gray-300 rounded-xl py-2 px-4 outline-gray-300 text-center"
                    onChange={(e) => setLogoFile(e.target.files?.[0] ?? null)}
                />
            </div>

            <startupForm.Field name="name">
                {(field) => (
                    <div className="flex flex-col gap-2">
                        <input 
                            className="bg-gray-100 border border-gray-300 rounded-xl py-2 px-4 outline-gray-300 text-center"
                            value={field.state.value}
                            placeholder="Введите название стартапа"
                            onChange={(e) => field.handleChange(e.target.value)}
                        />
                        {field.state.meta.errors.map((er) => (
                            <p key={er?.message} className="text-red-700 ">
                                {er?.message}
                            </p>
                        ))}
                    </div>
                )}
            </startupForm.Field>

            <startupForm.Field name="description">
                {(field) => (
                    <div className="flex flex-col gap-2">
                        <input 
                            className="bg-gray-100 border border-gray-300 rounded-xl py-2 px-4 outline-gray-300 text-center"
                            value={field.state.value}
                            placeholder="Введите описание стартапа"
                            onChange={(e) => field.handleChange(e.target.value)}
                        />
                        {field.state.meta.errors.map((er) => (
                            <p key={er?.message} className="text-red-700 ">
                                {er?.message}
                            </p>
                        ))}
                    </div>
                )}
            </startupForm.Field>

            <startupForm.Field name="link">
                {(field) => (
                    <div className="flex flex-col gap-2">
                        <input 
                            className="bg-gray-100 border border-gray-300 rounded-xl py-2 px-4 outline-gray-300 text-center"
                            value={field.state.value}
                            placeholder="Введите ссылку на стартап"
                            onChange={(e) => field.handleChange(e.target.value)}
                        />
                        {field.state.meta.errors.map((er) => (
                            <p key={er?.message} className="text-red-700 ">
                                {er?.message}
                            </p>
                        ))}
                    </div>
                )}
            </startupForm.Field>

            <startupForm.Field name="sectorId">
                {(field) => (
                    <div className="flex flex-col gap-2">
                        <select 
                            onChange={(e) => field.handleChange(e.target.value)}
                            className="bg-gray-100 border border-gray-300 rounded-xl py-2 px-4 outline-gray-300 text-center text-gray-500 h-11"    
                        >
                            {sectors?.map((sec) => (
                            
                                <option key={sec.id} value={sec.id}
                                    className="rounded-2xl"
                                >
                                    {sec.name}
                                </option>
                            ))}
                        </select>
                        {field.state.meta.errors.map((er) => (
                            <p key={er?.message} className="text-red-700 ">
                                {er?.message}
                            </p>
                        ))}
                    </div>
                )}
            </startupForm.Field>

            <startupForm.Field name="stage">
                {(field) => (
                    <div className="flex flex-col gap-2">
                        <select 
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value as "Идея" | "Разработка" | "Запуск")}
                            className="bg-gray-100 border border-gray-300 rounded-xl py-2 px-4 outline-gray-300 text-center text-gray-500 h-11"    
                        >
                            {stageEnum.options.map((stage) => (
                                <option key={stage} value={stage}>
                                    {stage}
                                </option>
                            ))}
                        </select>
                        {field.state.meta.errors.map((er) => (
                            <p key={er?.message} className="text-red-700 ">
                                {er?.message}
                            </p>
                        ))}
                    </div>
                )}
            </startupForm.Field>

            <startupForm.Field name="startDate">
                {(field) => (
                    <div className="flex flex-col gap-2">
                        <input 
                            type="date"
                            className="bg-gray-100 border border-gray-300 rounded-xl py-2 px-4 outline-gray-300 text-center"
                            value={field.state.value}
                            placeholder="Введите дату старта стартапа"
                            onChange={(e) => field.handleChange(e.target.value)}
                        />
                        {field.state.meta.errors.map((er) => (
                            <p key={er?.message} className="text-red-700 ">
                                {er?.message}
                            </p>
                        ))}
                    </div>
                )}
            </startupForm.Field>

            <startupForm.Subscribe>
                {(state) => (
                    <button type="submit" className="
                         border-white text-center text-white bg-gray-950 py-2 px-4 rounded-xl  cursor-pointer font-medium hover:bg-gray-900 w-full max-h-11
                        "
                    >
                        {state.canSubmit ? "Создать стартап" : "Что то пошло не так"}
                    </button>
                )}
            </startupForm.Subscribe>
        </form>
    )
}