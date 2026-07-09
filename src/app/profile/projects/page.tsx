"use client"

import { Button } from "@/components/ui/button";
import { FolderOpen, CalendarDays, Trash2 } from "lucide-react";
import { CreateUpdateStartup } from "@/src/components/startups/create-update";
import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "@/src/app/lib/client/api";
import { queryClient } from "@/src/app/lib/client/query-client";
import { toast } from "sonner";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

type Startup = NonNullable<Awaited<ReturnType<typeof api.startups.me.get>>["data"]>[number]

function DeleteStartup({ startup }: { startup: Startup }) {
    const deleteMutation = useMutation({
        mutationFn: async () => {
            await api.startups({ id: startup.id }).delete()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["startups-me"] })
            toast.success("Стартап удалён")
        },
    })

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="icon" className="text-red-500 cursor-pointer hover:text-red-600">
                    <Trash2 className="w-4 h-4" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Удалить стартап</DialogTitle>
                </DialogHeader>
                <p>Вы уверены, что хотите удалить <span className="font-medium">{startup.name}</span>?</p>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Отмена</Button>
                    </DialogClose>
                    <Button variant="destructive" onClick={() => deleteMutation.mutate()} disabled={deleteMutation.isPending}>
                        Удалить
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default function ProfileProjectsPage() {
    const { data: startups, isLoading } = useQuery({
        queryKey: ["startups-me"],
        queryFn: async () => (await api.startups.me.get()).data,
    })

    return (
        <div className="py-20 md:mr-16 md:ml-60 flex flex-col gap-12 px-4">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl md:text-3xl font-semibold">Мои стартапы</h1>
                <CreateUpdateStartup />
            </div>

            {isLoading && (
                <div className="flex items-center justify-center py-32 text-gray-400">
                    Загружаем...
                </div>
            )}

            {!isLoading && (!startups || startups.length === 0) && (
                <div className="flex flex-col items-center justify-center gap-4 py-32 text-center">
                    <FolderOpen className="w-16 h-16 text-gray-200" strokeWidth={1} />
                    <p className="text-gray-400">Проекты пока не добавлены</p>
                    <CreateUpdateStartup label="Создать первый проект" />
                </div>
            )}

            {!isLoading && startups && startups.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {startups.map((startup) => (
                        <div key={startup.id} className="flex flex-col rounded-2xl border border-gray-200 hover:translate-y-[-8px] hover:shadow-lg transition-all duration-300">
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
                                        <p className="text-gray-600 text-sm">{startup.description}</p>
                                        <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-white to-transparent" />
                                    </div>
                                </div>
                                <hr className="border-gray-200" />
                                <div className="flex items-center justify-between flex-wrap gap-2">
                                    <div className="flex items-center gap-2">
                                        <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 text-sm">
                                            <CalendarDays className="size-4" />
                                            {new Date(startup.startDate).toLocaleDateString("ru-RU")}
                                        </span>
                                        <span className="block px-2 py-1 rounded-full bg-gray-100 text-sm">{startup.stage}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <CreateUpdateStartup startup={startup as any} />
                                        <DeleteStartup startup={startup} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
