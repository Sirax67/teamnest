"use client"

import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "@/src/app/lib/client/api";
import { toast } from "sonner";
import { useState } from "react";
import { queryClient } from "@/src/app/lib/client/query-client";

type WithRelations<T> = T & {
    personnel?: { name: string }
    startup?: { name: string }
    vacancy?: { specialty?: { name: string }; category?: { name: string } }
}

type IncomingApp = WithRelations<NonNullable<Awaited<ReturnType<typeof api.applications.incoming.get>>["data"]>[number]>
type SentInv = WithRelations<NonNullable<Awaited<ReturnType<typeof api.invitations.sent.get>>["data"]>[number]>
type MyApp = WithRelations<NonNullable<Awaited<ReturnType<typeof api.applications.my.get>>["data"]>[number]>
type MyInv = WithRelations<NonNullable<Awaited<ReturnType<typeof api.invitations.my.get>>["data"]>[number]>

const statusLabel: Record<string, string> = {
    pending: "На рассмотрении",
    accepted: "Принято",
    rejected: "Отклонено",
}
const statusColor: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    accepted: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
}

export default function ProfileResponsesPage() {
    const [role, setRole] = useState<"employer" | "seeker">("employer")
    const [tab, setTab] = useState<"incoming" | "invitations">("incoming")
    const [seekerTab, setSeekerTab] = useState<"applications" | "invitations">("applications")

    const { data: myApplications, isLoading: loadingMyApps } = useQuery({
        queryKey: ["applications-my"],
        queryFn: async () => (await api.applications.my.get()).data,
    })

    const { data: incomingApplications, isLoading: loadingIncoming } = useQuery({
        queryKey: ["applications-incoming"],
        queryFn: async () => (await api.applications.incoming.get()).data,
    })

    const { data: sentInvitations, isLoading: loadingSent } = useQuery({
        queryKey: ["invitations-sent"],
        queryFn: async () => (await api.invitations.sent.get()).data,
    })

    const { data: myInvitations, isLoading: loadingMyInv } = useQuery({
        queryKey: ["invitations-my"],
        queryFn: async () => (await api.invitations.my.get()).data,
    })

    const { mutate: respondInvitation } = useMutation({
        mutationFn: async ({ id, status }: { id: string, status: "accepted" | "rejected" }) => {
            await api.invitations({ id }).status.put({ status })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["invitations-my"] })
            toast.success("Готово!")
        },
    })

    const isLoading = loadingMyApps || loadingIncoming || loadingSent || loadingMyInv

    return (
        <div className="pt-18 mr-16 ml-60 flex flex-col gap-6">
            <h1 className="text-3xl font-semibold">Отклики</h1>

            <div className="grid grid-cols-2 border bg-gray-100 rounded-full p-1 w-fit">
                <Button
                    onClick={() => setRole("employer")}
                    variant="ghost"
                    className={`px-4 py-2 rounded-full text-sm transition-colors
                        ${role === "employer" ? "bg-white shadow-sm font-medium" : "text-muted-foreground hover:text-black"}`}
                >
                    Я работодатель
                </Button>
                <Button
                    onClick={() => setRole("seeker")}
                    variant="ghost"
                    className={`px-4 py-2 rounded-full text-sm transition-colors
                        ${role === "seeker" ? "bg-white shadow-sm font-medium" : "text-muted-foreground hover:text-black"}`}
                >
                    Я соискатель
                </Button>
            </div>

            {role === "employer" && (
                <div className="grid grid-cols-2 border bg-gray-100 rounded-full p-1 w-fit">
                    <Button
                        onClick={() => setTab("incoming")}
                        variant="ghost"
                        className={`px-4 py-2 rounded-full text-sm transition-colors
                            ${tab === "incoming" ? "bg-white shadow-sm font-medium" : "text-muted-foreground hover:text-black"}`}
                    >
                        Входящие отклики
                    </Button>
                    <Button
                        onClick={() => setTab("invitations")}
                        variant="ghost"
                        className={`px-4 py-2 rounded-full text-sm transition-colors
                            ${tab === "invitations" ? "bg-white shadow-sm font-medium" : "text-muted-foreground hover:text-black"}`}
                    >
                        Мои приглашения
                    </Button>
                </div>
            )}

            {isLoading && (
                <div className="flex items-center justify-center py-32 text-gray-400">Загружаем...</div>
            )}

            {!isLoading && (
                <>
                    {role === "employer" && tab === "incoming" && (
                        <div className="flex flex-col gap-3">
                            {!incomingApplications?.length && (
                                <Empty text="Нет входящих откликов" />
                            )}
                            {(incomingApplications as IncomingApp[])?.map((app) => (
                                <div key={app.id} className="border border-gray-200 rounded-xl p-4 flex justify-between items-start">
                                    <div className="flex flex-col gap-1">
                                        <p className="font-medium">{app.personnel?.name}</p>
                                        <p className="text-sm text-gray-500">{app.startup?.name} · {app.vacancy?.specialty?.name ?? app.vacancy?.category?.name ?? "Без вакансии"}</p>
                                    </div>
                                    <span className={`text-xs px-2 py-1 rounded-full ${statusColor[app.status] ?? statusColor.pending}`}>
                                        {statusLabel[app.status] ?? app.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}

                    {role === "employer" && tab === "invitations" && (
                        <div className="flex flex-col gap-3">
                            {!sentInvitations?.length && (
                                <Empty text="Вы ещё не отправили приглашений" />
                            )}
                            {(sentInvitations as SentInv[])?.map((inv) => (
                                <div key={inv.id} className="border border-gray-200 rounded-xl p-4 flex justify-between items-start">
                                    <div className="flex flex-col gap-1">
                                        <p className="font-medium">{inv.personnel?.name}</p>
                                        <p className="text-sm text-gray-500">{inv.startup?.name} · {inv.vacancy?.specialty?.name ?? inv.vacancy?.category?.name ?? "Без вакансии"}</p>
                                    </div>
                                    <span className={`text-xs px-2 py-1 rounded-full ${statusColor[inv.status] ?? statusColor.pending}`}>
                                        {statusLabel[inv.status] ?? inv.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}

                    {role === "seeker" && (
                        <div className="flex flex-col gap-4">
                            <div className="grid grid-cols-2 border bg-gray-100 rounded-full p-1 w-fit">
                                <Button
                                    onClick={() => setSeekerTab("applications")}
                                    variant="ghost"
                                    className={`px-4 py-2 rounded-full text-sm transition-colors
                                        ${seekerTab === "applications" ? "bg-white shadow-sm font-medium" : "text-muted-foreground hover:text-black"}`}
                                >
                                    Мои отклики
                                </Button>
                                <Button
                                    onClick={() => setSeekerTab("invitations")}
                                    variant="ghost"
                                    className={`px-4 py-2 rounded-full text-sm transition-colors
                                        ${seekerTab === "invitations" ? "bg-white shadow-sm font-medium" : "text-muted-foreground hover:text-black"}`}
                                >
                                    Приглашения
                                </Button>
                            </div>

                            {seekerTab === "applications" && (
                                <div className="flex flex-col gap-3">
                                    {!myApplications?.length && <Empty text="Вы ещё не откликались" />}
                                    {(myApplications as MyApp[])?.map((app) => (
                                        <div key={app.id} className="border border-gray-200 rounded-xl p-4 flex justify-between items-start">
                                            <div className="flex flex-col gap-1">
                                                <p className="font-medium">{app.startup?.name}</p>
                                                <p className="text-sm text-gray-500">{app.vacancy?.specialty?.name ?? app.vacancy?.category?.name ?? "Без вакансии"}</p>
                                            </div>
                                            <span className={`text-xs px-2 py-1 rounded-full ${statusColor[app.status] ?? statusColor.pending}`}>
                                                {statusLabel[app.status] ?? app.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {seekerTab === "invitations" && (
                                <div className="flex flex-col gap-3">
                                    {!myInvitations?.length && <Empty text="Нет приглашений" />}
                                    {(myInvitations as MyInv[])?.map((inv) => (
                                        <div key={inv.id} className="border border-gray-200 rounded-xl p-4 flex justify-between items-center">
                                            <div className="flex flex-col gap-1">
                                                <p className="font-medium">{inv.startup?.name}</p>
                                                <p className="text-sm text-gray-500">{inv.vacancy?.specialty?.name ?? inv.vacancy?.category?.name ?? "Без вакансии"}</p>
                                            </div>
                                            {inv.status === "pending" ? (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => respondInvitation({ id: inv.id, status: "accepted" })}
                                                        className="text-sm px-3 py-1.5 bg-gray-950 text-white rounded-lg hover:bg-gray-800 transition cursor-pointer"
                                                    >
                                                        Принять
                                                    </button>
                                                    <button
                                                        onClick={() => respondInvitation({ id: inv.id, status: "rejected" })}
                                                        className="text-sm px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition cursor-pointer"
                                                    >
                                                        Отклонить
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className={`text-xs px-2 py-1 rounded-full ${statusColor[inv.status] ?? statusColor.pending}`}>
                                                    {statusLabel[inv.status] ?? inv.status}
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

function Empty({ text }: { text: string }) {
    return (
        <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
            <Bell className="w-12 h-12 text-gray-200" strokeWidth={1} />
            <p className="text-gray-400 text-sm">{text}</p>
        </div>
    )
}
