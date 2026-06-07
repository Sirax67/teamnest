import { api } from "@/src/server/api";
import { CategoryForm } from "./category-form";
import { CategoryList } from "./category-list";

export default async function CategoriesPage () {
    const categories = (await api.categories.get()).data;
    return(
        <div className="container mx-auto flex flex-col gap-12 py-12 px-16 mt-20">
            <h1 className="
                font-semibold text-[clamp(24px,5vw,28px)] md:text-4xl lg:text-6xl bg-clip-text text-transparent bg-gradient-to-br from-[#5D5D5D] via-[#1C1C1C] to-[#5D5D5D] max-w-[35ch]
            ">
                Категории
            </h1>
            <CategoryList/>
            <CategoryForm />
            
        </div>
    )
}