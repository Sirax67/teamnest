"use client";

import Image from "next/image";
import Link from "next/link";

const comand = [
    {
        imageSrc: "/images/contacts/1.png",
        title: "Лобов Александр",
        post: "Технический директор",
        contact: "nd@TeamNest.ru"
    },
    {
        imageSrc: "/images/contacts/2.png",
        title: "Лобов Александр",
        post: "Технический директор",
        contact: "nd@TeamNest.ru"
    },
    {
        imageSrc: "/images/contacts/3.png",
        title: "Лобов Александр",
        post: "Технический директор",
        contact: "nd@TeamNest.ru"
    },
];


export function ComandCard () {
    return(
        <>
            {comand.map((person, index) => (
                <div
                    key={index}
                    className="p-4 flex flex-col gap-4 justify-center items-center text-center"
                >
                    <div className="relative lg:h-80 h-64 aspect-square rounded-full">
                        <Image
                            src={person.imageSrc}
                            alt={person.title}
                            fill
                            className="object-cover object-center rounded-full"
                        />
                    </div>
                    <div className="flex flex-col">
                        <p className="text-2xl font-medium">{person.title}</p>
                        <p className="text-gray-500">{person.post}</p>
                    </div>
                    
                    <Link href="/contacts" className="underline">
                        {person.contact}
                    </Link>
                
                </div>
            ))}
        </>
    )
    
}