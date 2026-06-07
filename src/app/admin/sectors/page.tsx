import { api } from "@/src/server/api"
import { SectorForm } from "./sector-form";
import { SectorList } from "./sector-list";


export default async function StarupPage () {
const startups = (await api.startups.get()).data;

    return (
        <div className="container mx-auto flex flex-col gap-12 py-12 px-16 mt-20">
            <h1 className="
                font-semibold text-[clamp(24px,5vw,28px)] md:text-4xl lg:text-6xl bg-clip-text text-transparent bg-gradient-to-br from-[#5D5D5D] via-[#1C1C1C] to-[#5D5D5D] max-w-[35ch]
            ">
                Сектора
            </h1>

            <div className="flex flex-col gap-4">
                <SectorList/>
            </div>
            <SectorForm/>
        </div>
    )
}