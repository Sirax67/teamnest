"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { Sector } from "../../lib/types/sector";
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
import { queryClient } from "../../lib/client/query-client";
import { toast } from "sonner";
import { CreateUpdateSector } from "./create-update";
import { Trash2 } from "lucide-react";

export function SectorsTable({ initialData }: { initialData: Sector[] }) {
    const { data: sectors } = useQuery({
    queryKey: ["sectors"],
    queryFn: async () => {
      return (await api.sectors.get()).data;
    },
    initialData: initialData,
  });

  return <DataTable columns={colums} data={sectors ?? initialData}/>
}

const colums: ColumnDef<Sector>[] = [
    {
      accessorKey: "id",
      header: "Название",
      cell: ({ row }) => <p>{row.original.name}</p>,
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
          <CreateUpdateSector sector={row.original} />
          <DeleteSector sector={row.original} />
        </div>
      ),
    },
]

function DeleteSector({sector}: { sector: Sector }) {
    const deleteMutation = useMutation({
      mutationKey: ["deleteSector"],
      mutationFn: async () => {
        await api.sectors({ id: sector.id }).delete();
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["sectors"],
        });
        toast.success("Сектор успешно удален");
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
          <DialogTitle>Удалить сектор</DialogTitle>
        </DialogHeader>
        <p>Вы уверены, что хотите удалить сектор <span className="font-medium">{sector.name}</span>?</p>
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