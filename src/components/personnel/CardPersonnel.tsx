"use client"

import { api } from "@/src/app/lib/client/api";
import { useQuery } from "@tanstack/react-query"
import Image from "next/image";

export default  function CardPersonnel() {
const { data: personnel} = useQuery({
    queryKey: ["personnel"],
    queryFn: async () => {
        return (await api.personnel.get()).data;
    }
})
    return(

        <>
            {personnel?.map((personnel) => (
                <div key={personnel.id} className="
                    cursor-pointer h-62 flex flex-col gap-4 p-4 rounded-2xl bg-gray-100 border border-gray-200
                    hover:translate-y-[-8px] hover:shadow-[inset_0_-8px_0_0_#DDDEDF] transition-all duration-300
                ">
                    <div className="flex items-center gap-2">
                        <div className="w-10 aspect-square relative">
                            <Image
                                src={personnel.avatar || "/images/default-avatar.png"}
                                alt=""
                                fill
                                className="object-cover object-center"
                            ></Image>
                        </div>
                        <div>
                            <p>
                                {personnel.name}
                            </p>
                            <p className="text-gray-600 text-sm">
                                {personnel.position}
                            </p>
                       </div>
                    </div>

                    <div className="relative overflow-hidden h-30">
                        <p className="text-gray-600">
                          {personnel.summary}
                        </p>
                        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-gray-100 to-transparent" />
                    </div>

                    <div className=" flex flex-col gap-4 bottom-0 left-0 right-0">
                        <hr className="border-gray-200 border-1" />

                        <div className="flex items-center gap-2">
                            {personnel.skills.map((skill) => (
                                <p key={skill} className="bg-gray-200 rounded-2xl px-2 py-1 text-sm ">
                                    {skill}
                                </p>
                            ))}
                        </div>
                    </div>
                    

                </div>
            ))}
        </>

    )
}