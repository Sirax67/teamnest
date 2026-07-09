"use client"

import CardStartup from "@/src/components/startups/CardStartup";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/client/api";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

import type { Sector } from "@/src/app/lib/types/sector"

const STAGES = ["Идея", "Разработка", "Запуск"] as const

export default function Startups() {
    const [sectorId, setSectorId] = useState("")
    const [stage, setStage] = useState("")
    const [search, setSearch] = useState("")

    const { data: sectors } = useQuery({
        queryKey: ["sectors"],
        queryFn: async () => (await api.sectors.get()).data,
    })

    const { data: startups, isLoading } = useQuery({
        queryKey: ["startups"],
        queryFn: async () => (await api.startups.get()).data,
    })

    const filtered = startups?.filter(s => {
        if (sectorId && sectorId !== "all" && s.sectorId !== sectorId) return false
        if (stage && stage !== "all" && s.stage !== stage) return false
        if (search && !s.name.toLowerCase().includes(search.toLowerCase())) return false
        return true
    })

    const hasActiveFilters = (sectorId && sectorId !== "all") || (stage && stage !== "all") || search.length > 0

    return (
        <div className="py-12 px-16 my-20 flex flex-col gap-12 container mx-auto">

            <div className="flex flex-col gap-4 justify-center text-center items-center w-full">
               <h1 className=" font-semibold text-[clamp(24px,5vw,28px)] md:text-4xl lg:text-6xl bg-clip-text text-transparent bg-gradient-to-br from-muted-foreground via-foreground to-muted-foreground max-w-[35ch]">
                    Стартапы в поисках команды
                </h1>
                <p className="lg:text-xl text-muted-foreground max-w-[60ch] mx-auto">Если вы ищете человека в команду, разместите информацию о вашем проекте в каталоге, чтобы её смогли найти соискатели</p>
            </div>

            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
                <Select
                    value={sectorId}
                    onValueChange={val => setSectorId(val)}
                >
                    <SelectTrigger className="w-full py-5 px-4 bg-card">
                        <SelectValue placeholder="Отрасль" />
                    </SelectTrigger>
                    <SelectContent side="bottom" avoidCollisions={false}>
                        <SelectItem value="all" className="py-4 px-4">Все отрасли</SelectItem>
                        {(sectors as Sector[])?.map((s) => (
                            <SelectItem className="py-4 px-4" key={s.id} value={s.id}>{s.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select value={stage} onValueChange={setStage}>
                    <SelectTrigger className="w-full py-5 px-4 bg-card">
                        <SelectValue placeholder="Стадия" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all" className="py-4 px-4">Все стадии</SelectItem>
                        {STAGES.map(s => (
                            <SelectItem key={s} value={s} className="py-4 px-4">{s}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <div className="
                    relative flex items-center justify-between 
                    md:col-start-4 
                    w-full 
                    border border-border 
                    rounded-lg py-2 px-4
                    outline-none focus:border-gray-400 
                    bg-card">
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Поиск проектов"
                        className="focus:border-none focus:outline-none"
                        
                    />
                    <Search className="text-muted-foreground/60 size-5" />
                </div>
            </div>

            {isLoading ? (
                <div className="text-muted-foreground text-center py-20">
                    <p>Загрузка стартапов...</p>
                </div>
            ) : startups?.length === 0 ? (
                <div className="text-muted-foreground text-center py-20">
                    <p>Стартапов пока нет</p>
                </div>
            ) : hasActiveFilters && filtered?.length === 0 ? (
                <div className="text-muted-foreground text-center py-20">
                    <p>Ничего не найдено по заданным параметрам</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    <CardStartup filters={{ sectorId, stage, search }} />
                </div>
            )}
        </div>
    )
}
