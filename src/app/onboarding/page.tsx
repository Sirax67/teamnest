"use client"

import { useForm } from "@tanstack/react-form"
import { PersonnelSchema } from "../lib/schemas/personnel"
import z from "zod/v4"
import { useMutation, useQuery } from "@tanstack/react-query"
import { api } from "../lib/client/api"
import { toast } from "sonner"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { cn } from "@/lib/utils"
import { Camera, CircleAlert, MoveRight, Search } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

const STEPS = ["Данные", "Образование", "Специальность", "Навыки", "Контакты"]

const SKILLS_BY_CATEGORY: Record<string, string[]> = {
    "Бекенд": ["Node.js", "Bun", "Python", "Go", "Rust", "Java", "PHP", "C#", "PostgreSQL", "MongoDB", "Redis"],
    "Фронтенд": ["React", "Vue", "Angular", "TypeScript", "Next.js", "Tailwind CSS", "HTML/CSS", "Vite"],
    "Дизайн": ["Figma", "Photoshop", "Illustrator", "UI/UX", "Sketch", "After Effects"],
    "Инженерия": ["Docker", "Kubernetes", "AWS", "Linux", "CI/CD", "Nginx", "Git"],
    "Маркетинг": ["SEO", "SMM", "Таргет", "Контент-маркетинг", "Email-маркетинг", "Аналитика"],
    "Менеджмент": ["Agile", "Scrum", "Kanban", "Управление командой", "Jira", "Notion"],
    "Нейросети": ["PyTorch", "TensorFlow", "OpenAI API", "LangChain", "Computer Vision", "NLP"],
    "Софт скиллы": ["Коммуникация", "Лидерство", "Тайм-менеджмент", "Публичные выступления", "Работа в команде"],
}

const stepSchemas = [
    z.object({
        name: PersonnelSchema.shape.name,
        position: PersonnelSchema.shape.position,
        city: PersonnelSchema.shape.city,
        age: PersonnelSchema.shape.age,
    }),
    z.object({
        institution: PersonnelSchema.shape.institution,
        faculty: PersonnelSchema.shape.faculty,
        period: PersonnelSchema.shape.period,
    }),
    z.object({
        categoryId: PersonnelSchema.shape.categoryId,
        specialtiesId: PersonnelSchema.shape.specialtiesId,
    }),
    z.object({
        skills: PersonnelSchema.shape.skills,
        summary: PersonnelSchema.shape.summary,
    }),
    z.object({
        contact: PersonnelSchema.shape.contact,
    }),
]

