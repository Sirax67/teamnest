"use client"

import { useForm } from "@tanstack/react-form"
import z from "zod/v4"
import { Sector } from "../../lib/types/sector"
import { useMutation } from "@tanstack/react-query"
import { api } from "../../lib/client/api"
import { queryClient } from "../../lib/client/query-client"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useState } from "react"
import { SectorSchema } from "../../lib/schemas/sectors"
import { Pencil, Plus } from "lucide-react"

export function CreateUpdateSector({ sector }: { sector?: Sector }) {
  const [isOpen, setIsOpen] = useState(false);

  const createMutation = useMutation({
    mutationKey: ["createSector"],
    mutationFn: async (data: z.infer<typeof SectorSchema>) => {
      await api.sectors.post(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["sectors"],
      });
      toast.success("Сектор успешно создан");
      form.reset();
      setIsOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationKey: ["updateSector"],
    mutationFn: async (data: z.infer<typeof SectorSchema>) => {
      await api.sectors({ id: sector!.id }).put(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["sectors"],
      });
      toast.success("Сектор успешно обновлен");
      form.reset();
      setIsOpen(false);
    },
  });

  const form = useForm({
    defaultValues: {
      ...sector,
    } as z.infer<typeof SectorSchema>,
    onSubmit: async ({ value }) => {
      if (sector) {
        await updateMutation.mutate(value);
      } else {
        await createMutation.mutate(value);
      }
    },
    validators: {
      onSubmit: SectorSchema,
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger >
        {sector ? (
          <Button variant="outline" size="icon" className="cursor-pointer" >
            <Pencil />
          </Button>
        ) : (
          <Button className="bg-gray-950 text-white hover:bg-gray-800 cursor-pointer px-4 py-3 h-auto rounded-xl">
            <Plus /> Создать сектор
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {sector ? "Редактирование сектор" : "Создание сектора"}
          </DialogTitle>
        </DialogHeader>
        <form
            className="flex flex-col gap-4"
            onSubmit={(e) => {
                e.stopPropagation();
                e.preventDefault();
                form.handleSubmit();
            }}
        >
          <form.Field name="name">
            {(field) => (
              <div className="flex flex-col gap-2">
                <p>Название</p>
                <Input
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Введите название"
                  errors={field.state.meta.errors.flatMap(
                    (e) => e?.message ?? "",
                  )}
                />
              </div>
            )}
          </form.Field>
          <form.Subscribe>
            {(formState) => (
              <Button
                disabled={
                  !formState.canSubmit ||
                  createMutation.isPending ||
                  updateMutation.isPending
                }
              >
                {sector ? "Обновить" : "Создать"}
              </Button>
            )}
          </form.Subscribe>
        </form>
      </DialogContent>
    </Dialog>
  );
}