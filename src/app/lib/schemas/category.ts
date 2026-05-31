import { z } from "zod/v4"

export const categoryEnum = z.enum(["Разработка", "Дизайн", "Управление", "Маркетинг"], {message: "Введите категорию"})
export const CategorySchema = z.object({
    name: categoryEnum,
});