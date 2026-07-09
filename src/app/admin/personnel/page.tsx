import { api } from "@/src/server/api";
import { PersonnelTable } from "./personnel-table";

export default async function AdminPersonnelPage () {
    const personnel = (await api.personnel.get()).data;

    return(
         <div className="py-20 md:mr-16 md:ml-60 flex flex-col gap-12 px-4">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-semibold">Кадры</h1>
                <p className="text-muted-foreground">Управление кадрами</p>
            </div>
            <PersonnelTable initialData={personnel ?? []}/>
        </div>
    )
}