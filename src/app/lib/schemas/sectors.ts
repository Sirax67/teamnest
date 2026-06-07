import { z } from "zod/v4"


export const SectorSchema = z.object({
    name: z.string({message: "Введите название сектора"}).min(2, {message: "Название слишком короткое"}).max(50, {message: "Название слишком длинное"}),
});