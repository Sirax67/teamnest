import type { api } from "@/src/server/api";

export type Startup = NonNullable<
    Awaited<ReturnType<typeof api.startups.get>>["data"]
>[number];