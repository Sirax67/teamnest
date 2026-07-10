import Image from "next/image";
import Link from "next/link";

export function Footer () {
    return(
        <footer className="px-16 py-12 flex flex-col container mx-auto">
            <div className="hidden lg:flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <div className="text-xl flex gap-6 items-center">
                        <p className="lg:text-xl">TeamNest@bk.ru</p>
                        <Link href="/" className="size-8 relative">
                            <Image
                            src="/images/icons/VK.svg"
                            alt="vk"
                            fill
                            ></Image>
                        </Link>
                        <Link href="/" className="size-8 relative">
                            <Image
                            src="/images/icons/Telegram.svg"
                            alt="telegram"
                            fill
                            ></Image>
                        </Link>
                    </div>
                    <nav className="flex gap-6 ">
                        <Link href="/" className="hover:text-gray-600 text-xl">Партнер</Link>
                        <Link href="/" className="hover:text-gray-600 text-xl">Партнер</Link>
                        <Link href="/" className="hover:text-gray-600 text-xl">Партнер</Link>
                        <Link href="/" className="hover:text-gray-600 text-xl">Партнер</Link>
                    </nav>
                </div>
                <hr className="border-border" />
                 <div className="flex justify-between items-center">
                    <div className="flex items-center gap-8">
                        <Link href="/" className="w-35 h-5  relative">
                            <Image 
                            src="/images/Logo-dark.svg"
                            alt="/"
                            fill
                            className="object-cover object-center"></Image>
                        </Link>
                        <nav className="flex gap-6">
                            <Link href="/personnel" className=" hover:text-gray-600">Кадры</Link>
                            <Link href="/startups" className=" hover:text-gray-600">Стартапы</Link>
                            <Link href="/contacts" className=" hover:text-gray-600">Контакты</Link>
                        </nav>
                    </div>
                    <p>©2026</p>
                </div>
            </div>
                    

                

            <div className="flex flex-col gap-6 items-center lg:hidden">
                 <Link href="/" className="w-35 h-5 relative">
                    <Image 
                    src="/images/Logo-dark.svg"
                    alt="/"
                    fill
                    className="object-contain"></Image>
                </Link>

                <nav className="flex flex-col gap-6 text-center">
                    <Link href="/personnel" className=" hover:text-gray-600">Кадры</Link>
                    <Link href="/startups" className=" hover:text-gray-600">Стартапы</Link>
                    <Link href="/contacts" className=" hover:text-gray-600">Контакты</Link>
                </nav>

                <hr  className="border-border"/>

                <nav className="flex flex-col gap-6  text-center">
                    <Link href="/" className="hover:text-gray-600">Партнер</Link>
                    <Link href="/" className="hover:text-gray-600">Партнер</Link>
                    <Link href="/" className="hover:text-gray-600">Партнер</Link>
                    <Link href="/" className="hover:text-gray-600">Партнер</Link>
                </nav>

                <div className=" flex gap-4 items-center justify-between w-full">
                    <div>
                        <p className="">TeamNest@bk.ru</p>
                        <Link href="/" className="size-8 relative">
                            <Image
                            src="/images/icons/VK.svg"
                            alt="vk"
                            fill
                            ></Image>
                        </Link>
                        <Link href="/" className="size-8 relative">
                            <Image
                            src="/images/icons/Telegram.svg"
                            alt="telegram"
                            fill
                            ></Image>
                        </Link>
                    </div>

                     <p>©2026</p>
                </div>
            </div>
        </footer>
    )
}