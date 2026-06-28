"use client"

import CardStartup from "@/src/components/startups/CardStartup";

export default function Startups() {
    
    return(
        
        <div className="py-12 px-16 my-20 flex flex-col gap-12 container mx-auto">
            
            <div className="flex flex-col gap-4 justify-center text-center items-center w-full">
                <h1 className=" font-semibold text-[clamp(24px,5vw,28px)] md:text-4xl lg:text-6xl bg-clip-text text-transparent bg-gradient-to-br from-[#5D5D5D] via-[#1C1C1C] to-[#5D5D5D] max-w-[35ch]">Стартапы в поисках команды</h1>
                <p className="lg:text-xl text-gray-500 max-w-[60ch] mx-auto">Если вы ищете человека в команду, разместите информацию о вашем проекте в каталоге, чтобы её смогли найти соискатели</p>
            </div>

            <div className="flex justify-between">
                <div>

                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <CardStartup/>
            </div>
        </div>

    )
}
