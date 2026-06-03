"use client"

import { api } from "@/src/app/lib/client/api";
import { useQuery } from "@tanstack/react-query"

export default  function Personnel() {
const { data: personnel, isLoading } = useQuery({
    queryKey: ["personnel"],
    queryFn: async () => {
        return (await api.personnel.get()).data;
    }
})
    return(
        <div className="mt-20 text-red-600">
            {personnel?.map((per) => (
                <p className="text-red-500 text-xl" key={per.id}>
                    {per.name}
                </p>
            ))}
        </div>
    )
}