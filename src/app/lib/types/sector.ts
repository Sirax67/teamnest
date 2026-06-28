import type { api } from "@/src/server/api";

export type Sector = NonNullable<
    Awaited<ReturnType<typeof api.sectors.get>>["data"]
>[number];