"use client"

import { useForm } from "@tanstack/react-form"
import { PersonnelSchema } from "@/src/app/lib/schemas/personnel"
import z from "zod/v4"
import { useMutation, useQuery } from "@tanstack/react-query"
import { api } from "@/src/app/lib/client/api"
import { queryClient } from "@/src/app/lib/client/query-client"
import { toast } from "sonner"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { Camera, ChevronLeft, Plus, X } from "lucide-react"

type Personnel = NonNullable<Awaited<ReturnType<typeof api.personnel.get>>["data"]>[number]

const STEPS = ["Данные", "Образование", "Специальность", "Навыки", "Контакты"]


const stepSchemas = [
    z.object({ name: PersonnelSchema.shape.name, position: PersonnelSchema.shape.position, city: PersonnelSchema.shape.city, age: PersonnelSchema.shape.age }),
    z.object({ institution: PersonnelSchema.shape.institution, faculty: PersonnelSchema.shape.faculty, period: PersonnelSchema.shape.period }),
    z.object({ categoryId: PersonnelSchema.shape.categoryId, specialtiesId: PersonnelSchema.shape.specialtiesId }),
    z.object({ skills: PersonnelSchema.shape.skills, summary: PersonnelSchema.shape.summary }),
    z.object({ contact: PersonnelSchema.shape.contact }),
]

