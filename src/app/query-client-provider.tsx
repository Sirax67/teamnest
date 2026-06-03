"use client";

import { QueryClientContext } from "@tanstack/react-query";
import { queryClient } from "./lib/client/query-client";

export function QueryClientProvider({children}: {children: React.ReactNode}) {
    return (
        <QueryClientContext value={queryClient}>{children}</QueryClientContext>
    )
}