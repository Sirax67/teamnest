import { api } from "@/src/server/api";
import { StartupsTable } from "./startups-table";
import { CreateUpdateStartup } from "./create-update";

export default async function AdminStartupsPage () {
    const startups = (await api.startups.get()).data;

    return(
        <div className="pt-18 mr-16 ml-60 flex flex-col gap-12 ">
            <div className="flex justify-between items-center">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-semibold">Стартапы</h1>
                    <p className="text-gray-500">Управление стартапами</p>
                </div>
                <CreateUpdateStartup />
            </div>
            
            
            <StartupsTable initialData={startups ?? []}/>
        </div>
    )
}