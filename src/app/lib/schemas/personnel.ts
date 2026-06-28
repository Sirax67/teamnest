import { z } from "zod/v4"

export const PersonnelSchema = z.object({
    avatar: z.string().optional(),
    name: z.string({message: "Введите ФИО"}).min(3, {message: "ФИ слишком короткое"}).max(255, {message: "ФИ слишком длинное"}),
    position: z.string({message: "Введите должность"}),
    city: z.string({message: "Введите город"}).min(2, {message: "Название города слишком короткое"}).max(168, {message: "Название города слишком длинное"}),
    age: z.number({message: "Введите свой возраст"}).int({message: "Возраст должен быть целым числом"}).min(14, {message: "Минимальный возраст — 14 лет"}).max(100, {message: "Максимальный возраст — 100 лет"}),
    summary: z.string({message: "Введите краткое резюме"}).min(2, {message: "Минимум 2 символа"}).max(1000, {message: "Резюме слишком длинное"}),
    institution: z.string({message:"Укажите учебное заведение"}).min(2, {message:"Название слишком короткое"}).max(255,{message: "Название слишком длинное"}),
    faculty: z.string({message:"Укажите факультет"}).min(2, {message:"Название слишком короткое"}).max(255,{message: "Название слишком длинное"}),
    period: z.string({message: "Укажите период обучения (например, 2022-2026)"}).length(9, {message: "Неверный формат"}),
    skills: z.array(z.string()).min(1, {message: "Добавьте хотя бы один навык"}),
    contact: z.string({message: "Введите контакт для связи"}).min(3, {message: "Контакт слишком короткий"}).max(255, {message: "Контакт слишком длинный"}),
    categoryId: z.string({message: "Выберите категорию"}),
    specialtiesId: z.string({message: "Выберите спеециальность"}),
})