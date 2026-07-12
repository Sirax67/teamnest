"use client"

import { api } from "../../lib/client/api"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Star, CalendarDays, Circle } from "lucide-react"
import { StartupDialog } from "@/src/components/startups/CardStartup"
import { PersonnelDialog } from "@/src/components/personnel/CardPersonnel"

export default function FavoritesPage() {
    const [tab, setTab] = useState<"all" | "personnel" | "startups">("all")
    const [selectedStartup, setSelectedStartup] = useState<any | null>(null)
    const [selectedPersonnel, setSelectedPersonnel] = useState<any | null>(null)
    const qc = useQueryClient()

    const { data: favData, isLoading } = useQuery({
        queryKey: ["favorites"],
        queryFn: async () => (await api.favorites.get()).data,
    })

    const { mutate: removeFav } = useMutation({
        mutationFn: async (targetId: string) => {
            await api.favorites({ targetId }).delete()
        },
        onSuccess: () => qc.invalidateQueries({ queryKey: ["favorites"] }),
    })

    const favStartups: any[] = favData?.startups ?? []
    const favPersonnel: any[] = favData?.personnel ?? []

    const tabs = [
        { id: "all" as const, label: "Все" },
        { id: "personnel" as const, label: `Кандидаты (${favPersonnel.length})` },
        { id: "startups" as const, label: `Стартапы (${favStartups.length})` },
    ]

    const showStartups = tab === "all" || tab === "startups"
    const showPersonnel = tab === "all" || tab === "personnel"

    return (
        <div className="py-20 md:mr-16 md:ml-60 flex flex-col gap-6 px-4">
            <h1 className="text-2xl md:text-3xl font-semibold">Избранное</h1>

            <div className="w-full flex-col flex md:flex-row items-center gap-2 bg-card rounded-xl p-1 md:w-fit">
                {tabs.map(t => (
                    <button
                        key={t.id}
                        onClick={() => setTab(t.id)}
                        className={cn(
                            "px-4 py-2 rounded-xl text-sm transition-colors w-full md:w-fit",
                            tab === t.id ? "bg-white shadow-sm font-medium" : "text-muted-foreground hover:text-black"
                        )}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            {isLoading && (
                <div className="flex items-center justify-center py-32 text-muted-foreground">
                    Загружаем...
                </div>
            )}

            {!isLoading && favStartups.length === 0 && favPersonnel.length === 0 && (
                <div className="flex flex-col items-center justify-center gap-4 py-32 text-center">
                    <Star className="w-16 h-16 text-gray-200" strokeWidth={1} />
                    <p className="font-medium">Пока ничего не сохранено</p>
                    <p className="text-muted-foreground text-sm max-w-[35ch]">Добавляйте кадры и стартапы в избранное из каталогов</p>
                </div>
            )}

            {showStartups && favStartups.length > 0 && (
                <div className="flex flex-col gap-3">
                    {tab === "all" && <p className="font-medium text-muted-foreground ">Стартапы</p>}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {favStartups.map((startup) => (
                            <div
                                key={startup.id}
                                onClick={() => setSelectedStartup(startup)}
                                className="cursor-pointer flex flex-col rounded-2xl bg-card border border-border hover:translate-y-[-4px] hover:shadow-lg transition-all duration-300"
                            >
                                <div className="relative">
                                    <img
                                        src={startup.logo ? `/api/files/${startup.logo}` : "/images/default-startup.png"}
                                        onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/images/default-startup.png" }}
                                        alt=""
                                        className="w-full h-48 rounded-t-2xl object-cover object-center"
                                    />
                                    <button
                                        onClick={(e) => { e.stopPropagation(); removeFav(startup.id) }}
                                        className="absolute top-4 left-4  cursor-pointer"
                                    >
                                        <Star className="size-5 fill-yellow-400 text-yellow-400 hover:scale-110" />
                                    </button>
                                    {startup.sector?.name && (
                                        <span className="absolute top-4 right-4 text-sm px-2 py-1 rounded-full bg-black/30 text-white backdrop-blur-sm">
                                            {startup.sector.name}
                                        </span>
                                    )}
                                </div>
                                <div className="p-4 flex flex-col gap-3">
                                    <h3 className="font-semibold">{startup.name}</h3>
                                    <p className="text-gray-600 text-sm line-clamp-2">{startup.description}</p>
                                    <hr className="border-border" />
                                    <div className="flex items-center gap-2">
                                        <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-border text-sm">
                                            <CalendarDays className="size-4" />
                                            {new Date(startup.startDate).toLocaleDateString("ru-RU")}
                                        </span>
                                        <span className="px-2 py-1 rounded-full bg-border text-sm">{startup.stage}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {showPersonnel && favPersonnel.length > 0 && (
                <div className="flex flex-col gap-3">
                    {tab === "all" && <p className="font-medium text-muted-foreground ">Кандидаты</p>}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {favPersonnel.map((person) => (
                            <div
                                key={person.id}
                                onClick={() => setSelectedPersonnel(person)}
                                className="cursor-pointer flex flex-col gap-4 p-4 rounded-2xl border bg-card hover:translate-y-[-4px] hover:shadow-lg transition-all duration-300 relative"
                            >
                                <button
                                    onClick={(e) => { e.stopPropagation(); removeFav(person.id) }}
                                    className="absolute top-4 right-4 z-10 cursor-pointer"
                                >
                                    <Star className="size-5 fill-yellow-400 text-yellow-400 hover:scale-110" />
                                </button>
                                <div className="flex items-center gap-2">
                                    <img
                                        src={person.avatar ? `/api/files/${person.avatar}` : "/images/default-avatar.svg"}
                                        onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/images/default-avatar.svg" }}
                                        alt=""
                                        className="w-10 h-10 rounded-full object-cover object-center"
                                    />
                                    <div>
                                        <p className="font-medium">{person.name}</p>
                                        <p className="text-muted-foreground text-sm">{person.specialty?.name ?? person.position}</p>
                                    </div>
                                </div>
                                <p className="text-sm text-muted-foreground flex items-center gap-1">
                                    {person.city}
                                    <Circle className="size-1 fill-muted-fotext-muted-foreground" />
                                    {person.age} лет
                                </p>
                                <p className="text-gray-600 text-sm line-clamp-3">{person.summary}</p>
                                <div className="flex flex-wrap gap-2 mt-auto">
                                    {person.skills?.slice(0, 3).map((skill: string) => (
                                        <span key={skill} className="bg-border rounded-2xl px-2 py-1 text-xs">{skill}</span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {selectedStartup && (
                <StartupDialog
                    startups={selectedStartup}
                    open={!!selectedStartup}
                    onClose={() => setSelectedStartup(null)}
                />
            )}
            {selectedPersonnel && (
                <PersonnelDialog
                    personnel={selectedPersonnel}
                    open={!!selectedPersonnel}
                    onClose={() => setSelectedPersonnel(null)}
                />
            )}
        </div>
    )
}
