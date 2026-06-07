import { z } from "zod/v4"


export const CategorySchema = z.object({
    name: z.string({message: "Введите название категории"}).min(2, {message: "Название слишком короткое"}).max(255, {message: "Название слишком длинное"}),
});