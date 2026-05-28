"use client";

import Image from "next/image";

const about = [
    {
        imageSrc: "/images/about/group.png",
        title: "Поиск команды",
        description: "TeamNest упрощает поиск единомышленников — здесь вы сможете найти разработчиков, дизайнеров, маркетологов и других специалистов, готовых взяться за реализацию идеи.",
        alt: "Поиск команды"
    },
    {
        imageSrc: "/images/about/smart-group.png",
        title: "Возможности для роста",
        description: "Платформа открыта для тех, кто ищет опыт, хочет развить навыки и узнать, что значит работать над стартапом изнутри.",
        alt: "Возможности для роста"
    },
    {
        imageSrc: "/images/about/handshake.png",
        title: "Сеть поддержки и развития",
        description: "Мы создаем сообщество, где можно найти не только команду, но и наставников, советчиков и будущих партнеров.",
        alt: "Сеть поддержки"
    }
];


export function AboutCard () {
    return(
        <div className="flex gap-9 flex-wrap justify-center">
            {about.map((feature, index) => (
                <div
                    key={index}
                    className="p-4 bg-gray-100 border border-gray-200 flex flex-col gap-4 rounded-2xl max-w-103 hover:scale-105 transition duration-300"
                >
                    <div className="relative h-56 md:h-64 ">
                        <Image
                            src={feature.imageSrc}
                            alt={feature.alt}
                            fill
                            className="object-cover object-center rounded-2xl"
                        />
                    </div>
                    <div className="flex flex-col gap-2 text-start">
                        <p className="text-2xl font-medium">{feature.title}</p>
                        <p className="text-gray-500">{feature.description}</p>
                    </div>
                
                </div>
            ))}
        </div>
    )
    
}