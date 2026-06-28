"use client"

import Link  from "next/link";
import Image from "next/image";
import { MenuIcon, X } from "lucide-react";
import { useState } from "react";

export default function Header() {
    const [isOpen, setIsOpen] = useState(false)
    return (
        <header className="px-10 w-full">
            <div className="bg-gray-950 p-3 z-[60] md:w-170 fixed rounded-2xl mx-4 mt-4 md:mx-auto left-0 right-0 flex gap-12 items-center justify-between">
                <Link href="/" className="w-35 h-5 relative">
                    <Image 
                    src="/images/Logo.svg"
                    alt="/"
                    fill
                    className="object-contain"></Image>
                </Link>
                <nav className="text-white gap-6 hidden lg:flex">
                    <Link href="/personnel" className="hover:text-gray-200 transition">Кадры</Link>
                    <Link href="/startups" className="hover:text-gray-200 transition">Стартапы</Link>
                    <Link href="/contacts" className="hover:text-gray-200 transition">Контакты</Link>
                </nav>
                <Link href="/auth/sign-up" className="bg-white px-4 py-2 rounded-xl hover:bg-gray-100 transition hidden lg:flex">
                    Зарегистрироваться
                </Link>
                 <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden text-white">
                    {isOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
                </button>
            </div>
            

            {isOpen && (
                <div className="fixed inset-0 bg-white z-50 flex flex-col pt-24 p-6 justify-between">
                    <nav className="flex flex-col gap-4">
                        <Link 
                            href="/personnel" 
                            className=" text-xl hover:text-gray-300 transition"
                            onClick={() => setIsOpen(false)}
                        >
                            Кадры
                        </Link>
                        <Link 
                            href="/startups" 
                            className=" text-xl hover:text-gray-300 transition"
                            onClick={() => setIsOpen(false)}
                        >
                            Стартапы
                        </Link>
                        <Link 
                            href="/contacts" 
                            className=" text-xl hover:text-gray-300 transition"
                            onClick={() => setIsOpen(false)}
                        >
                            Контакты
                        </Link>
                    </nav>
                    <Link 
                        href="/auth/sign-up" 
                        className="bg-gray-950 text-white px-4 py-2 rounded-xl text-center hover:bg-gray-900 transition w-full"
                        onClick={() => setIsOpen(false)}
                    >
                        Зарегистрироваться
                    </Link>
                </div>
            )}
        </header>
    );
}