import Image from "next/image";
import Link from "next/link";

export function Footer () {
    return(
        <footer className="px-16 py-12 flex flex-col ">
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
                            alt="vk"
                            fill
                            ></Image>
                        </Link>
                    </div>
                    <div className="flex gap-6 ">
                        <Link href="/" className="hover:text-gray-600 lg:text-xl">Партнер</Link>
                        <Link href="/" className="hover:text-gray-600 lg:text-xl">Партнер</Link>
                        <Link href="/" className="hover:text-gray-600 lg:text-xl">Партнер</Link>
                        <Link href="/" className="hover:text-gray-600 lg:text-xl">Партнер</Link>
                    </div>
                </div>
                <hr className="border-gray-200" />
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
                    <p>©2023</p>
                </div>
            </div>
                    

                

            <div className="flex lg:hidden">
                
            </div>
        </footer>
    )
}