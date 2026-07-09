import { api } from "@/src/server/api";
import { SectorsTable } from "./sectors-table";
import { CreateUpdateSector } from "./create-update";
export default async function AdminSectorsPage () {
    const sectors = (await api.sectors.get()).data;

    return(
        <div className="py-20 md:mr-16 md:ml-60 flex flex-col gap-12 px-4">
            <div className="flex justify-between items-center">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-semibold">Сектора</h1>
                    <p className="text-muted-foreground">Управление секорами</p>
                </div>
                <CreateUpdateSector/>
            </div>
            
            
            <SectorsTable initialData={sectors ?? []}/>
        </div>
    )
}