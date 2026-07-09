import { api } from "@/src/server/api";
import { CategoriesTable } from "./categories-table";
import { CreateUpdateCategory } from "./create-update";
export default async function AdminCategoriesPage () {
    const categories = (await api.categories.get()).data;

    return(
        <div className="py-20 md:mr-16 md:ml-60 flex flex-col gap-12 px-4">
            <div className="flex justify-between items-center">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-semibold">Категории</h1>
                    <p className="text-muted-foreground">Управление категориями</p>
                </div>
                <CreateUpdateCategory />
            </div>
            
            
            <CategoriesTable initialData={categories ?? []}/>
        </div>
        
        
        
    )
}