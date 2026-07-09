"use client"

import { Bell, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "../../lib/client/api";
import { useQuery } from "@tanstack/react-query";
import { EditPersonnelDialog } from "@/src/components/personnel/EditPersonnelDialog";
import { useRouter } from "next/navigation";

export default function ProfileMainPage() {
    const { data: personnel, isLoading } = useQuery({
        queryKey: ["personnel-me"],
        queryFn: async () => (await api.personnel.me.get()).data,
    })
    const router = useRouter();

    if (!isLoading && !personnel) {
        router.replace("/onboarding")
    }

    return (
        <div className="py-20 md:mr-16 md:ml-60 flex flex-col gap-12 px-4 ">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl md:text-3xl font-semibold">Мой профиль</h1>
                {personnel && <EditPersonnelDialog personnel={personnel} />}
            </div>

            {isLoading && (
                <div className="flex items-center justify-center py-32 text-gray-500">
                    Загружаем...
                </div>
            )}

           

            {!isLoading && personnel && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-4 border border-gray-200 rounded-2xl p-4">
                            <div className="flex gap-4 items-center">
                                <img
                                    src={personnel.avatar ? `/api/files/${personnel.avatar}` : "/images/default-avatar.svg"}
                                    onError={(e) => { e.currentTarget.src = "/images/default-avatar.svg" }}
                                    alt=""
                                    className="w-15 aspect-square rounded-full object-cover object-center"
                                />
                                <div className="flex flex-col gap-1">
                                    <p className="text-xl font-semibold">{personnel.name}</p>
                                    <p className="text-sm text-gray-500">{(personnel as any).specialty?.name}</p>
                                    <p className="text-sm text-gray-500 flex items-center gap-2">
                                        {personnel.city}
                                        <Circle className="size-1 fill-gray-500" />
                                        {personnel.age} лет
                                    </p>
                                </div>
                            </div>
                            <hr className="border-gray-200" />
                            <div className="flex flex-col gap-1">
                                <p className="font-semibold">Краткое резюме</p>
                                <p className="text-sm text-gray-500">{personnel.summary}</p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 border border-gray-200 rounded-2xl p-4">
                            <p className="font-semibold">Навыки</p>
                            <div className="flex flex-wrap gap-2">
                                {personnel.skills.map((skill) => (
                                    <span key={skill} className="bg-gray-100 rounded-2xl px-3 py-1 text-sm">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 border border-gray-200 rounded-2xl p-4">
                            <p className="font-semibold">Образование</p>
                            <div className="border border-gray-200 bg-gray-50 flex flex-col gap-2 rounded-2xl p-4">
                                <p className="font-semibold">{personnel.institution}</p>
                                <div className="text-gray-500 text-sm">
                                    <p>{personnel.faculty}</p>
                                    <p>{personnel.period}</p>
                                    <p>{personnel.position}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
