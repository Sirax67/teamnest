"use client";

import { useMutation } from "@tanstack/react-query";
import {useForm} from "@tanstack/react-form"
import { api } from "../../lib/client/api";
import { SectorSchema } from "../../lib/schemas/sectors";
import z from "zod/v4";
import { queryClient } from "../../lib/client/query-client";

export function SectorForm() {

    const createSectorMutation = useMutation({
        mutationKey: ["create-sector"],
        mutationFn: async (data: z.infer<typeof SectorSchema>) => {
            await api.sectors.post(data)
        },
        onSuccess: () => {
            alert("Сектор создан");
            queryClient.invalidateQueries({
                queryKey: ["sectors"]
            })
        },
        onError: (e) =>
        {
            alert(`Ошибка ${e.message}`)
        }    
    })

    const sectorForm = useForm({
        defaultValues: {} as z.infer<typeof SectorSchema>,
        onSubmit: ({ value }) => {
            createSectorMutation.mutate(value);
        },
        validators: {
            onSubmit: SectorSchema,
        }
    })

    return (
        <form 
            className="flex gap-4"
            onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                sectorForm.handleSubmit(e);
            }}>
            <sectorForm.Field name="name">
                {(field) => (
                    <div className="flex flex-col gap-2">
                        <input 
                            className="bg-gray-100 border border-gray-200 rounded-xl py-2 px-4 outline-gray-300 text-center"
                            value={field.state.value}
                            placeholder="Введите название "
                            onChange={(e) => field.handleChange(e.target.value)}
                        />
                        {field.state.meta.errors.map((er) => (
                            <p key={er?.message} className="text-red-700">
                                {er?.message}
                            </p>
                        ))}
                    </div>
                )}
            </sectorForm.Field>
            <sectorForm.Subscribe>
                {(state) => (
                    <button type="submit" className="
                        max-w-60 border-white text-center text-white bg-gray-950 py-2 px-4 rounded-xl  cursor-pointer font-medium hover:bg-gray-900 w-full max-h-11
                        "
                    >
                        {state.canSubmit ? "Создать сектор" : "Что то пошло не так"}
                    </button>
                )}
            </sectorForm.Subscribe>
       </form>
    )
}