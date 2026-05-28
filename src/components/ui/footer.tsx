import Image from "next/image";
import Link from "next/link";

const partners = [
  { name: "Партнер 1", url: "https://partner1.ru" },
  { name: "Партнер 2", url: "https://partner2.ru" },
  { name: "Партнер 3", url: "https://partner3.ru" },
  { name: "Партнер 4", url: "https://partner4.ru" },
];

export function Footer () {
    return(
        <footer className="px-16 py-12 flex flex-col ">
            <div className="hidden lg:flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <div className="text-xl flex gap-6 items-center">
                        <p>TeamNest@bk.ru</p>
                        <div className="size-8 relative">
                            <Image
                            src="/images/icons/VK.svg"
                            alt="vk"
                            fill
                            ></Image>
                        </div>
                        <div className="size-8 relative">
                            <Image
                            src="/images/icons/Telegram.svg"
                            alt="vk"
                            fill
                            ></Image>
                        </div>
                    </div>
                </div>
                
            </div>

            <div className="flex lg:hidden">
                <Link href=""></Link>
            </div>
        </footer>
    )
}