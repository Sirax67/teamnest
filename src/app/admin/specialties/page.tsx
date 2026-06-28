import { api } from "@/src/server/api";
import { SpecialtiesTable } from "./specialties-table";
import { CreateUpdateSpecialty } from "./create-update";

export default async function AdminSpecialtiesPage() {
    const specialties = (await api.specialties.get()).data;

    return (
        <div className="pt-18 mr-16 ml-60 flex flex-col gap-12">
            <div className="flex justify-between items-center">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-semibold">Специальности</h1>
                    <p className="text-gray-500">Управление специальностями</p>
                </div>
                <CreateUpdateSpecialty />
            </div>
            <SpecialtiesTable initialData={specialties ?? []} />
        </div>
    )
}