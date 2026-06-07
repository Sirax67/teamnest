"use client"

import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/client/api";

export function SectorList () {
    const {data: sectors, isLoading } = useQuery ({
        queryKey: ["sectors"],
        queryFn: async () => {
            return (await api.sectors.get()).data;
        }
    })
    return(
        <div>
            {isLoading && <p className="text-xl">Сектора грузятся...</p>}
            {sectors?.map((sec) => (
                <div key={sec.id} className="bg-gray-100 border border-gray-200 rounded-2xl p-4 mt-4">
                    <h2 className="text-xl font-bold mb-3 text-gray-800">
                        {sec.name}
                    </h2>
                    <div className="space-y-2 text-gray-700">
                        <p>
                            <span className="font-semibold">ID сектора:</span> {sec.id}
                        </p>
                        <p>
                            <span className="font-semibold">Когда создали:</span> {sec.createdAt.toISOString()}
                        </p>
                    </div>
                </div>
            ))
            }
        </div>
    )
}