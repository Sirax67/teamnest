"use client"

import { useMutation, useQuery } from "@tanstack/react-query"
import { Specialty } from "../../lib/types/specialty"
import { api } from "../../lib/client/api"
import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/ui/data-table"
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { queryClient } from "../../lib/client/query-client"
import { toast } from "sonner"
import { CreateUpdateSpecialty } from "./create-update"

export function SpecialtiesTable({ initialData }: { initialData: Specialty[] }) {
    const { data: specialties } = useQuery({
        queryKey: ["specialties"],
        queryFn: async () => (await api.specialties.get()).data,
        initialData,
    })

    return <DataTable columns={columns} data={specialties ?? initialData} />
}

const columns: ColumnDef<Specialty>[] = [
    {
        accessorKey: "name",
        header: "Название",
        cell: ({ row }) => <p>{row.original.name}</p>,
    },
    {
        accessorKey: "categoryId",
        header: "Категория",
        cell: ({ row }) => <p>{(row.original as any).category?.name ?? row.original.categoryId}</p>,
    },
    {
        accessorKey: "createdAt",
        header: "Дата создания",
        cell: ({ row }) => <p>{new Date(row.original.createdAt).toLocaleString()}</p>,
    },
    {
        accessorKey: "actions",
        header: "Действия",
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <CreateUpdateSpecialty specialty={row.original} />
                <DeleteSpecialty specialty={row.original} />
            </div>
        ),
    },
]

function DeleteSpecialty({ specialty }: { specialty: Specialty }) {
    const deleteMutation = useMutation({
        mutationKey: ["deleteSpecialty"],
        mutationFn: async () => {
            await api.specialties({ id: specialty.id }).delete()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["specialties"] })
            toast.success("Специальность успешно удалена")
        },
    })

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="icon" className="text-red-500 cursor-pointer hover:text-red-600">
                    <Trash2 />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Удалить специальность</DialogTitle>
                </DialogHeader>
                <p>Вы уверены, что хотите удалить <span className="font-medium">{specialty.name}</span>?</p>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Отмена</Button>
                    </DialogClose>
                    <Button onClick={() => deleteMutation.mutate()} variant="destructive">
                        Удалить
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
