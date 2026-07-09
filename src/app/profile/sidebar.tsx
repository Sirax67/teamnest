"use client"

import { CircleUser, FolderOpen, Star, LogOut, MenuIcon, Notebook, Settings } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { authClient } from "../lib/client/auth-client"
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTrigger } from "@/components/ui/sheet"


export function Sidebar () {
    const pathname = usePathname();
    const { data: session } = authClient.useSession()
    const isAdmin = (session?.user as any)?.role === "ADMIN"

    const links = [
        {icon: <CircleUser className="size-5"/>, href: "/profile/main", label: "Мой профиль" },
        {icon: <FolderOpen className="size-5"/>, href: "/profile/projects", label: "Мои стартапы" },
        {icon: <Notebook className="size-5"/>, href: "/profile/responses", label: "Отклики" },
        {icon: <Star className="size-5"/>, href: "/profile/favorites", label: "Избранное" },
    ]

    return (

        <div>
            <div className="fixed w-full flex items-center justify-between p-4 shadow-lg md:hidden bg-white z-50">
                <Link href="/" className="w-32 h-6 relative">
                    <Image
                        src="/images/Logo-dark.svg"
                        alt="/"
                        fill
                        className="object-contain object-center"
                    />
                </Link>

                <Sheet>
                    <SheetTrigger>
                        <button className="cursor-pointer hover:bg-transparent bg-transparent focus:outline-none focus-visible:outline-none focus-visible:ring-0">
                            <MenuIcon className="w-6 h-6" />
                        </button>
                    </SheetTrigger>
                    <SheetContent>
                        <SheetHeader className="border-b">
                            <Link href="/" className="w-32 h-6 relative">
                                <Image
                                    src="/images/Logo-dark.svg"
                                    alt="/"
                                    fill
                                    className="object-contain object-center"
                                />
                            </Link>
                        </SheetHeader>
                        <div className="px-4 flex flex-col gap-4">

                            {links.map(({icon, href, label }) => (
                                <Link
                                    key={href}
                                    href={href}
                                    className={cn(
                                        " hover:bg-zinc-100 transition-all px-4 py-2 rounded-sm flex items-center gap-2 text-gray-400",
                                        pathname === href && "bg-zinc-200 text-black"
                                    )}
                                >
                                    {icon}
                                    {label}
                                </Link>
                            ))}
                            {isAdmin && (
                                <Link
                                    href="/admin"
                                    className={cn(
                                        "hover:bg-zinc-100 transition-all px-4 py-2 rounded-sm flex items-center gap-2 text-gray-400",
                                        pathname.startsWith("/admin") && "bg-zinc-200 text-black"
                                    )}
                                >
                                    <Settings className="size-5"/>
                                    Админ панель
                                </Link>
                            )}
                        </div>
                        <SheetFooter>
                            <Button 
                                variant={"destructive"}
                                className="py-2 h-auto cursor-pointer text-red-500 bg-transparent"
                                onClick={() => authClient.signOut({ fetchOptions: { onSuccess: () => { window.location.href = "/" } } })}
                            >
                                <LogOut/>
                                Выйти
                            </Button>
                        </SheetFooter>
                    </SheetContent>
                </Sheet>
            </div>

            <div className="hidden md:flex  fixed left-0 h-screen bg-gray-50 border-r rounded-r-2xl  flex-col gap-4 px-4 pb-10">
                <Link href="/" className="w-full h-6 relative mt-20 mb-10">
                    <Image
                        src="/images/Logo-dark.svg"
                        alt="/"
                        fill
                        className="object-contain object-center"
                    />
                </Link>
                <hr className="" />

                {links.map(({icon, href, label }) => (
                    <Link
                        key={href}
                        href={href}
                        className={cn(
                            " hover:bg-zinc-200 transition-all px-4 py-2 rounded-sm flex items-center gap-2 text-gray-400",
                            pathname === href && "bg-zinc-300 text-black"
                        )}
                    >
                        {icon}
                        {label}
                    </Link>
                ))}
                {isAdmin && (
                    <Link
                        href="/admin"
                        className={cn(
                            "hover:bg-zinc-200 transition-all px-4 py-2 rounded-sm flex items-center gap-2 text-gray-400",
                            pathname.startsWith("/admin") && "bg-zinc-300 text-black"
                        )}
                    >
                        <Settings className="size-5"/>
                        Админ панель
                    </Link>
                )}
                <div className=" mt-auto">
                    <Button 
                        variant={"link"}
                        className="py-2 h-auto cursor-pointer text-red-500"
                        onClick={() => authClient.signOut({ fetchOptions: { onSuccess: () => { window.location.href = "/" } } })}
                    >
                        <LogOut/>
                        Выйти
                    </Button>
                </div>
            </div>
        </div>
    )
}
