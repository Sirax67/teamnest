import { api } from "@/src/server/api";
import { PersonnelTable } from "./personnel-table";

export default async function AdminPersonnelPage () {
    const personnel = (await api.personnel.get()).data;

    return(
        <div className="pt-18 mr-16 ml-60 flex flex-col gap-12">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-semibold">Кадры</h1>
                <p className="text-gray-500">Управление кадрами</p>
            </div>
            <PersonnelTable initialData={personnel ?? []}/>
        </div>
    )
}