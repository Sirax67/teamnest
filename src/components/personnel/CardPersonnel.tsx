"use client"

import { api } from "@/src/app/lib/client/api";
import { useQuery } from "@tanstack/react-query"
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Circle, Send } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type Personnel = NonNullable<Awaited<ReturnType<typeof api.personnel.get>>["data"]>[number]

function PersonnelDialog({ personnel, open, onClose }: { personnel: Personnel, open: boolean, onClose: () => void }) {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="md:min-w-125">
                <DialogHeader className="fixed bg-gray-100 p-4 w-full rounded-t-xl">
                    <DialogTitle>Просмотр кадра</DialogTitle>
                </DialogHeader>
                
                <div className="pt-14 flex flex-col gap-4">

                
                <div className="flex items-center gap-3">
                    <img
                        src={personnel.avatar ? `/api/files/${personnel.avatar}` : "/images/default-avatar.png"}
                        onError={(e) => { e.currentTarget.src = "/images/default-avatar.png" }}
                        alt=""
                        className="w-12 aspect-square rounded-full object-cover object-center"
                    />
                    <div>
                        <p className="font-medium text-xl">{personnel.name}</p>
                        <p className="text-gray-500 text-sm">{personnel.position}</p>
                    </div>
                </div>
                
                

                <p className="text-sm text-gray-500 flex items-center gap-1">
                    {personnel.city}
                    <Circle className="size-1 fill-gray-600"/>
                    {personnel.age} лет
                </p>

                <div className="flex flex-col gap-1">
                    <p className="font-medium text-xl">Краткое резюме</p>
                    <p className="text-sm text-gray-600">{personnel.summary}</p>
                </div>


                <div className="flex flex-col gap-1">
                    <p className="font-medium text-xl">Образование</p>
                    <ul className="text-sm text-gray-600 flex flex-col">
                        <li className="flex items-center gap-1">
                            <Circle className="size-1 fill-gray-600"/> 
                            {personnel.period}
                        </li>
                        <li className="flex items-center gap-1">
                            <Circle className="size-1 fill-gray-600"/> 
                            {personnel.institution}
                        </li>
                        <li className="flex items-center gap-1">
                            <Circle className="size-1 fill-gray-600"/> 
                            {personnel.faculty}
                        </li>
                    </ul>
                </div>

                <hr className="border-gray-100" />

                <div className="flex flex-wrap gap-2">
                    {personnel.skills.map((skill) => (
                        <span key={skill} className="bg-gray-100 rounded-2xl px-3 py-1 text-sm">
                            {skill}
                        </span>
                    ))}
                </div>
                
                <hr className="border-gray-100" />

                {personnel.contact && (
                    <div className="flex items-center gap-2 text-sm">
                        <Link href="/" className="size-8 relative">
                            <Image
                            src="/images/icons/Telegram.svg"
                            alt="vk"
                            fill
                            ></Image>
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
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default function CardPersonnel() {
    const [selected, setSelected] = useState<Personnel | null>(null)

    const { data: personnel } = useQuery({
        queryKey: ["personnel"],
        queryFn: async () => (await api.personnel.get()).data,
    })

    return (
        <>
            {personnel?.map((person) => (
                <div
                    key={person.id}
                    onClick={() => setSelected(person)}
                    className="cursor-pointer h-62 flex flex-col gap-4 p-4 rounded-2xl bg-gray-100 border border-gray-200 hover:translate-y-[-8px] hover:shadow-[inset_0_-6px_0_0_#DDDEDF] transition-all duration-300"
                >
                    <div className="flex items-center gap-2">
                        <img
                            src={person.avatar ? `/api/files/${person.avatar}` : "/images/default-avatar.png"}
                            onError={(e) => { e.currentTarget.src = "/images/default-avatar.png" }}
                            alt=""
                            className="w-10 h-10 rounded-full object-cover object-center"
                        />
                        <div>
                            <p>{person.name}</p>
                            <p className="text-gray-600 text-sm">{person.position}</p>
                        </div>
                    </div>

                    <div className="relative overflow-hidden h-30">
                        <p className="text-gray-600">{person.summary}</p>
                        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-gray-100 to-transparent" />
                    </div>

                    <div className="flex flex-col gap-4">
                        <hr className="border-gray-200" />
                        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                            {person.skills.map((skill) => (
                                <p key={skill} className="bg-gray-200 rounded-2xl px-2 py-1 text-sm whitespace-nowrap">
                                    {skill}
                                </p>
                            ))}
                        </div>
                    </div>
                </div>
            ))}

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
