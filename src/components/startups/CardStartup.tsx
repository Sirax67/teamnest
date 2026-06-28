"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { api } from "@/src/app/lib/client/api";
import { useQuery } from "@tanstack/react-query"
import { CalendarDays } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type Startup = NonNullable<Awaited<ReturnType<typeof api.startups.get>>["data"]>[number]

function StartupDialog({ startups, open, onClose }: { startups: Startup, open: boolean, onClose: () => void }) {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="md:min-w-125">
                <DialogHeader className="fixed bg-gray-100 p-4 w-full rounded-t-xl">
                    <DialogTitle>Просмотр кадра</DialogTitle>
                </DialogHeader>
                
                <div className="pt-14 flex flex-col gap-4">

                    <div className="relative h-64">
                        <img
                            src={startups.logo ? `/api/files/${startups.logo}` : "/images/default-startup.png"}
                            onError={(e) => { e.currentTarget.src = "/images/default-startup.png" }}
                            alt=""
                            className="w-full h-64 rounded-t-2xl object-cover object-center"
                        />
                        {(startups as any).sector?.name && (
                            <span className="absolute top-4 right-4 text-sm px-2 py-1 rounded-full bg-black/30 text-white backdrop-blur-sm">
                                {(startups as any).sector.name}
                            </span>
                        )}
                    </div>
                    <p className="font-medium text-xl">{startups.name}</p>

                    <div className="flex flex-col gap-1">
                        <p className="font-medium">Описание</p>
                        <p className="text-sm text-gray-600">{startups.description}</p>
                    </div>


                    <div className="flex flex-col gap-1">
                        <p className="flex gap-2 text-gray-600">
                            Стадия проекта: 
                            <span className="italic font-semibold text-black">{startups.stage}</span>
                        </p>
                        <p className="flex gap-2 text-gray-600">
                            Проект:  
                            <Link href={startups.link} className="underline text-blue-600">
                                {startups.link}
                            </Link>
                        </p>
                        <p className="flex gap-2 text-gray-600">
                            Дата начала:  
                            <span className="text-black">{new Date(startups.startDate).toLocaleDateString("ru-RU")}</span>
                        </p>
                    </div>

                
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default function CardStartup() {
    const { data: startups } = useQuery({
        queryKey: ["startups"],
        queryFn: async () => (await api.startups.get()).data,
    })
    const [selected, setSelected] = useState<Startup | null>(null)
    

    return (
        <>
            {startups?.map((startup) => (
                <div key={startup.id} onClick={() => setSelected(startup)} className="cursor-pointer flex flex-col rounded-2xl bg-gray-100 border border-gray-200 hover:translate-y-[-8px] hover:shadow-lg transition-all duration-300">
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
                            <h3 className="font-semibold mb-1">{startup.name}</h3>
                            <div className="relative h-20 overflow-hidden">
                                <p className="text-gray-600 text-sm">
                                    {startup.description}
                                </p>
                                <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-gray-100 to-transparent" />
                            </div>
                        </div>

                        <hr className="border-gray-200" />
                        
                        <div className="flex items-center gap-2 mt-auto">
                            <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-gray-200 text-sm">
                                <CalendarDays className="size-4" />
                                {new Date(startup.startDate).toLocaleDateString("ru-RU")}
                            </span>
                            <span className="px-2 py-1 rounded-full bg-gray-200 text-sm">
                                {startup.stage}
                            </span>
                        </div>
                    </div>
                </div>
            ))}

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
