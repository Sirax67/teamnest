import { api } from "@/src/server/api";
import { CategoriesTable } from "./categories-table";
import { CreateUpdateCategory } from "./create-update";
export default async function AdminCategoriesPage () {
    const categories = (await api.categories.get()).data;

    return(
        <div className="pt-18 mr-16 ml-60 flex flex-col gap-12 ">
            <div className="flex justify-between items-center">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-semibold">Категории</h1>
                    <p className="text-gray-500">Управление категориями</p>
                </div>
                <CreateUpdateCategory />
            </div>
            
            
            <CategoriesTable initialData={categories ?? []}/>
        </div>
        
        
        
    )
}