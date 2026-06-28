import type { api } from "@/src/server/api";

export type Category = NonNullable<
    Awaited<ReturnType<typeof api.categories.get>>["data"]
>[number];