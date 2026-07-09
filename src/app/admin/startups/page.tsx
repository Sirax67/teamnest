import { api } from "@/src/server/api";
import { StartupsTable } from "./startups-table";

export default async function AdminStartupsPage () {
    const startups = (await api.startups.get()).data;

    return(
        <div className="py-20 md:mr-16 md:ml-60 flex flex-col gap-12 px-4">
            <div className="flex justify-between items-center">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-semibold">Стартапы</h1>
                    <p className="text-muted-foreground">Управление стартапами</p>
                </div>
            </div>
            
            
            <StartupsTable initialData={startups ?? []}/>
        </div>
    )
}