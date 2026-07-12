"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { api } from "@/src/app/lib/client/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { CalendarDays, Star } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

import type { Startup } from "@/src/app/lib/types/startup"

export function StartupDialog({ startups, open, onClose }: { startups: Startup, open: boolean, onClose: () => void }) {
    const [view, setView] = useState<"project" | "vacancies">("project")
    const [selectedVacancyId, setSelectedVacancyId] = useState<string | null>(null)
    const qc = useQueryClient()

    const { data: detail } = useQuery({
        queryKey: ["startup-detail", startups.id],
        queryFn: async () => (await api.startups({ id: startups.id }).get()).data,
        enabled: open,
    })

    const { data: favData } = useQuery({
        queryKey: ["favorites"],
        queryFn: async () => (await api.favorites.get()).data,
        retry: false,
    })
    const isFav = favData?.ids?.includes(startups.id) ?? false

    

    const { mutate: toggleFav } = useMutation({
        mutationFn: async () => {
            if (isFav) {
                await api.favorites({ targetId: startups.id }).delete()
            } else {
                await api.favorites.post({ type: "startup", targetId: startups.id })
            }
        },
        onSuccess: () => qc.invalidateQueries({ queryKey: ["favorites"] }),
    })

    const vacancies: any[] = (detail as any)?.vacancies ?? []

    const { mutate: apply, isPending } = useMutation({
        mutationFn: async () => {
            await api.applications.post({
                vacancyId: selectedVacancyId!,
                startupId: startups.id,
            })
        },
        onSuccess: () => toast.success("Отклик отправлен!"),
        onError: () => toast.error("Ошибка при отклике"),
    })

    const handleClose = () => {
        setView("project")
        setSelectedVacancyId(null)
        onClose()
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="md:min-w-155 p-0 gap-0 max-h-[80vh] overflow-y-auto">
                <DialogHeader className="bg-card p-4 rounded-t-xl ">
                    <DialogTitle>{view === "project" ? "Просмотр стартапа" : "Просмотр вакансий"}</DialogTitle>
                </DialogHeader>

                {view === "project" && (
                    <div className="flex flex-col gap-4">
                        <div className="relative h-64">
                            <img
                                src={startups.logo ? `/api/files/${startups.logo}` : "/images/default-startup.png"}
                                onError={(e) => { e.currentTarget.src = "/images/default-startup.png" }}
                                alt=""
                                className="w-full h-64 object-cover object-center"
                            />
                            {(startups as any).sector?.name && (
                                <span className="absolute top-4 right-4 text-sm px-2 py-1 rounded-full bg-black/30 text-white backdrop-blur-sm">
                                    {(startups as any).sector.name}
                                </span>
                            )}
                        </div>
                        <div className="p-4 flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <p className="font-medium text-xl">{startups.name}</p>
                            <button onClick={() => toggleFav()} className="cursor-pointer shrink-0 hover:scale-110">
                                <Star className={cn("size-5", isFav ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground")} />
                            </button>
                        </div>
                        <div className="flex flex-col gap-1">
                            <p className="font-medium">Описание</p>
                            <p className="text-sm text-muted-foreground">{startups.description}</p>
                        </div>
                        <div className="flex flex-col gap-1">
                            <p className="flex gap-2 text-muted-foreground">
                                Стадия проекта:
                                <span className="italic font-semibold text-black">{startups.stage}</span>
                            </p>
                            <p className="flex gap-2 text-muted-foreground">
                                Проект:
                                <Link href={startups.link} className="underline text-blue-600 break-all">
                                    {startups.link}
                                </Link>
                            </p>
                            <p className="flex gap-2 text-muted-foreground">
                                Дата начала:
                                <span className="text-black">{new Date(startups.startDate).toLocaleDateString("ru-RU")}</span>
                            </p>
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={() => setView("vacancies")}
                                className="bg-primary text-white text-sm px-5 py-2.5 rounded-xl hover:bg-primary/90 transition cursor-pointer"
                            >
                                Смотреть вакансии
                            </button>
                        </div>
                        </div>
                    </div>
                )}

                {view === "vacancies" && (
                    <div className="flex flex-col gap-4 p-4">
                        {vacancies.length === 0 && (
                            <p className="text-sm text-gray-400 text-center py-8">Вакансий нет</p>
                        )}
                        <div className="grid lg:grid-cols-2 gap-3">
                            {vacancies.map((v: any) => (
                                <div
                                    key={v.id}
                                    onClick={() => setSelectedVacancyId(v.id)}
                                    className={cn(
                                        "border rounded-xl p-4 cursor-pointer flex flex-col gap-1 transition-colors",
                                        selectedVacancyId === v.id ? "border-blue-500 bg-blue-50" : "border-border hover:border-gray-300"
                                    )}
                                >
                                    <p className="font-semibold ">{v.specialty?.name ?? v.category?.name ?? "Другое"}</p>
                                    {v.category?.name && v.specialty?.name && (
                                        <p className="text-xs text-muted-foreground">{v.category.name}</p>
                                    )}
                                    {v.description && (
                                        <p className=" text-muted-foreground line-clamp-4">{v.description}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-end gap-4">
                            <button
                                type="button"
                                onClick={() => { setView("project"); setSelectedVacancyId(null) }}
                                className="border border-border text-sm px-5 py-2.5 rounded-xl hover:bg-card transition cursor-pointer"
                            >
                                Назад
                            </button>
                            <button
                                type="button"
                                disabled={!selectedVacancyId || isPending}
                                onClick={() => apply()}
                                className="bg-primary text-white text-sm px-4 py-3 rounded-xl hover:bg-primary/90 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                {isPending ? "Отправляем..." : "Откликнуться"}
                            </button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}

type Filters = { sectorId?: string; stage?: string; search?: string }

export default function CardStartup({ filters }: { filters?: Filters } = {}) {
    const { data: startupsData } = useQuery({
        queryKey: ["startups"],
        queryFn: async () => (await api.startups.get()).data,
    })

    const startups = startupsData?.filter(s => {
        if (filters?.sectorId && filters.sectorId !== "all" && s.sectorId !== filters.sectorId) return false
        if (filters?.stage && filters.stage !== "all" && s.stage !== filters.stage) return false
        if (filters?.search && !s.name.toLowerCase().includes(filters.search.toLowerCase())) return false
        return true
    })
    const { data: favData } = useQuery({
        queryKey: ["favorites"],
        queryFn: async () => (await api.favorites.get()).data,
        retry: false,
    })
    const qc = useQueryClient()
    const [selected, setSelected] = useState<Startup | null>(null)

    const { mutate: toggleFav } = useMutation({
        mutationFn: async ({ id, isFav }: { id: string; isFav: boolean }) => {
            if (isFav) {
                await api.favorites({ targetId: id }).delete()
            } else {
                await api.favorites.post({ type: "startup", targetId: id })
            }
        },
        onSuccess: () => qc.invalidateQueries({ queryKey: ["favorites"] }),
    })

    return (
        <>
            {startups?.map((startup) => {
                const isFav = favData?.ids?.includes(startup.id) ?? false
                return (
                <div key={startup.id} onClick={() => setSelected(startup)} className="cursor-pointer flex flex-col rounded-2xl bg-card border border-border hover:translate-y-[-8px] hover:shadow-lg transition-all duration-300">
                    <div className="relative">
                        <img
                            src={startup.logo ? `/api/files/${startup.logo}` : "/images/default-startup.png"}
                            onError={(e) => { e.currentTarget.src = "/images/default-startup.png" }}
                            alt=""
                            className="w-full h-64 rounded-t-2xl object-cover object-center"
                        />
                       
                        {(startup as any).sector?.name && (
                            <span className="absolute top-4 right-4 text-sm px-2 py-1 rounded-full bg-black/30 text-white backdrop-blur-sm">
                                {(startup as any).sector.name}
                            </span>
                        )}
                    </div>
                    <div className="p-4 flex flex-col gap-4">
                        <div className="flex-1">
                            <div className="flex justify-between items-center">
                                <h3 className="font-semibold text-xl">{startup.name}</h3>
                                <button
                                    onClick={(e) => { e.stopPropagation(); toggleFav({ id: startup.id, isFav }) }}
                                    className="cursor-pointer hover:scale-110"
                                >
                                    <Star className={cn("size-5", isFav ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground")} />
                                </button>
                            </div>
                            <div className="relative h-20 overflow-hidden">
                                <p className="text-muted-foreground">
                                    {startup.description}
                                </p>
                                <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-card to-transparent" />
                            </div>
                        </div>
                        <hr className="border-border" />

                        <div className="flex items-center gap-2 mt-auto">
                            <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-border text-sm">
                                <CalendarDays className="size-4" />
                                {new Date(startup.startDate).toLocaleDateString("ru-RU")}
                            </span>
                            <span className="px-2 py-1 rounded-full bg-border text-sm">
                                {startup.stage}
                            </span>
                        </div>
                    </div>
                </div>
                )
            })}
            {selected && (
                <StartupDialog
                    startups={selected}
                    open={!!selected}
                    onClose={() => setSelected(null)}
                />
            )}
        </>
    )
}
