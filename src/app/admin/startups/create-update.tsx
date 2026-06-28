"use client"

import { useForm } from "@tanstack/react-form"
import { StartupsSchema, stageEnum } from "../../lib/schemas/startups"
import z from "zod/v4"
import { Startup } from "../../lib/types/startup"
import { useMutation, useQuery } from "@tanstack/react-query"
import { api } from "../../lib/client/api"
import { queryClient } from "../../lib/client/query-client"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useState } from "react"
import { Plus, Pencil, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

const STEPS = ["Логотип", "Основное", "Детали", "Ссылка"]

const stepSchemas = [
    z.object({}),
    z.object({ name: StartupsSchema.shape.name, description: StartupsSchema.shape.description }),
    z.object({ sectorId: StartupsSchema.shape.sectorId, stage: StartupsSchema.shape.stage, startDate: StartupsSchema.shape.startDate }),
    z.object({ link: StartupsSchema.shape.link }),
]

export function CreateUpdateStartup({ startup }: { startup?: Startup }) {
    const [isOpen, setIsOpen] = useState(false)
    const [step, setStep] = useState(0)
    const [logoFile, setLogoFile] = useState<File | null>(null)
    const [logoPreview, setLogoPreview] = useState<string | null>(
        startup?.logo ? `/api/files/${startup.logo}` : null
    )
    const [stepErrors, setStepErrors] = useState<Record<string, string>>({})

    const { data: sectors } = useQuery({
        queryKey: ["sectors"],
        queryFn: async () => (await api.sectors.get()).data,
    })

    const createMutation = useMutation({
        mutationKey: ["createStartup"],
        mutationFn: async (data: z.infer<typeof StartupsSchema>) => {
            await api.startups.post(data)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["startups"] })
            toast.success("Стартап успешно создан")
            form.reset()
            setIsOpen(false)
        },
    })

    const updateMutation = useMutation({
        mutationKey: ["updateStartup"],
        mutationFn: async (data: z.infer<typeof StartupsSchema>) => {
            await api.startups({ id: startup!.id }).put(data)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["startups"] })
            toast.success("Стартап успешно обновлён")
            form.reset()
            setIsOpen(false)
        },
    })

    const form = useForm({
        defaultValues: {
            ...startup,
            startDate: startup?.startDate
                ? new Date(startup.startDate).toISOString().split("T")[0]
                : undefined,
        } as z.infer<typeof StartupsSchema>,
        onSubmit: async ({ value }) => {
            let logo = value.logo
            if (logoFile) {
                const uploaded = await api.files.post({ file: logoFile })
                logo = uploaded.data as string
            }
            if (startup) {
                await updateMutation.mutateAsync({ ...value, logo })
            } else {
                await createMutation.mutateAsync({ ...value, logo })
            }
        },
        validators: { onSubmit: StartupsSchema },
    })

    const handleNext = () => {
        const result = stepSchemas[step].safeParse(form.state.values)
        if (!result.success) {
            const errors: Record<string, string> = {}
            result.error.issues.forEach((issue) => {
                if (issue.path[0]) errors[issue.path[0] as string] = issue.message
            })
            setStepErrors(errors)
            return
        }
        setStepErrors({})
        setStep((s) => s + 1)
    }

    const isLastStep = step === STEPS.length - 1

    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            setIsOpen(open)
            if (!open) { setStep(0); setLogoFile(null); setStepErrors({}) }
        }}>
            <DialogTrigger asChild>
                {startup ? (
                    <Button variant="outline" size="icon" className="cursor-pointer">
                        <Pencil />
                    </Button>
                ) : (
                    <Button className="bg-gray-950 text-white hover:bg-gray-800 cursor-pointer px-4 py-3 h-auto rounded-xl">
                        <Plus /> Создать стартап
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{startup ? "Редактирование стартапа" : "Создание стартапа"}</DialogTitle>
                </DialogHeader>

                <div className="flex items-center justify-between">
                    <button
                        type="button"
                        onClick={() => { setStepErrors({}); setStep((s) => s - 1) }}
                        disabled={step === 0}
                        className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>

                    <div className="flex items-center gap-2">
                        {STEPS.map((label, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <div className={cn(
                                    "w-2 h-2 rounded-full transition-colors",
                                    i === step ? "bg-gray-950" : i < step ? "bg-gray-400" : "bg-gray-200"
                                )} />
                                {i === step && <span className="text-sm font-medium text-gray-700">{label}</span>}
                            </div>
                        ))}
                    </div>

                    <button
                        type="button"
                        onClick={isLastStep ? undefined : handleNext}
                        disabled={isLastStep}
                        className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>

                <form
                    className="flex flex-col gap-4"
                    onSubmit={(e) => {
                        e.stopPropagation()
                        e.preventDefault()
                        form.handleSubmit()
                    }}
                >
                    {step === 0 && (
                        <div className="flex flex-col gap-3 items-center">
                            {logoPreview && (
                                <img src={logoPreview} alt="preview" className="w-24 h-24 object-cover rounded-xl" />
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                className="w-full bg-gray-100 border border-gray-200 rounded-xl py-2 px-4 text-sm"
                                onChange={(e) => {
                                    const file = e.target.files?.[0] ?? null
                                    setLogoFile(file)
                                    if (file) setLogoPreview(URL.createObjectURL(file))
                                }}
                            />
                        </div>
                    )}

                    {step === 1 && (
                        <>
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
                                        {stepErrors.name && <p className="text-red-500 text-xs">{stepErrors.name}</p>}
                                    </div>
                                )}
                            </form.Field>
                            <form.Field name="description">
                                {(field) => (
                                    <div className="flex flex-col gap-2">
                                        <p>Описание</p>
                                        <textarea
                                            value={field.state.value}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            placeholder="Введите описание"
                                            rows={4}
                                            className="border border-gray-200 rounded-xl py-2 px-4 text-sm resize-none outline-none focus:border-gray-400"
                                        />
                                        {field.state.meta.errors.map((e) => (
                                            <p key={e?.message} className="text-red-500 text-xs">{e?.message}</p>
                                        ))}
                                        {stepErrors.description && <p className="text-red-500 text-xs">{stepErrors.description}</p>}
                                    </div>
                                )}
                            </form.Field>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <form.Field name="sectorId">
                                {(field) => (
                                    <div className="flex flex-col gap-2">
                                        <p>Сектор</p>
                                        <select
                                            value={field.state.value}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            className="border border-gray-200 rounded-xl py-2 px-4 text-sm outline-none"
                                        >
                                            <option value="">Выберите сектор</option>
                                            {sectors?.map((s) => (
                                                <option key={s.id} value={s.id}>{s.name}</option>
                                            ))}
                                        </select>
                                        {field.state.meta.errors.map((e) => (
                                            <p key={e?.message} className="text-red-500 text-xs">{e?.message}</p>
                                        ))}
                                        {stepErrors.sectorId && <p className="text-red-500 text-xs">{stepErrors.sectorId}</p>}
                                    </div>
                                )}
                            </form.Field>
                            <form.Field name="stage">
                                {(field) => (
                                    <div className="flex flex-col gap-2">
                                        <p>Стадия</p>
                                        <select
                                            value={field.state.value}
                                            onChange={(e) => field.handleChange(e.target.value as any)}
                                            className="border border-gray-200 rounded-xl py-2 px-4 text-sm outline-none"
                                        >
                                            <option value="">Выберите стадию</option>
                                            {stageEnum.options.map((s) => (
                                                <option key={s} value={s}>{s}</option>
                                            ))}
                                        </select>
                                        {field.state.meta.errors.map((e) => (
                                            <p key={e?.message} className="text-red-500 text-xs">{e?.message}</p>
                                        ))}
                                        {stepErrors.stage && <p className="text-red-500 text-xs">{stepErrors.stage}</p>}
                                    </div>
                                )}
                            </form.Field>
                            <form.Field name="startDate">
                                {(field) => (
                                    <div className="flex flex-col gap-2">
                                        <p>Дата начала</p>
                                        <Input
                                            type="date"
                                            value={field.state.value}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            errors={field.state.meta.errors.flatMap((e) => e?.message ?? "")}
                                        />
                                        {stepErrors.startDate && <p className="text-red-500 text-xs">{stepErrors.startDate}</p>}
                                    </div>
                                )}
                            </form.Field>
                        </>
                    )}

                    {step === 3 && (
                        <>
                            <form.Field name="link">
                                {(field) => (
                                    <div className="flex flex-col gap-2">
                                        <p>Ссылка на проект</p>
                                        <Input
                                            value={field.state.value}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            placeholder="https://..."
                                            errors={field.state.meta.errors.flatMap((e) => e?.message ?? "")}
                                        />
                                        {stepErrors.link && <p className="text-red-500 text-xs">{stepErrors.link}</p>}
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
                                        {startup ? "Обновить" : "Создать"}
                                    </Button>
                                )}
                            </form.Subscribe>
                        </>
                    )}
                </form>
            </DialogContent>
        </Dialog>
    )
}
