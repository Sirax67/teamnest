"use client"
import { api } from "@/src/app/lib/client/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Circle, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

import type { Person as Personnel } from "@/src/app/lib/types/person"
type MyStartup = NonNullable<Awaited<ReturnType<typeof api.startups.me.get>>["data"]>[number] & {
    sector?: { name: string }
}

export function PersonnelDialog({ personnel, open, onClose }: { personnel: Personnel, open: boolean, onClose: () => void }) {
    const [view, setView] = useState<"profile" | "invite">("profile")
    const [startupId, setStartupId] = useState("")
    const [vacancyId, setVacancyId] = useState("")

    const { data: myStartups } = useQuery({
        queryKey: ["startups-me"],
        queryFn: async () => (await api.startups.me.get()).data,
        enabled: view === "invite",
    })

    const { mutate: invite, isPending } = useMutation({
        mutationFn: async () => {
            await api.invitations.post({
                startupId,
                personnelId: personnel.id,
                vacancyId: vacancyId || undefined,
            })
        },
        onSuccess: () => {
            toast.success("Приглашение отправлено!")
            setView("profile")
            setStartupId("")
            setVacancyId("")
        },
        onError: () => toast.error("Ошибка при отправке"),
    })

    const handleClose = () => {
        setView("profile")
        setStartupId("")
        setVacancyId("")
        onClose()
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="md:min-w-155 max-h-[80vh] overflow-y-auto">
                <DialogHeader className="fixed bg-card p-4 w-full rounded-t-xl">
                    <DialogTitle>Просмотр кадра</DialogTitle>
                </DialogHeader>

                {view === "profile" && (
                    <div className="pt-14 flex flex-col gap-4">

                    <div className="flex items-center gap-3">
                        <img
                            src={personnel.avatar ? `/api/files/${personnel.avatar}` : "/images/default-avatar.svg"}
                            onError={(e) => { e.currentTarget.src = "/images/default-avatar.svg" }}
                            alt=""
                            className="w-12 aspect-square rounded-full object-cover object-center"
                        />
                        <div>
                            <p className="font-medium text-xl">{personnel.name}</p>
                            <p className="text-muted-foreground">{(personnel as any).specialty?.name}</p>
                        </div>
                    </div>


                    <p className="text-muted-foreground flex items-center gap-1">
                        {personnel.city}
                        <Circle className="size-1 fill-gray-600"/>
                        {personnel.age} лет
                    </p>
                    <div className="flex flex-col gap-1">
                        <p className="font-medium text-xl">Краткое резюме</p>
                        <p className="text-muted-foreground">{personnel.summary}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                        <p className="font-medium text-xl">Образование</p>
                        <ul className="text-gray-600 flex flex-col">
                            <li className="flex items-center gap-1">
                                <Circle className="size-1 fill-muted-foreground"/>
                                {personnel.period}
                            </li>
                            <li className="flex items-center gap-1">
                                <Circle className="size-1 fill-muted-foreground"/>
                                {personnel.institution}
                            </li>
                            <li className="flex items-center gap-1">
                                <Circle className="size-1 fill-muted-foreground"/>
                                {personnel.faculty}
                            </li>
                            <li className="flex items-center gap-1">
                                <Circle className="size-1 fill-muted-foreground"/>
                                {personnel.position}
                            </li>
                        </ul>
                    </div>
                    <hr className="border-border" />
                    <div className="flex flex-wrap gap-2">
                        {personnel.skills.map((skill) => (
                            <span key={skill} className="bg-border rounded-2xl px-3 py-1">
                                {skill}
                            </span>
                        ))}
                    </div>

                    <hr className="border-border" />
                    {personnel.contact && (
                        <div className="flex items-center gap-2">
                            <Link href="/" className="size-8 relative">
                                <Image src="/images/icons/Telegram.svg" alt="vk" fill></Image>
                            </Link>
                            <span>Telegram: </span>
                            <Link
                                href={`https://t.me/${personnel.contact.replace("@", "")}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-blue-500 hover:underline"
                            >
                                {personnel.contact}
                            </Link>
                        </div>
                    )}

                    <div className="flex justify-end">
                        <Button onClick={() => setView("invite")} className="cursor-pointer h-auto py-2">
                            Пригласить в проект
                        </Button>
                    </div>
                    </div>
                )}

                {view === "invite" && (
                    <div className="pt-14 flex flex-col gap-4">
                        {(!myStartups || (myStartups as MyStartup[]).length === 0) ? (
                            <p className=" text-gray-400 py-8 text-center">У вас нет стартапов для приглашения</p>
                        ) : (
                            <div className="grid lg:grid-cols-2 gap-3">
                                {(myStartups as MyStartup[]).map((s) => (
                                    <div
                                        key={s.id}
                                        onClick={() => setStartupId(s.id)}
                                        className={cn(
                                            "cursor-pointer rounded-2xl border overflow-hidden hover:shadow-lg transition-all",
                                            startupId === s.id ? "border-blue-500 " : "bg-gray-50"
                                        )}
                                    >
                                        <img
                                            src={s.logo ? `/api/files/${s.logo}` : "/images/default-startup.png"}
                                            onError={(e) => { e.currentTarget.src = "/images/default-startup.png" }}
                                            alt=""
                                            className="w-full h-50 object-cover"
                                        />
                                        <div className="p-4">
                                            <p className="font-medium text-xl">{s.name}</p>
                                            <p className="text-muted-foreground ">{s.sector?.name ?? ""}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="flex justify-end gap-3">
                            <Button variant="outline" onClick={() => { setView("profile"); setStartupId(""); setVacancyId("") }} className="cursor-pointer h-auto py-2">
                                Назад
                            </Button>
                            <Button disabled={!startupId || isPending} onClick={() => invite()} className="cursor-pointer h-auto py-2">
                                {isPending ? "Отправляем..." : "Пригласить"}
                            </Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}

type Filters = { categoryId?: string; specialtyId?: string }

export default function CardPersonnel({ filters, data: externalData }: { filters?: Filters, data?: Personnel[] } = {}) {

    const [selected, setSelected] = useState<Personnel | null>(null)
    
    const { data: fetchedPersonnel } = useQuery({
        queryKey: ["personnel"],
        queryFn: async () => (await api.personnel.get()).data,
    })
    const personnel = externalData ?? fetchedPersonnel
    

    const { data: favData } = useQuery({
        queryKey: ["favorites"],
        queryFn: async () => (await api.favorites.get()).data,
        retry: false,
    })

    const filtered = personnel?.filter(p => {
        if (filters?.categoryId && filters.categoryId !== "all" && p.categoryId !== filters.categoryId) return false
        if (filters?.specialtyId && filters.specialtyId !== "all" && p.specialtiesId !== filters.specialtyId) return false
        return true
    })
    const qc = useQueryClient()

    const { mutate: toggleFav } = useMutation({
        mutationFn: async ({ id, isFav }: { id: string; isFav: boolean }) => {
            if (isFav) {
                await api.favorites({ targetId: id }).delete()
            } else {
                await api.favorites.post({ type: "personnel", targetId: id })
            }
        },
        onSuccess: () => qc.invalidateQueries({ queryKey: ["favorites"] }),
    })

    return (
        <>
            {filtered?.map((person) => {
                const isFav = favData?.ids?.includes(person.id) ?? false
                return (
                <div
                    key={person.id}
                    onClick={() => setSelected(person)}
                    className="cursor-pointer h-62 flex flex-col gap-4 p-4 rounded-2xl bg-card border border-border hover:translate-y-[-8px] hover:shadow-[inset_0_-6px_0_0_#DDDEDF] transition-all duration-300"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <img
                                src={person.avatar ? `/api/files/${person.avatar}` : "/images/default-avatar.svg"}
                                onError={(e) => { e.currentTarget.src = "/images/default-avatar.svg" }}
                                alt=""
                                className="w-10 h-10 rounded-full object-cover object-center"
                            />
                            <div>
                                <p className="font-medium">{person.name}</p>
                                <p className="text-muted-foreground text-sm">{(person as any).specialty?.name}</p>
                            </div>
                        </div>
                        <button
                            onClick={(e) => { e.stopPropagation(); toggleFav({ id: person.id, isFav }) }}
                            className="cursor-pointer hover:scale-110"
                        >
                            <Star className={cn("size-5", isFav ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground")} />
                        </button>
                    </div>
                    <div className="relative overflow-hidden h-30">
                        <p className="text-muted-foreground">{person.summary}</p>
                        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-card to-transparent" />
                    </div>
                    <div className="flex flex-col gap-4">
                        <hr className="border-border" />
                        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                            {person.skills.map((skill) => (
                                <p key={skill} className="bg-border rounded-2xl px-2 py-1 text-sm whitespace-nowrap">
                                    {skill}
                                </p>
                            ))}
                        </div>
                    </div>
                </div>
                )
            })}
            {selected && (
                <PersonnelDialog
                    personnel={selected}
                    open={!!selected}
                    onClose={() => setSelected(null)}
                />
            )}
        </>
    )
}