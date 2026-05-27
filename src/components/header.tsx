import Link  from "next/link";
import Image from "next/image";
import { Menu } from "lucide";
import { MenuIcon } from "lucide-react";

export default function Header() {
    return (
        <header className="bg-gray-950 p-3 z-50 max-w-183 fixed rounded-2xl mt-4 mx-auto left-0 right-0 flex gap-12 items-center justify-between">
            <Link href="/" className="w-35 h-5 lg:w-41 lg:h-6 relative">
                <Image 
                src="/images/Logo.svg"
                alt="/"
                fill
                className="object-cover object-center"></Image>
            </Link>
            <div className="text-white gap-6 hidden lg:flex">
                <Link href="" className="hover:text-gray-200 transition">Кадры</Link>
                <Link href="" className="hover:text-gray-200 transition">Стартапы</Link>
                <Link href="" className="hover:text-gray-200 transition">Контакты</Link>
            </div>
            <Link href="/" className="bg-white px-4 py-3 rounded-xl hover:bg-gray-100 transition hidden lg:flex">
                Зарегистрироваться
            </Link>
            <button className=" flex lg:hidden">
                <MenuIcon className="text-white" />
            </button>
        </header>
    );
}