export default function OnboardingPage() {
    const router = useRouter()
    const [step, setStep] = useState(0)
    const [avatarFile, setAvatarFile] = useState<File | null>(null)
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
    const [stepErrors, setStepErrors] = useState<Record<string, string>>({})

    const [openCategoryId, setOpenCategoryId] = useState<string | null>(null)
    const [specialtySearch, setSpecialtySearch] = useState("")
    const [skillSearch, setSkillSearch] = useState("")

    const { data: categories } = useQuery({
        queryKey: ["categories"],
        queryFn: async () => (await api.categories.get()).data,
    })

    const { data: specialties } = useQuery({
        queryKey: ["specialties"],
        queryFn: async () => (await api.specialties.get()).data,
    })

    const createMutation = useMutation({
        mutationKey: ["createPersonnel"],
        mutationFn: async (data: z.infer<typeof PersonnelSchema>) => {
            await api.personnel.post(data)
        },
        onSuccess: () => {
            toast.success("Профиль успешно создан!")
            router.push("/")
        },
        onError: () => {
            toast.error("Ошибка при создании профиля")
        },
    })

    const form = useForm({
        defaultValues: {
            avatar: "",
            name: "",
            position: "",
            city: "",
            age: 0,
            contact: "",
            institution: "",
            faculty: "",
            period: "",
            skills: [] as string[],
            summary: "",
            categoryId: "",
            specialtiesId: "",
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
            await createMutation.mutateAsync({ ...value, avatar })
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

    const handleBack = () => {
        setStepErrors({})
        setStep((s) => s - 1)
    }

    const selectedCategory = categories?.find((c) => c.id === form.state.values.categoryId)
    const selectedSpecialty = specialties?.find((s) => s.id === form.state.values.specialtiesId)

    return (
        <div className="container m-auto w-auto flex flex-col items-center justify-center p-4 bg-gray-100 rounded-2xl border ">
            <div className="flex flex-col gap-4 w-full">

                <h1 className="text-2xl font-semibold">Создание профиля</h1>

                <div className="flex items-center gap-2">
                    {STEPS.map((s, i) => (
                        <div key={s} className="flex items-center gap-2">
                            <div className={cn(
                                "flex items-center gap-2",
                                i > step && "opacity-60"
                            )}>
                                <div className={cn(
                                    "w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold",
                                    i <= step ? "bg-blue-600 text-white" : "bg-gray-200"
                                )}>
                                    {i + 1}
                                </div>
                                <span className="text-sm font-medium hidden sm:block">{s}</span>
                            </div>
                            {i < STEPS.length - 1 && (
                                <MoveRight className="text-gray-300 size-5"/>
                            )}
                        </div>
                    ))}
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl p-6 w-full">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            form.handleSubmit()
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && (e.target as HTMLElement).tagName !== "TEXTAREA") e.preventDefault()
                        }}
                    >
                        {step === 0 && (
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="rounded-full bg-gray-100 border border-gray-300 flex items-center justify-center cursor-pointer  overflow-hidden"
                                        onClick={() => document.getElementById("avatar-input")?.click()}
                                    >
                                        {avatarPreview
                                            ? <img src={avatarPreview} alt="Аватар" className="w-10 aspect-square object-cover" />
                                            : <Camera className="m-3" />
                                        }
                                    </div>
                                    <div className="text-sm">
                                        <p className="font-semibold">Загрузить фото</p>
                                        <p className="text-gray-400">JPG или PNG, до 500 МБ.</p>
                                    </div>
                                    <input
                                        id="avatar-input"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0]
                                            if (file) {
                                                setAvatarFile(file)
                                                setAvatarPreview(URL.createObjectURL(file))
                                            }
                                        }}
                                    />
                                </div>

                                <form.Field name="name">
                                    {(field) => (
                                        <Input
                                            className="bg-gray-50 rounded-lg p-3 h-auto"
                                            placeholder="ФИО"
                                            value={field.state.value}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            errors={stepErrors.name ? [stepErrors.name] : []}
                                        />
                                    )}
                                </form.Field>

                                <form.Field name="city">
                                    {(field) => (
                                        <Input
                                            className="bg-gray-50 rounded-lg p-3 h-auto"
                                            placeholder="Город"
                                            value={field.state.value}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            errors={stepErrors.city ? [stepErrors.city] : []}
                                        />
                                    )}
                                </form.Field>

                                <form.Field name="age">
                                    {(field) => (
                                        <Input
                                            className="bg-gray-50 rounded-lg p-3 h-auto"
                                            placeholder="Возраст"
                                            type="number"
                                            value={field.state.value || ""}
                                            onChange={(e) => field.handleChange(Number(e.target.value))}
                                            errors={stepErrors.age ? [stepErrors.age] : []}
                                        />
                                    )}
                                </form.Field>
                                
                                <div>
                                    <form.Field name="summary">
                                        {(field) => (
                                            <Textarea
                                                className="bg-gray-50 rounded-lg p-3 h-20"
                                                placeholder="Краткое резюме"
                                                value={field.state.value}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                            />
                                        )}
                                    </form.Field>
                                    <p className="flex text-sm items-center text-black/70 gap-1">
                                        <CircleAlert className="size-4"/> 
                                        Опишите ваш опыт, сильнын стороны и что ищете.
                                    </p>
                                </div>
                                
                            </div>
                        )}

                        {step === 1 && (
                            <div className="flex flex-col gap-4">
                                <form.Field name="institution">
                                    {(field) => (
                                        <Input
                                            className="bg-gray-50 rounded-lg p-3 h-auto"
                                            placeholder="Название учреждения"
                                            value={field.state.value}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            errors={stepErrors.institution ? [stepErrors.institution] : []}
                                        />
                                    )}
                                </form.Field>
                                
                                <form.Field name="period">
                                    {(field) => (
                                        <Input
                                            className="bg-gray-50 rounded-lg p-3 h-auto"
                                            placeholder="Период (2022-2026)"
                                            value={field.state.value}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            errors={stepErrors.period ? [stepErrors.period] : []}
                                        />
                                    )}
                                </form.Field>

                                <form.Field name="faculty">
                                    {(field) => (
                                        <Input
                                            className="bg-gray-50 rounded-lg p-3 h-auto"
                                            placeholder="Направление"
                                            value={field.state.value}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            errors={stepErrors.faculty ? [stepErrors.faculty] : []}
                                        />
                                    )}
                                </form.Field>

                                <form.Field name="position">
                                    {(field) => (
                                        <Input
                                            className="bg-gray-50 rounded-lg p-3 h-auto"
                                            placeholder="Должность/степень"
                                            value={field.state.value}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            errors={stepErrors.faculty ? [stepErrors.faculty] : []}
                                        />
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
                                                        <AccordionItem
                                                            key={category.id}
                                                            value={category.id}
                                                            className="border border-gray-200 rounded-xl px-4"
                                                        >
                                                            <AccordionTrigger className="font-medium text-sm">
                                                                {category.name}
                                                            </AccordionTrigger>
                                                            <AccordionContent>
                                                                <div className="flex flex-col gap-1 pb-2">
                                                                    {specialties
                                                                        ?.filter((s) => s.categoryId === category.id)
                                                                        .map((specialty) => (
                                                                            <button
                                                                                key={specialty.id}
                                                                                type="button"
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
                                                                        ))
                                                                    }
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    ))}
                                                </Accordion>

                                                {stepErrors.specialtiesId && <p className="text-destructive text-sm">{stepErrors.specialtiesId}</p>}
                                                {stepErrors.categoryId && <p className="text-destructive text-sm">{stepErrors.categoryId}</p>}
                                            </div>
                                        )}
                                    </form.Field>
                                )}
                            </form.Field>
                        )}

                        {step === 3 && (
                            <div className="flex flex-col gap-4">
                                <form.Field name="skills">
                                    {(field) => (
                                        <div className="flex flex-col gap-3">
                                            <p className="text-sm text-gray-500">
                                                Выбрано:{" "}
                                                <span className="font-medium text-gray-900">
                                                    {field.state.value.length > 0 ? field.state.value.join(", ") : "ничего не выбрано"}
                                                </span>
                                            </p>
                                            <div className="relative">
                                                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                <input
                                                    placeholder="Название навыка"
                                                    value={skillSearch}
                                                    onChange={(e) => setSkillSearch(e.target.value)}
                                                    className="w-full h-9 pl-9 pr-3 rounded-lg border border-input bg-transparent text-sm outline-none"
                                                />
                                            </div>

                                            <Accordion type="single" collapsible className="flex flex-col gap-2">
                                                {Object.entries(SKILLS_BY_CATEGORY).map(([category, skills]) => {
                                                    const filtered = skills.filter((s) =>
                                                        s.toLowerCase().includes(skillSearch.toLowerCase())
                                                    )
                                                    if (filtered.length === 0) return null
                                                    return (
                                                        <AccordionItem
                                                            key={category}
                                                            value={category}
                                                            className="border border-gray-200 rounded-xl px-4"
                                                        >
                                                            <AccordionTrigger className="font-medium text-sm">
                                                                {category}
                                                            </AccordionTrigger>
                                                            <AccordionContent>
                                                                <div className="flex flex-wrap gap-2 pb-2">
                                                                    {filtered.map((skill) => {
                                                                        const selected = field.state.value.includes(skill)
                                                                        return (
                                                                            <button
                                                                                key={skill}
                                                                                type="button"
                                                                                onClick={() => {
                                                                                    if (selected) {
                                                                                        field.handleChange(field.state.value.filter((s) => s !== skill))
                                                                                    } else {
                                                                                        field.handleChange([...field.state.value, skill])
                                                                                    }
                                                                                }}
                                                                                className={cn(
                                                                                    "px-3 py-1.5 rounded-xl text-sm border transition-colors",
                                                                                    selected
                                                                                        ? "bg-blue-100 text-blue-600 border-blue-600"
                                                                                        : "bg-white border-gray-200 hover:bg-gray-50"
                                                                                )}
                                                                            >
                                                                                {skill}
                                                                            </button>
                                                                        )
                                                                    })}
                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    )
                                                })}
                                            </Accordion>

                                            {stepErrors.skills && <p className="text-destructive text-sm">{stepErrors.skills}</p>}
                                        </div>
                                    )}
                                </form.Field>
                            </div>
                        )}

                        {step === 4 && (
                            <div className="flex flex-col gap-4">
                                <form.Field name="contact">
                                    {(field) => (
                                        <Input
                                            className="bg-gray-50 rounded-lg p-3 h-auto"
                                            placeholder="Telegram (@username)"
                                            value={field.state.value}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            errors={stepErrors.contact ? [stepErrors.contact] : []}
                                        />
                                    )}
                                </form.Field>
                            </div>
                        )}

                        <div className="flex gap-2 mt-6 justify-end">
                            {step > 0 && (
                                <Button className="py-2 px-4 h-auto" type="button" variant="outline" onClick={handleBack}>
                                    Назад
                                </Button>
                            )}
                            {step < STEPS.length - 1 ? (
                                <Button className="py-2 px-4 h-auto" type="button" onClick={handleNext}>
                                    Далее
                                </Button>
                            ) : (
                                <Button className="py-2 px-4 h-auto" type="submit" disabled={createMutation.isPending}>
                                    {createMutation.isPending ? "Сохраняем..." : "Завершить"}
                                </Button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
