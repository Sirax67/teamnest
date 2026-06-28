"use client"

import { useForm } from "@tanstack/react-form"
import z from "zod/v4"
import { Specialty } from "../../lib/types/specialty"
import { useMutation, useQuery } from "@tanstack/react-query"
import { api } from "../../lib/client/api"
import { queryClient } from "../../lib/client/query-client"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useState } from "react"
import { SpecialtiesSchema } from "../../lib/schemas/specialties"
import { Pencil, Plus } from "lucide-react"

export function CreateUpdateSpecialty({ specialty }: { specialty?: Specialty }) {
    const [isOpen, setIsOpen] = useState(false)

    const { data: categories } = useQuery({
        queryKey: ["categories"],
        queryFn: async () => (await api.categories.get()).data,
    })

    const createMutation = useMutation({
        mutationKey: ["createSpecialty"],
        mutationFn: async (data: z.infer<typeof SpecialtiesSchema>) => {
            await api.specialties.post(data)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["specialties"] })
            toast.success("Специальность успешно создана")
            form.reset()
            setIsOpen(false)
        },
    })

    const updateMutation = useMutation({
        mutationKey: ["updateSpecialty"],
        mutationFn: async (data: z.infer<typeof SpecialtiesSchema>) => {
            await api.specialties({ id: specialty!.id }).put(data)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["specialties"] })
            toast.success("Специальность успешно обновлена")
            form.reset()
            setIsOpen(false)
        },
    })

    const form = useForm({
        defaultValues: { ...specialty } as z.infer<typeof SpecialtiesSchema>,
        onSubmit: async ({ value }) => {
            if (specialty) {
                await updateMutation.mutateAsync(value)
            } else {
                await createMutation.mutateAsync(value)
            }
        },
        validators: { onSubmit: SpecialtiesSchema },
    })

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {specialty ? (
                    <Button variant="outline" size="icon" className="cursor-pointer">
                        <Pencil />
                    </Button>
                ) : (
                    <Button className="bg-gray-950 text-white hover:bg-gray-800 cursor-pointer px-4 py-3 h-auto rounded-xl">
                        <Plus /> Создать специальность
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{specialty ? "Редактирование специальности" : "Создание специальности"}</DialogTitle>
                </DialogHeader>
                <form
                    className="flex flex-col gap-4"
                    onSubmit={(e) => {
                        e.stopPropagation()
                        e.preventDefault()
                        form.handleSubmit()
                    }}
                >
                    <form.Field name="name">
                        {(field) => (
                            <div className="flex flex-col gap-2">
                                <p>Название</p>
                                <Input
                                    value={field.state.value}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    placeholder="Введите название"
                                    errors={field.state.meta.errors.flatMap((e) => e?.message ?? "")}
                                />
                            </div>
                        )}
                    </form.Field>
                    <form.Field name="categoryId">
                        {(field) => (
                            <div className="flex flex-col gap-2">
                                <p>Категория</p>
                                <select
                                    value={field.state.value}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    className="border border-gray-200 rounded-xl py-2 px-4 text-sm outline-none"
                                >
                                    <option value="">Выберите категорию</option>
                                    {categories?.map((c) => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                                {field.state.meta.errors.map((e) => (
                                    <p key={e?.message} className="text-red-500 text-xs">{e?.message}</p>
                                ))}
                            </div>
                        )}
                    </form.Field>
                    <form.Subscribe>
                        {(formState) => (
                            <Button
                                disabled={
                                    !formState.canSubmit ||
                                    createMutation.isPending ||
                                    updateMutation.isPending
                                }
                            >
                                {specialty ? "Обновить" : "Создать"}
                            </Button>
                        )}
                    </form.Subscribe>
                </form>
            </DialogContent>
        </Dialog>
    )
}
