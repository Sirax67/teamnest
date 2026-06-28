"use client"

import { useMutation, useQuery } from "@tanstack/react-query"
import { Person } from "../../lib/types/person"
import { api } from "../../lib/client/api"
import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/ui/data-table"
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { queryClient } from "../../lib/client/query-client"
import { toast } from "sonner"

export function PersonnelTable({ initialData }: { initialData: Person[] }) {
    const { data: personnel } = useQuery({
        queryKey: ["personnel"],
        queryFn: async () => (await api.personnel.get()).data,
        initialData,
    })

    return <DataTable columns={columns} data={personnel ?? initialData} />
}

const columns: ColumnDef<Person>[] = [
    {
        accessorKey: "avatar",
        header: "Фото",
        cell: ({ row }) => (
            <img
                src={row.original.avatar ? `/api/files/${row.original.avatar}` : "/images/default-avatar.png"}
                alt={row.original.name}
                onError={(e) => { e.currentTarget.src = "/images/default-avatar.png" }}
                className="w-10 h-10 object-cover rounded-full"
            />
        ),
    },
    {
        accessorKey: "name",
        header: "ФИО",
        cell: ({ row }) => <p>{row.original.name}</p>,
    },
    {
        accessorKey: "position",
        header: "Должность",
        cell: ({ row }) => <p>{row.original.position}</p>,
    },
    {
        accessorKey: "city",
        header: "Город",
        cell: ({ row }) => <p>{row.original.city}</p>,
    },
    {
        accessorKey: "age",
        header: "Возраст",
        cell: ({ row }) => <p>{row.original.age}</p>,
    },
    {
        accessorKey: "institution",
        header: "Учебное заведение",
        cell: ({ row }) => <p className="max-w-40 truncate" title={row.original.institution}>{row.original.institution}</p>,
    },
    {
        accessorKey: "faculty",
        header: "Факультет",
        cell: ({ row }) => <p className="max-w-32 truncate" title={row.original.faculty}>{row.original.faculty}</p>,
    },
    {
        accessorKey: "period",
        header: "Период",
        cell: ({ row }) => <p>{row.original.period}</p>,
    },
    {
        accessorKey: "summary",
        header: "Резюме",
        cell: ({ row }) => <p className="max-w-48 truncate" title={row.original.summary}>{row.original.summary}</p>,
    },
    {
        accessorKey: "skills",
        header: "Навыки",
        cell: ({ row }) => (
            <div className="flex flex-wrap gap-1">
                {row.original.skills?.map((skill, i) => (
                    <span key={i} className="bg-gray-100 text-xs px-2 py-0.5 rounded-full">{skill}</span>
                ))}
            </div>
        ),
    },
    {
        accessorKey: "contact",
        header: "Контакт",
        cell: ({ row }) => <p className="max-w-40 truncate">{row.original.contact}</p>,
    },
    {
        accessorKey: "actions",
        header: "Действия",
        cell: ({ row }) => <DeletePerson person={row.original} />,
    },
]

function DeletePerson({ person }: { person: Person }) {
    const deleteMutation = useMutation({
        mutationKey: ["deletePerson"],
        mutationFn: async () => {
            await api.personnel({ id: person.id }).delete()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["personnel"] })
            toast.success("Сотрудник успешно удалён")
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
                    <DialogTitle>Удалить сотрудника</DialogTitle>
                </DialogHeader>
                <p>Вы уверены, что хотите удалить <span className="font-medium">{person.name}</span>?</p>
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
