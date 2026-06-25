"use client"

import { useQuery } from "@tanstack/react-query"
import { api } from "../../lib/client/api"

export function StartupList () {
    const {data: startups, isLoading } = useQuery ({
        queryKey: ["startups"],
        queryFn: async () => {
            return (await api.startups.get()).data;
        }
    })
    return(
        <div>
            {isLoading && <p className="text-xl">Стартапы грузятся...</p>}
            {startups?.map((start) => (
                <div key={start.id} className="bg-gray-100 border border-gray-200 rounded-2xl p-4 mt-4">
                    <h2 className="text-xl font-bold mb-3 text-gray-800">
                        {start.name}
                    </h2>
                    <div className="space-y-2 text-gray-700">
                          <img
                                src={start.logo ? `/api/files/${start.logo}` : "/images/default-startup.png"}
                                alt={start.name}
                                className="w-32 h-32 object-cover rounded-lg mb-3"
                            />
                        <p>
                            <span className="font-semibold">Описание:</span> {start.description}
                        </p>
                        <p>
                            <span className="font-semibold">Ссылка:</span> 
                            <a href={start.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">
                                {start.link}
                            </a>
                        </p>
                        <p>
                            <span className="font-semibold">Стадия:</span> {start.stage}
                        </p>
                        <p>
                            <span className="font-semibold">Сектор:</span> {start.sectorId}
                        </p>
                        <p>
                            <span className="font-semibold">Дата начала:</span>  {new Date(start.startDate).toLocaleDateString()}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    )
}