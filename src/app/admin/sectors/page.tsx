import { api } from "@/src/server/api";
import { SectorsTable } from "./sectors-table";
import { CreateUpdateSector } from "./create-update";
export default async function AdminSectorsPage () {
    const sectors = (await api.sectors.get()).data;

    return(
        <div className="pt-18 mr-16 ml-60 flex flex-col gap-12 ">
            <div className="flex justify-between items-center">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-semibold">Сектора</h1>
                    <p className="text-gray-500">Управление секорами</p>
                </div>
                <CreateUpdateSector/>
            </div>
            
            
            <SectorsTable initialData={sectors ?? []}/>
        </div>
    )
}