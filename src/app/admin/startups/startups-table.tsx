"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { Startup } from "../../lib/types/startup";
import { api } from "../../lib/client/api";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { queryClient } from "../../lib/client/query-client";
import { toast } from "sonner";
import { CreateUpdateStartup } from "./create-update";
import Link from "next/link";

export function StartupsTable({ initialData }: { initialData: Startup[] }) {
    const { data: startups } = useQuery({
    queryKey: ["startups"],
    queryFn: async () => {
      return (await api.startups.get()).data;
    },
    initialData: initialData,
  });

  return <DataTable columns={colums} data={startups ?? initialData}/>
}

const colums: ColumnDef<Startup>[] = [
    {
      accessorKey: "logo",
      header: "Логотип",
      cell: ({ row }) => (
        <img
            src={row.original.logo ? `/api/files/${row.original.logo}` : "/images/default-startup.png"}
            alt={row.original.name}
            onError={(e) => { e.currentTarget.src = "/images/default-startup.png" }}
            className="w-10 h-10 object-cover rounded"
        />
    ),
    },
    {
      accessorKey: "id",
      header: "Название",
      cell: ({ row }) => <p>{row.original.name}</p>,
    },
    
    {
        accessorKey: "description",
        header: "Описание",
        cell: ({ row }) => (
            <p 
                className="max-w-50 truncate" 
                title={row.original.description} 
            >
                {row.original.description}
            </p>
        ),
    },
    {
      accessorKey: "link",
      header: "Ссылка",
      cell: ({ row }) => <Link href={row.original.link}>{row.original.link}</Link>,
    },
    {
      accessorKey: "stage",
      header: "Стадия",
      cell: ({ row }) => <p>{row.original.stage}</p>,
    },
    {
      accessorKey: "sectorId",
      header: "Сектор",
      cell: ({ row }) => <p>{(row.original as any).sector?.name ?? row.original.sectorId}</p>},
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
          <CreateUpdateStartup startup={row.original} />
          <DeleteStartup startup={row.original} />
        </div>
      ),
    },
]

function DeleteStartup({startup}: { startup: Startup }) {
    const deleteMutation = useMutation({
      mutationKey: ["deleteStartup"],
      mutationFn: async () => {
        await api.startups({ id: startup.id }).delete();
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["startups"],
        });
        toast.success("Стартап успешно удален");
      },
    });
  return (
    <Dialog>
      <DialogTrigger >
        <Button variant="outline" size="icon" className="text-red-500 cursor-pointer hover:text-red-600">
          <Trash2 />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Удалить тартап</DialogTitle>
        </DialogHeader>
        <p>Вы уверены, что хотите удалить стартап <span className="font-medium">{startup.name}</span>?</p>
        <DialogFooter>
          <DialogClose>
            <Button variant={"outline"}>Отмена</Button>
          </DialogClose>
          <Button
            onClick={() => deleteMutation.mutate()}
            variant={"destructive"}
          >
            Удалить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}