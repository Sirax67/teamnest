import { z } from "zod/v4"


export const stageEnum = z.enum(["Идея", "Разработка", "Запуск"], {
    message: "Выберите стадию проекта"
})


export const StartupsSchema = z.object ({
    logo: z.string().optional(),
    name: z.string({message: "Введите название стартапа"}).min(2, {message: "Название слишком короткое"}).max(255, {message: "Название слишком длинное"}),
    description: z.string({message: "Напишите описание стартапа"}).min(5, {message: "Описание слишком короткое"}).max(500, {message: "Описание слишком длинное"}),
    link: z.string({message: "Укажите ссылку на стартап"}).min(10, {message: "Ссылка слишком короткая"}).max(255, {message: "Ссылка слишком длинная"}),
    startDate: z.string({message: "Укажите дату начала стартапа"}).min(1),
    stage: stageEnum,
    sectorId: z.string({message:"Выберите сектор"}),
}) 