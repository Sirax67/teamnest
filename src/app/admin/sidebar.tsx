"use client"

import { MenuIcon, MoveLeft } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTrigger } from "@/components/ui/sheet"

export function Sidebar () {
    const pathname = usePathname();

    const links = [
        { href: "/admin/categories", label: "Категории" },
        { href: "/admin/sectors", label: "Сектора" },
        { href: "/admin/personnel", label: "Кадры" },
        { href: "/admin/startups", label: "Стартапы" },
        { href: "/admin/specialties", label: "Специальности" },
    ]

    return (
        <div>
            <div className="fixed w-full flex items-center justify-between p-4 shadow-lg md:hidden bg-primary z-50">
                <Link href="/" className="w-32 h-6 relative">
                    <Image
                        src="/images/Logo.svg"
                        alt="/"
                        fill
                        className="object-contain object-center"
                    />
                </Link>

                <Sheet>
                    <SheetTrigger>
                        <button className="cursor-pointer hover:bg-transparent bg-transparent focus:outline-none focus-visible:outline-none focus-visible:ring-0">
                            <MenuIcon className="w-6 h-6 text-white" />
                        </button>
                    </SheetTrigger>
                    <SheetContent className="bg-primary text-white border-muted-foreground/10">
                        <SheetHeader className="border-b border-muted-foreground/10">
                            <Link href="/" className="w-32 h-6 relative">
                                <Image
                                    src="/images/Logo.svg"
                                    alt="/"
                                    fill
                                    className="object-contain object-center"
                                />
                            </Link>
                        </SheetHeader>
                        <div className="px-4 flex flex-col gap-4">

                            {links.map(({href, label }) => (
                                <Link
                                    key={href}
                                    href={href}
                                    className={cn(
                                        " hover:bg-muted-foreground/10 transition-all px-4 py-2 rounded-sm flex items-center gap-2 text-gray-400",
                                        pathname === href && "bg-muted-foreground/20 text-white"
                                    )}
                                >
                                    {label}
                                </Link>
                            ))}
                        </div>
                        <SheetFooter>
                            <Link 
                                href="/profile/main" 
                                className="px-4 py-2 rounded-sm flex items-center gap-2 text-gray-400">
                                <MoveLeft/>
                                Назад
                            </Link>
                        </SheetFooter>
                    </SheetContent>
                </Sheet>
            </div>
            
            <div className="hidden md:flex fixed left-0 h-screen bg-primary rounded-r-2xl flex-col gap-4 text-white py-20 px-4">
                <Link href="/" className="w-35 h-5 relative">
                    <Image
                        src="/images/Logo.svg"
                        alt="/"
                        fill
                        className="object-cover object-center"
                    />
                </Link>
                <hr className="border-muted-foreground/20" />

                {links.map(({ href, label }) => (
                    <Link
                        key={href}
                        href={href}
                        className={cn(
                            "hover:bg-muted-foreground/20 transition-all px-4 py-3 rounded-lg",
                            pathname === href && "bg-muted-foreground/30"
                        )}
                    >
                        {label}
                    </Link>
                ))}
            </div>
        </div>
    )
}

