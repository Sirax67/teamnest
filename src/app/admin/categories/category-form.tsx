"use client";

import { useMutation } from "@tanstack/react-query";
import {useForm} from "@tanstack/react-form"
import { api } from "../../lib/client/api";
import { CategorySchema } from "../../lib/schemas/category";
import z from "zod/v4";
import { queryClient } from "../../lib/client/query-client";

export function CategoryForm() {

    const createCategoryMutation = useMutation({
        mutationKey: ["create-category"],
        mutationFn: async (data: z.infer<typeof CategorySchema>) => {
            await api.categories.post(data)
        },
        onSuccess: () => {
            alert("Категория создана");
            queryClient.invalidateQueries({
                queryKey: ["category"]
            })
        },
        onError: (e) =>
        {
            alert(`Ошибка ${e.message}`)
        }    
    })

    const categoryForm = useForm({
        defaultValues: {} as z.infer<typeof CategorySchema>,
        onSubmit: ({value}) => {
            createCategoryMutation.mutate(value)
        },
        validators: {
            onSubmit: CategorySchema,
        }
    })

    return (
        <form 
            className="flex gap-4"
            onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    categoryForm.handleSubmit(e);
            }}>
            <categoryForm.Field name="name">
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
            </categoryForm.Field>
            <categoryForm.Subscribe>
                {(state) => (
                    <button type="submit" className="
                        max-w-60 border-white text-center text-white bg-gray-950 py-2 px-4 rounded-xl  cursor-pointer font-medium hover:bg-gray-900 w-full max-h-11
                        "
                    >
                        {state.canSubmit ? "Создать категорию" : "Что то пошло не так"}
                    </button>
                )}
            </categoryForm.Subscribe>
       </form>
    )
}