export function EditPersonnelDialog({ personnel }: { personnel: Personnel }) {
    const [isOpen, setIsOpen] = useState(false)
    const [step, setStep] = useState(0)
    const [avatarFile, setAvatarFile] = useState<File | null>(null)
    const [avatarPreview, setAvatarPreview] = useState<string | null>(
        personnel.avatar ? `/api/files/${personnel.avatar}` : null
    )
    const [stepErrors, setStepErrors] = useState<Record<string, string>>({})
    const [skillInput, setSkillInput] = useState("")

    const { data: categories } = useQuery({
        queryKey: ["categories"],
        queryFn: async () => (await api.categories.get()).data,
    })

    const { data: specialties } = useQuery({
        queryKey: ["specialties"],
        queryFn: async () => (await api.specialties.get()).data,
    })

    const updateMutation = useMutation({
        mutationKey: ["updatePersonnelMe"],
        mutationFn: async (data: z.infer<typeof PersonnelSchema>) => {
            await api.personnel({ id: personnel.id }).put(data)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["personnel-me"] })
            queryClient.invalidateQueries({ queryKey: ["personnel"] })
            toast.success("Профиль обновлён")
            setIsOpen(false)
        },
        onError: () => {
            toast.error("Ошибка при обновлении профиля")
        },
    })

    const form = useForm({
        defaultValues: {
            avatar: personnel.avatar ?? "",
            name: personnel.name,
            position: personnel.position,
            city: personnel.city,
            age: personnel.age,
            summary: personnel.summary,
            institution: personnel.institution,
            faculty: personnel.faculty,
            period: personnel.period,
            skills: personnel.skills,
            contact: personnel.contact ?? "",
            categoryId: personnel.categoryId ?? "",
            specialtiesId: personnel.specialtiesId ?? "",
        },
        onSubmit: async ({ value }) => {
            const result = stepSchemas[4].safeParse(value)
            if (!result.success) {
                const errors: Record<string, string> = {}
                result.error.issues.forEach((issue) => {
                    if (issue.path[0]) errors[issue.path[0] as string] = issue.message
                })
                setStepErrors(errors)
                return
            }
            let avatar = value.avatar
            if (avatarFile) {
                const uploaded = await api.files.post({ file: avatarFile })
                avatar = uploaded.data as string
            }
            await updateMutation.mutateAsync({ ...value, avatar })
        },
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

    const selectedCategory = categories?.find((c) => c.id === form.state.values.categoryId)
    const selectedSpecialty = specialties?.find((s) => s.id === form.state.values.specialtiesId)

    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            setIsOpen(open)
            if (!open) { setStep(0); setAvatarFile(null); setStepErrors({}) }
        }}>
            <DialogTrigger asChild>
                <Button className="fixed bottom-2 right-0 left-0 mt-auto md:relative cursor-pointer">
                    Редактировать профиль
                </Button>
            </DialogTrigger>

            <DialogContent className="max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => { setStepErrors({}); setStep((s) => s - 1) }}
                            disabled={step === 0}
                            className="p-1 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <DialogTitle>Редактирование профиля</DialogTitle>
                    </div>
                </DialogHeader>

                <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center w-full">
                        {STEPS.map((_, i) => (
                            <div key={i} className="flex items-center flex-1 last:flex-none">
                                <div className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-all shrink-0",
                                    i <= step ? "bg-gray-950 border-gray-950 text-white" : "bg-white border-gray-200 text-gray-400"
                                )}>
                                    {i + 1}
                                </div>
                                {i < STEPS.length - 1 && (
                                    <div className={cn("h-px flex-1 transition-colors", i < step ? "bg-gray-950" : "bg-gray-200")} />
                                )}
                            </div>
                        ))}
                    </div>
                    <p className="text-sm font-medium text-gray-700">{STEPS[step]}</p>
                </div>

                <form
                    className="flex flex-col gap-4"
                    onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); form.handleSubmit() }}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && (e.target as HTMLElement).tagName !== "TEXTAREA") e.preventDefault()
                    }}
                >
                    {step === 0 && (
                        <div className="flex flex-col gap-4">
                            <div
                                className="flex items-center gap-3 cursor-pointer"
                                onClick={() => document.getElementById("edit-avatar-input")?.click()}
                            >
                                <div className="rounded-full bg-gray-100 border border-gray-300 overflow-hidden flex items-center justify-center w-12 h-12">
                                    {avatarPreview
                                        ? <img src={avatarPreview} alt="" className="w-full h-full object-cover" />
                                        : <Camera className="w-5 h-5 text-gray-400" />
                                    }
                                </div>
                                <div className="text-sm">
                                    <p className="font-semibold">Сменить фото</p>
                                    <p className="text-gray-400">JPG или PNG, до 500 МБ</p>
                                </div>
                                <input
                                    id="edit-avatar-input"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0]
                                        if (file) { setAvatarFile(file); setAvatarPreview(URL.createObjectURL(file)) }
                                    }}
                                />
                            </div>

                            <form.Field name="name">
                                {(field) => (
                                    <Input placeholder="ФИО" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)}
                                        errors={stepErrors.name ? [stepErrors.name] : []} />
                                )}
                            </form.Field>
                            <form.Field name="position">
                                {(field) => (
                                    <Input placeholder="Должность" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)}
                                        errors={stepErrors.position ? [stepErrors.position] : []} />
                                )}
                            </form.Field>
                            <form.Field name="city">
                                {(field) => (
                                    <Input placeholder="Город" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)}
                                        errors={stepErrors.city ? [stepErrors.city] : []} />
                                )}
                            </form.Field>
                            <form.Field name="age">
                                {(field) => (
                                    <Input placeholder="Возраст" type="number" value={field.state.value || ""}
                                        onChange={(e) => field.handleChange(Number(e.target.value))}
                                        errors={stepErrors.age ? [stepErrors.age] : []} />
                                )}
                            </form.Field>
                            <form.Field name="summary">
                                {(field) => (
                                    <Textarea placeholder="Краткое резюме" value={field.state.value}
                                        onChange={(e) => field.handleChange(e.target.value)} className="resize-none h-20" />
                                )}
                            </form.Field>
                        </div>
                    )}

                    {step === 1 && (
                        <div className="flex flex-col gap-4">
                            <form.Field name="institution">
                                {(field) => (
                                    <Input placeholder="Название учреждения" value={field.state.value}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        errors={stepErrors.institution ? [stepErrors.institution] : []} />
                                )}
                            </form.Field>
                            <form.Field name="period">
                                {(field) => (
                                    <Input placeholder="Период (2022-2026)" value={field.state.value}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        errors={stepErrors.period ? [stepErrors.period] : []} />
                                )}
                            </form.Field>
                            <form.Field name="faculty">
                                {(field) => (
                                    <Input placeholder="Направление" value={field.state.value}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        errors={stepErrors.faculty ? [stepErrors.faculty] : []} />
                                )}
                            </form.Field>
                        </div>
                    )}

                    {step === 2 && (
                        <form.Field name="specialtiesId">
                            {(specialtyField) => (
                                <form.Field name="categoryId">
                                    {(categoryField) => (
                                        <div className="flex flex-col gap-3">
                                            <p className="text-sm text-gray-500">
                                                Выбрано:{" "}
                                                <span className="font-medium text-gray-900">
                                                    {selectedSpecialty ? `${selectedCategory?.name} — ${selectedSpecialty.name}` : "ничего не выбрано"}
                                                </span>
                                            </p>
                                            <Accordion type="single" collapsible className="flex flex-col gap-2">
                                                {categories?.map((category) => (
                                                    <AccordionItem key={category.id} value={category.id}
                                                        className="border border-gray-200 rounded-xl px-4">
                                                        <AccordionTrigger className="font-medium text-sm">{category.name}</AccordionTrigger>
                                                        <AccordionContent>
                                                            <div className="flex flex-col gap-1 pb-2">
                                                                {specialties?.filter((s) => s.categoryId === category.id).map((specialty) => (
                                                                    <button key={specialty.id} type="button"
                                                                        onClick={() => {
                                                                            categoryField.handleChange(category.id)
                                                                            specialtyField.handleChange(specialty.id)
                                                                        }}
                                                                        className={cn(
                                                                            "text-left px-3 py-2 rounded-lg text-sm transition-colors",
                                                                            specialtyField.state.value === specialty.id
                                                                                ? "bg-blue-100 border border-blue-600 text-blue-600"
                                                                                : "hover:bg-gray-100"
                                                                        )}
                                                                    >
                                                                        {specialty.name}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </AccordionContent>
                                                    </AccordionItem>
                                                ))}
                                            </Accordion>
                                            {stepErrors.specialtiesId && <p className="text-destructive text-sm">{stepErrors.specialtiesId}</p>}
                                        </div>
                                    )}
                                </form.Field>
                            )}
                        </form.Field>
                    )}

                    {step === 3 && (
                        <form.Field name="skills">
                            {(field) => (
                                <div className="flex flex-col gap-3">
                                    <div className="flex gap-2">
                                        <input
                                            placeholder="Введите навык"
                                            value={skillInput}
                                            onChange={(e) => setSkillInput(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    e.preventDefault()
                                                    const trimmed = skillInput.trim()
                                                    if (trimmed && !field.state.value.includes(trimmed)) {
                                                        field.handleChange([...field.state.value, trimmed])
                                                    }
                                                    setSkillInput("")
                                                }
                                            }}
                                            className="flex-1 h-10 px-3 rounded-lg border border-input bg-gray-50 text-sm outline-none focus:border-gray-400"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const trimmed = skillInput.trim()
                                                if (trimmed && !field.state.value.includes(trimmed)) {
                                                    field.handleChange([...field.state.value, trimmed])
                                                }
                                                setSkillInput("")
                                            }}
                                            className="flex items-center gap-1 px-4 py-2 rounded-lg bg-gray-950 text-white text-sm hover:bg-gray-800 transition cursor-pointer"
                                        >
                                            <Plus className="size-4" />
                                            Добавить
                                        </button>
                                    </div>

                                    {field.state.value.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {field.state.value.map((skill) => (
                                                <span
                                                    key={skill}
                                                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-sm bg-gray-100 border border-gray-200"
                                                >
                                                    {skill}
                                                    <button
                                                        type="button"
                                                        onClick={() => field.handleChange(field.state.value.filter((s) => s !== skill))}
                                                        className="cursor-pointer text-gray-400 hover:text-gray-700 transition"
                                                    >
                                                        <X className="size-3.5" />
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {field.state.value.length === 0 && (
                                        <p className="text-sm text-gray-400">Навыки не добавлены</p>
                                    )}

                                    {stepErrors.skills && <p className="text-destructive text-sm">{stepErrors.skills}</p>}
                                </div>
                            )}
                        </form.Field>
                    )}

                    {step === 4 && (
                        <div className="flex flex-col gap-4">
                            <form.Field name="contact">
                                {(field) => (
                                    <Input placeholder="Telegram (@username)" value={field.state.value}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        errors={stepErrors.contact ? [stepErrors.contact] : []} />
                                )}
                            </form.Field>
                        </div>
                    )}

                    <div className="flex justify-end pt-2">
                        {isLastStep ? (
                            <Button type="button" onClick={() => form.handleSubmit()} disabled={updateMutation.isPending}>
                                {updateMutation.isPending ? "Сохраняем..." : "Сохранить"}
                            </Button>
                        ) : (
                            <Button type="button" onClick={handleNext}>Далее</Button>
                        )}
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    