"use client"

import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/client/api";

export function CategoryList () {
    const {data: categories, isLoading } = useQuery ({
        queryKey: ["categories"],  
        queryFn: async () => {
            return (await api.categories.get()).data;
        }
    })
    return(
        <div>
            {isLoading && <p className="text-xl">Категории грузятся...</p>}
            {categories?.map((cat) => (
                <div key={cat.id} className="bg-gray-100 border border-gray-200 rounded-2xl p-4 mt-4">
                    <h2 className="text-xl font-bold mb-3 text-gray-800">
                        {cat.name}
                    </h2>
                    <div className="space-y-2 text-gray-700">
                        <p>
                            <span className="font-semibold">ID категории:</span> {cat.id}
                        </p>
                        <p>
                            <span className="font-semibold">Когда создали:</span> {cat.createdAt.toISOString()}
                        </p>
                    </div>
                </div>
            ))
            }
        </div>
    )
}