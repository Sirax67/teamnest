import { z } from "zod/v4"

export const sectorEnum = z.enum(["IT", "Финансы", "Здравоохранение", "Образование"], {message: "Введите отрасль"})
export const SectorSchema = z.object({
    name: sectorEnum,
});