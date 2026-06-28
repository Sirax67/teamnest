"use client"

import { useForm } from "@tanstack/react-form"
import { CategorySchema } from "../../lib/schemas/category"
import z from "zod/v4"
import { Category } from "../../lib/types/category"
import { useMutation } from "@tanstack/react-query"
import { api } from "../../lib/client/api"
import { queryClient } from "../../lib/client/query-client"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useState } from "react"
import { Plus, Pencil } from "lucide-react"

export function CreateUpdateCategory({ category }: { category?: Category }) {
  const [isOpen, setIsOpen] = useState(false);

  const createMutation = useMutation({
    mutationKey: ["createCategory"],
    mutationFn: async (data: z.infer<typeof CategorySchema>) => {
      await api.categories.post(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
      toast.success("Категория успешно создана");
      form.reset();
      setIsOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationKey: ["updateCategory"],
    mutationFn: async (data: z.infer<typeof CategorySchema>) => {
      await api.categories({ id: category!.id }).put(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
      toast.success("Категория успешно обновлена");
      form.reset();
      setIsOpen(false);
    },
  });

  const form = useForm({
    defaultValues: {
      ...category,
    } as z.infer<typeof CategorySchema>,
    onSubmit: async ({ value }) => {
      if (category) {
        await updateMutation.mutate(value);
      } else {
        await createMutation.mutate(value);
      }
    },
    validators: {
      onSubmit: CategorySchema,
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger >
        {category ? (
          <Button variant="outline" size="icon" className="cursor-pointer" >
            <Pencil />
          </Button>
        ) : (
          <Button className="bg-gray-950 text-white hover:bg-gray-800 cursor-pointer px-4 py-3 h-auto rounded-xl">
            <Plus /> Создать категорию
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {category ? "Редактирование категории" : "Создание категории"}
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
                {category ? "Обновить" : "Создать"}
              </Button>
            )}
          </form.Subscribe>
        </form>
      </DialogContent>
    </Dialog>
  );
}