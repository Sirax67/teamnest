import { z } from "zod/v4"

export const SpetialtiesSchema = z.object({
    name: z.string({message: "Введите название специальности"}).min(2, {message: "Название слишком короткое"}).max(50, {message: "Название слишком длинное"}),
    categoryId: z.string()
});