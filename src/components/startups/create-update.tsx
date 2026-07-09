"use client"

import { useForm } from "@tanstack/react-form"
import { StartupsSchema, stageEnum } from "@/src/app/lib/schemas/startups"
import z from "zod/v4"
import { Startup } from "@/src/app/lib/types/startup"
import { useMutation, useQuery } from "@tanstack/react-query"
import { api } from "@/src/app/lib/client/api"
import { queryClient } from "@/src/app/lib/client/query-client"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useState, useEffect } from "react"
import { Plus, Pencil, ChevronLeft, Search, X, Camera, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"

const STEPS = ["Основное", "Вакансии", "Команда"]

type VacancyLocal = {
    id?: string
    categoryId: string
    specialtyId?: string
    description?: string
}

type MemberLocal = {
    id?: string
    personnelId: string
    role?: string
    name: string
    avatar?: string | null
    position: string
    specialty: string
}

export function CreateUpdateStartup({ startup, label }: { startup?: Startup, label?: string }) {
    const [isOpen, setIsOpen] = useState(false)
    const [step, setStep] = useState(0)
    const [logoFile, setLogoFile] = useState<File | null>(null)
    const [logoPreview, setLogoPreview] = useState<string | null>(
        startup?.logo ? `/api/files/${startup.logo}` : null
    )
    const [stepErrors, setStepErrors] = useState<Record<string, string>>({})
    const [vacancies, setVacancies] = useState<VacancyLocal[]>([{ categoryId: "" }])
    const [deletedVacancyIds, setDeletedVacancyIds] = useState<string[]>([])
    const [members, setMembers] = useState<MemberLocal[]>([])
    const [deletedMemberIds, setDeletedMemberIds] = useState<string[]>([])
    const [personnelSearch, setPersonnelSearch] = useState("")

    const { data: sectors } = useQuery({
        queryKey: ["sectors"],
        queryFn: async () => (await api.sectors.get()).data,
    })

    const { data: categories } = useQuery({
        queryKey: ["categories"],
        queryFn: async () => (await api.categories.get()).data,
    })

    const { data: allSpecialties } = useQuery({
        queryKey: ["specialties"],
        queryFn: async () => (await api.specialties.get()).data,
    })

    const { data: startupDetail } = useQuery({
        queryKey: ["startup-detail", startup?.id],
        queryFn: async () => (await api.startups({ id: startup!.id }).get()).data,
        enabled: !!startup?.id && isOpen,
    })

    const { data: searchResults } = useQuery({
        queryKey: ["personnel-search", personnelSearch],
        queryFn: async () => (await api.personnel.search.get({ query: { q: personnelSearch } })).data,
        enabled: personnelSearch.length >= 2,
    })

    useEffect(() => {
        if (startupDetail) {
            const detail = startupDetail as any
            if (detail.vacancies?.length > 0) {
                setVacancies(detail.vacancies.map((v: any) => ({
                    id: v.id,
                    categoryId: v.categoryId,
                    specialtyId: v.specialtyId ?? undefined,
                    description: v.description ?? undefined,
                })))
            }
            if (detail.members?.length > 0) {
                setMembers(detail.members.map((m: any) => ({
                    id: m.id,
                    personnelId: m.personnelId,
                    role: m.role ?? undefined,
                    name: m.personnel.name,
                    avatar: m.personnel.avatar,
                    position: m.personnel.position,
                })))
            }
        }
    }, [startupDetail])

    const createMutation = useMutation({
        mutationFn: async (data: z.infer<typeof StartupsSchema>) => {
            const res = await api.startups.post(data)
            return (res.data as any)?.id as string
        },
        onSuccess: async (startupId) => {
            for (const v of vacancies) {
                if (v.categoryId) {
                    await api.startups({ id: startupId }).vacancies.post({
                        categoryId: v.categoryId,
                        specialtyId: v.specialtyId,
                        description: v.description,
                    })
                }
            }
            for (const m of members) {
                await api.startups({ id: startupId }).members.post({
                    personnelId: m.personnelId,
                    role: m.role,
                })
            }
            queryClient.invalidateQueries({ queryKey: ["startups"] })
            queryClient.invalidateQueries({ queryKey: ["startups-me"] })
            toast.success("Стартап успешно создан")
            handleClose()
        },
    })

    const updateMutation = useMutation({
        mutationFn: async (data: z.infer<typeof StartupsSchema>) => {
            await api.startups({ id: startup!.id }).put(data)
            for (const id of deletedVacancyIds) {
                await api.startups({ id: startup!.id }).vacancies({ vacancyId: id }).delete()
            }
            for (const v of vacancies.filter(v => !v.id && v.categoryId)) {
                await api.startups({ id: startup!.id }).vacancies.post({
                    categoryId: v.categoryId,
                    specialtyId: v.specialtyId,
                    description: v.description,
                })
            }
            for (const id of deletedMemberIds) {
                await api.startups({ id: startup!.id }).members({ memberId: id }).delete()
            }
            for (const m of members.filter(m => !m.id)) {
                await api.startups({ id: startup!.id }).members.post({
                    personnelId: m.personnelId,
                    role: m.role,
                })
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["startups"] })
            queryClient.invalidateQueries({ queryKey: ["startups-me"] })
            queryClient.invalidateQueries({ queryKey: ["startup-detail", startup?.id] })
            toast.success("Стартап успешно обновлён")
            handleClose()
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

    const handleClose = () => {
        setIsOpen(false)
        setStep(0)
        setLogoFile(null)
        setStepErrors({})
        setVacancies([{ categoryId: "" }])
        setMembers([])
        setDeletedVacancyIds([])
        setDeletedMemberIds([])
        setPersonnelSearch("")
    }

    const handleNext = () => {
        if (step === 0) {
            const result = StartupsSchema.safeParse(form.state.values)
            if (!result.success) {
                const errors: Record<string, string> = {}
                result.error.issues.forEach((issue) => {
                    if (issue.path[0]) errors[issue.path[0] as string] = issue.message
                })
                setStepErrors(errors)
                return
            }
        }
        setStepErrors({})
        setStep((s) => s + 1)
    }

    const isLastStep = step === STEPS.length - 1
    const isPending = createMutation.isPending || updateMutation.isPending

    const addVacancy = () => setVacancies(v => [...v, { categoryId: "" }])

    const removeVacancy = (index: number) => {
        const v = vacancies[index]
        if (v.id) setDeletedVacancyIds(ids => [...ids, v.id!])
        setVacancies(list => list.filter((_, i) => i !== index))
    }

    const updateVacancy = (index: number, patch: Partial<VacancyLocal>) => {
        setVacancies(list => list.map((v, i) => i === index ? { ...v, ...patch } : v))
    }

    const addMember = (p: any) => {
        if (members.some(m => m.personnelId === p.id)) return
        setMembers(list => [...list, {
            personnelId: p.id,
            name: p.name,
            avatar: p.avatar,
            position: p.position,
            specialty: p.specialty
        }])
        setPersonnelSearch("")
    }

    const removeMember = (index: number) => {
        const m = members[index]
        if (m.id) setDeletedMemberIds(ids => [...ids, m.id!])
        setMembers(list => list.filter((_, i) => i !== index))
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => { if (!open) handleClose(); else setIsOpen(true) }}>
            <DialogTrigger asChild>
                {startup ? (
                    <Button variant="outline" size="icon" className="cursor-pointer">
                        <Pencil />
                    </Button>
                ) : (
                    <Button className="z-50 fixed bottom-2 right-0 left-0 mt-auto md:relative cursor-pointer px-4 py-3 h-auto rounded-xl">
                        {label ?? "Создать стартап"}
                    </Button>
                )}
            </DialogTrigger>

            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-150">
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
                        <DialogTitle>{startup ? "Редактирование стартапа" : "Создание стартапа"}</DialogTitle>
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
                    onSubmit={(e) => { e.stopPropagation(); e.preventDefault(); form.handleSubmit() }}
                >
                    {step === 0 && (
                        <>
                            <div
                                className="flex items-center gap-3 cursor-pointer"
                                onClick={() => document.getElementById("logo-input")?.click()}
                            >
                                <div className="rounded-xl bg-gray-100 border border-gray-300 overflow-hidden flex items-center justify-center w-16 h-16 shrink-0">
                                    {logoPreview
                                        ? <img src={logoPreview} alt="" className="w-full h-full object-cover" />
                                        : <Camera className="w-5 h-5 text-gray-400" />
                                    }
                                </div>
                                <div className="text-sm">
                                    <p className="font-semibold">Загрузить логотип</p>
                                    <p className="text-gray-400">JPG или PNG, до 500 МБ</p>
                                </div>
                                <input
                                    id="logo-input"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0] ?? null
                                        setLogoFile(file)
                                        if (file) setLogoPreview(URL.createObjectURL(file))
                                    }}
                                />
                            </div>

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
                                            rows={3}
                                            className="border border-gray-200 rounded-xl py-2 px-4 text-sm resize-none outline-none focus:border-gray-400"
                                        />
                                        {stepErrors.description && <p className="text-red-500 text-xs">{stepErrors.description}</p>}
                                    </div>
                                )}
                            </form.Field>

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
                        </>
                    )}

                    {step === 1 && (
                        <div className="flex flex-col gap-4">
                            {vacancies.map((v, i) => (
                                <div key={i} className="flex flex-col gap-3 border border-gray-200 rounded-xl p-4">
                                    <div className="flex justify-between items-center">
                                        <p className="font-medium text-sm">Вакансия {i + 1}</p>
                                        {vacancies.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeVacancy(i)}
                                                className=" hover:text-gray-800 transition"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>

                                    <div className="flex gap-3">
                                        <div className="flex flex-col gap-1 flex-1">
                                            <p className="text-sm text-gray-600">Направление <span className="text-red-400">*</span></p>
                                            <select
                                                value={v.categoryId}
                                                onChange={(e) => updateVacancy(i, { categoryId: e.target.value, specialtyId: undefined })}
                                                className="border border-gray-200 rounded-xl py-2 px-3 text-sm outline-none"
                                            >
                                                <option value="">Выберите направление</option>
                                                {categories?.map((c) => (
                                                    <option key={c.id} value={c.id}>{c.name}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="flex flex-col gap-1 flex-1">
                                            <p className="text-sm text-gray-600">Роль</p>
                                            <select
                                                value={v.specialtyId ?? ""}
                                                onChange={(e) => updateVacancy(i, { specialtyId: e.target.value || undefined })}
                                                disabled={!v.categoryId}
                                                className="border border-gray-200 rounded-xl py-2 px-3 text-sm outline-none disabled:opacity-40"
                                            >
                                                <option value="">{v.categoryId ? "Другое" : "Недоступно"}</option>
                                                {allSpecialties
                                                    ?.filter((s: any) => s.categoryId === v.categoryId)
                                                    .map((s: any) => (
                                                        <option key={s.id} value={s.id}>{s.name}</option>
                                                    ))
                                                }
                                            </select>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <p className="text-sm text-gray-600">Описание вакансии</p>
                                        <Textarea
                                            value={v.description ?? ""}
                                            onChange={(e) => updateVacancy(i, { description: e.target.value })}
                                            placeholder="Опишите требования и обязанности..."
                                            rows={3}
                                            className="border border-gray-200 rounded-xl py-2 px-3 text-sm resize-none outline-none focus:border-gray-400"
                                        />
                                    </div>
                                </div>
                            ))}

                            <button
                                type="button"
                                onClick={addVacancy}
                                className="flex items-center justify-center gap-2 border border-dashed border-gray-300 rounded-xl py-3 text-sm text-gray-500 hover:border-gray-400 hover:text-gray-700 transition cursor-pointer"
                            >
                                <Plus className="w-4 h-4" /> Добавить вакансию
                            </button>

                            <p className="text-xs text-blue-500">Сначала опишите вакансии — на следующем шаге можно пригласить в команду через поиск</p>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                                <p className="font-medium text-sm">Поиск участников на платформе</p>
                                <div className="relative flex items-center">
                                    <Search className="absolute left-3 size-4 text-gray-400" />
                                    <input
                                        value={personnelSearch}
                                        onChange={(e) => setPersonnelSearch(e.target.value)}
                                        placeholder="Введите имя или роль..."
                                        className="w-full border border-gray-200 rounded-xl py-2 pl-9 pr-4 text-sm outline-none focus:border-gray-400"
                                    />
                                </div>

                                {personnelSearch.length >= 2 && searchResults && searchResults.length > 0 && (
                                    <div className="border border-gray-200 rounded-xl overflow-hidden">
                                        {(searchResults as any[]).map((p) => (
                                            <button
                                                key={p.id}
                                                type="button"
                                                onClick={() => addMember(p)}
                                                disabled={members.some(m => m.personnelId === p.id)}
                                                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition text-left border-b border-gray-100 last:border-0 disabled:opacity-40"
                                            >
                                                <img
                                                    src={p.avatar ? `/api/files/${p.avatar}` : "/images/default-avatar.svg"}
                                                    onError={(e) => { e.currentTarget.src = "/images/default-avatar.svg" }}
                                                    alt=""
                                                    className="w-8 h-8 rounded-full object-cover shrink-0"
                                                />
                                                <div>
                                                    <p className="text-sm font-medium">{p.name}</p>
                                                    <p className="text-xs text-gray-500">{(p as any).specialty?.name}</p>
                                                </div>
                                                {members.some(m => m.personnelId === p.id) && (
                                                    <span className="ml-auto text-xs text-gray-400">Добавлен</span>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {personnelSearch.length >= 2 && searchResults?.length === 0 && (
                                    <p className="text-sm text-gray-400 text-center py-2">Никого не найдено</p>
                                )}
                            </div>

                            <div className="flex flex-col gap-2">
                                <p className="font-medium text-sm">Участники - {members.length}</p>
                                {members.length === 0 ? (
                                    <div className="flex flex-col items-center gap-1 py-8 text-center">
                                        <Users className="size-10"/>
                                        <p className="text-lg font-medium">
                                            Соберите команду мечты
                                        </p>
                                        <p className="text-sm text-gray-500 max-w-[40ch]">
                                            Найдите специалистов на платформе TeamNest и пригласите их через поиск.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-2">
                                        {members.map((m, i) => (
                                            <div key={i} className="flex items-center justify-between border border-gray-200 rounded-xl px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <img
                                                        src={m.avatar ? `/api/files/${m.avatar}` : "/images/default-avatar.svg"}
                                                        onError={(e) => { e.currentTarget.src = "/images/default-avatar.svg" }}
                                                        alt=""
                                                        className="w-8 h-8 rounded-full object-cover"
                                                    />
                                                    <div className="">
                                                        <p className="text-sm font-medium">{m.name}</p>
                                                        <p className="text-xs text-gray-500">{(m as any).specialty?.name}</p>
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeMember(i)}
                                                    className=" hover:text-gray-800 transition"
                                                >
                                                    <X className="size-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <p className="text-xs text-blue-500">Можете добавить команду позже — этот шаг необязателен</p>
                        </div>
                    )}

                    <div className="flex justify-end pt-2">
                        {isLastStep ? (
                            <Button
                                disabled={isPending}
                                onClick={() => form.handleSubmit()}
                                type="button"
                                className="cursor-pointer"
                            >
                                {isPending ? "Сохраняем..." : startup ? "Обновить" : "Создать"}
                            </Button>
                        ) : (
                            <Button type="button" onClick={handleNext} className="cursor-pointer">Далее</Button>
                        )}
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
