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
        <div className="py-12 px-16 my-20 flex flex-col gap-12 container mx-auto">
            <div className="flex flex-col gap-4 justify-center text-center items-center w-full">
                <h1 className=" font-semibold text-[clamp(24px,5vw,28px)] md:text-4xl lg:text-6xl bg-clip-text text-transparent bg-gradient-to-br from-[#5D5D5D] via-[#1C1C1C] to-[#5D5D5D] max-w-[35ch]">Кадры в поиске стартапа</h1>
                <p className="lg:text-xl text-gray-500 max-w-[60ch] mx-auto">Разместите информацию о себе в каталоге — дайте стартапам возможность найти вас и пригласить в команду! Перспективные проекты уже рядом.</p>
            </div>

            <div className="flex justify-between">
                <div>
                    
                </div>
            </div>

            <div className="mt-20 text-red-600">
                {personnel?.map((per) => (
                    <p className="text-red-500 text-xl" key={per.id}>
                        {per.name}
                    </p>
                ))}
            </div>
        </div>
        
    )
}