import { ComandCard } from "@/src/components/comand/CardComand"
import Image from "next/image"


export default function Contacts () {
    return (
        <div className="overflow-hidden ">
            <Content/>
            <Comand/>
        </div>
    )
}

function Content () {
    return(
        <section className="w-full relative overflow-hidden">
            <div className="w-full h-full absolute z-0 pointer-events-none">
                <Image
                    className="object-cover object-center"
                    src="/images/welcome/background-img.png"
                    alt=""
                    fill
                ></Image>
            </div>

            {/* Мобильный layout — естественный поток */}
            <div className="lg:hidden flex flex-col items-center pt-20 pb-12 px-4 relative z-10 w-fit mx-auto">
                <div className="w-full flex flex-col items-center">
                    <h1 className="text-7xl font-unbounded">Founder</h1>
                    <div className="w-full flex justify-between">
                        <p className="text-xl font-medium">Сёмин Олег</p>
                        <p className="text-xl font-medium">CEO</p>
                    </div>
                </div>

                {/* Фото сразу под надписью */}
                <div className="w-full max-w-xs h-96 relative">
                    <Image
                        className="object-contain object-top"
                        src="/images/contacts/Oleg.png"
                        alt=""
                        fill
                    ></Image>
                </div>

                <div className="flex flex-col gap-2 items-center text-center">
                    <p className="text-xl font-medium">Создай свое будущее вместе с</p>
                    <div className="w-40 h-10 relative">
                        <Image src="/images/Logo-dark.svg" alt="/" fill className="object-contain" />
                    </div>
                </div>
            </div>

            {/* Десктоп layout — оригинальный с h-screen и absolute фото */}
            <div className="hidden lg:block relative h-screen px-16 pb-12 pt-20">
                <div className="relative z-10 container mx-auto flex flex-col items-center w-fit">
                    <h1 className="text-[clamp(78px,18vw,256px)] font-unbounded leading-none">Founder</h1>
                    <div className="w-full flex justify-between">
                        <p className="text-[clamp(20px,3vw,48px)] font-medium">Сёмин Олег</p>
                        <p className="text-[clamp(20px,3vw,48px)] font-medium">CEO</p>
                    </div>
                </div>
                <div className="absolute right-0 left-0 bottom-0">
                    <div className="w-170 h-300 relative z-20 pointer-events-none mx-auto ">
                        <Image
                            className="object-contain object-bottom"
                            src="/images/contacts/Oleg.png"
                            alt=""
                            fill
                        ></Image>
                    </div>
                </div>
                <div className="z-30 h-80 w-full absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white to-transparent"></div>
                <div className="z-40 absolute right-0 left-0 bottom-10 flex flex-col gap-4 items-center text-center">
                    <p className="text-5xl font-medium">Создай свое будущее вместе с</p>
                    <div className="w-60 h-12 relative">
                        <Image src="/images/Logo-dark.svg" alt="/" fill className="object-contain" />
                    </div>
                </div>
            </div>
        </section>
    )
}

function Comand () {
    return (
        <section className="py-12 px-16 container mx-auto bg-white z-40 relative">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                <ComandCard/>
            </div>
        </section>
    )
}