import type { api } from "@/src/server/api";

export type Specialty = NonNullable<
    Awaited<ReturnType<typeof api.specialties.get>>["data"]
>[number];