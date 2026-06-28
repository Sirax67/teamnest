import type { api } from "@/src/server/api";

export type Person = NonNullable<
    Awaited<ReturnType<typeof api.personnel.get>>["data"]
>[number];