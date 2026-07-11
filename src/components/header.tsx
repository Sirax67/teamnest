"use client"

import Link  from "next/link";
import Image from "next/image";
import { ChevronDown, CircleUser, FolderOpen, LogOut, MenuIcon, Notebook, Settings, Star, X } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../app/lib/client/api";
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { authClient } from "../app/lib/client/auth-client";
import { useRouter } from "next/navigation";

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenMenu, setIsOpenMenu] = useState(false);
    const {data: session} = authClient.useSession();
    const isAdmin = (session?.user as any)?.role === "ADMIN";

    const router = useRouter();

    const { data: personnel, isLoading } = useQuery({
        queryKey: ["personnel-me"],
        queryFn: async () => (await api.personnel.me.get()).data,
    });

    return (
        <header className="px-10 w-full ">
            <div className="shadow-xl bg-primary p-3 z-[80] lg:w-170 fixed rounded-2xl mx-4 mt-4 lg:mx-auto left-0 right-0 flex gap-12 items-center justify-between">
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

                {!personnel && (                
                    <Link href="/auth/sign-up" className="bg-white px-4 py-2 rounded-xl hover:bg-cadr transition hidden lg:flex">
                        Зарегистрироваться
                    </Link>
                )}
                
                {!isLoading && personnel && (
                    <div className="hidden lg:flex">
                    <DropdownMenu open={isOpenMenu} onOpenChange={setIsOpenMenu} >
                        <DropdownMenuTrigger asChild>
                            <Button  className="hover:bg-transparent bg-transparent focus:outline-none focus-visible:outline-none focus-visible:ring-0 p-0 border-0">
                                <img
                                    src={personnel?.avatar ? `/api/files/${personnel.avatar}` : "/images/default-avatar.svg"}
                                    onError={(e) => { e.currentTarget.src = "/images/default-avatar.svg" }}
                                    alt=""
                                    className="w-8 aspect-square rounded-full object-cover object-center"
                                />
                                <ChevronDown className={
                                    isOpenMenu ? "rotate-180 transition-all" : ""
                                }/>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="mt-5 p-4 gap-4 w-auto">
                            <DropdownMenuGroup>
                                <DropdownMenuItem>
                                    <div className="flex items-center gap-2">
                                        <img
                                            src={personnel?.avatar ? `/api/files/${personnel.avatar}` : "/images/default-avatar.svg"}
                                            onError={(e) => { e.currentTarget.src = "/images/default-avatar.svg" }}
                                            alt=""
                                            className="w-10 aspect-square rounded-full object-cover object-center"
                                        />
                                        <div>
                                            <p className="font-medium">
                                                {personnel.name}
                                            </p>
                                            <p  className="text-sm text-muted-foreground">
                                                {session?.user.email}
                                            </p>
                                        </div>
                                    </div>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Link href="/profile/main"
                                        className="flex items-center gap-2 py-2"
                                    >
                                        <CircleUser className="size-5"/>
                                        Мой профиль
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Link href="/profile/projects"
                                        className="flex items-center gap-2 py-2"
                                    >
                                        <FolderOpen className="size-5"/>
                                        Мои проекты
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Link href="/profile/responses"
                                        className="flex items-center gap-2 py-2"
                                    >
                                        <Notebook className="size-5"/>
                                        Отклики
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Link href="/profile/favorites"
                                        className="flex items-center gap-2 py-2"
                                    >
                                        <Star className="size-5"/>
                                        Избранные
                                    </Link>
                                </DropdownMenuItem>
                                {isAdmin && (
                                   <DropdownMenuItem>
                                        <Link href="/admin/categories"
                                            className="flex items-center gap-2 py-2"
                                        >
                                            <Settings className="size-5"/>
                                            Админ панель
                                        </Link>
                                    </DropdownMenuItem>
                                )}
                            </DropdownMenuGroup>

                            <DropdownMenuSeparator />
                            
                            <Button 
                                variant={"link"}
                                className="cursor-pointer text-red-500"
                                onClick={() => authClient.signOut({ fetchOptions: { onSuccess: () => { window.location.href = "/" } } })}
                            >
                                <LogOut/>
                                Выйти
                            </Button>
                        </DropdownMenuContent>
                     </DropdownMenu>
                    
                        
                    </div>
                )}
                <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden text-white">
                    {isOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
                </button>
            </div>

            {isOpen && (
                <div className="fixed inset-0 bg-white z-50 flex flex-col gap-6 pt-24 p-6">

                    
                    <nav className="flex flex-col gap-4">
                        <Link 
                            href="/personnel" 
                            className=" hover:text-gray-300 transition"
                            onClick={() => setIsOpen(false)}
                        >
                            Кадры
                        </Link>
                        <Link 
                            href="/startups" 
                            className=" hover:text-gray-300 transition"
                            onClick={() => setIsOpen(false)}
                        >
                            Стартапы
                        </Link>
                        <Link 
                            href="/contacts" 
                            className=" hover:text-gray-300 transition"
                            onClick={() => setIsOpen(false)}
                        >
                            Контакты
                        </Link>
                    </nav>
                    {!isLoading && personnel && (
                        <div className="flex flex-col w-full border-t py-4">
                            <div className="flex items-center gap-2 mb-6">
                                <img
                                    src={personnel?.avatar ? `/api/files/${personnel.avatar}` : "/images/default-avatar.svg"}
                                    onError={(e) => { e.currentTarget.src = "/images/default-avatar.svg" }}
                                    alt=""
                                    className="w-12 aspect-square rounded-full object-cover object-center"
                                />
                                <div>
                                    <p className="font-medium">
                                        {personnel.name}
                                    </p>
                                    <p  className="text-sm text-muted-foreground">
                                        {session?.user.email}
                                    </p>
                                </div>
                            </div>
                            
                            <Link href="/profile/main"
                                className="flex items-center gap-2 py-2"
                            >
                                <CircleUser className="size-5"/>
                                Мой профиль
                            </Link>

                            <Link href="/profile/projects"
                                className="flex items-center gap-2 py-2"
                            >
                                <FolderOpen className="size-5"/>
                                Мои проекты
                            </Link>

                            <Link href="/profile/responses"
                                className="flex items-center gap-2 py-2"
                            >
                                <Notebook className="size-5"/>

                                Отклики
                            </Link>

                            <Link href="/profile/favorites"
                                className="flex items-center gap-2 py-2"
                            >
                                <Star className="size-5"/>
                                Избранные
                            </Link>

                            {isAdmin && (
                                <Link href="/admin/categories"
                                    className="flex items-center gap-2 py-2"
                                >
                                    <Settings className="size-5"/>
                                    Админ панель
                                </Link>
                            )}

                            <button
                                onClick={() => authClient.signOut({ fetchOptions: { onSuccess: () => { window.location.href = "/" } } })}
                                className="flex items-center gap-2 py-2 text-red-500 cursor-pointer"
                            >
                                <LogOut className="size-5"/>
                                Выйти
                            </button>
                        </div>
                    )}

                    {!personnel && (
                        <Link href="/auth/sign-up" className="bg-primary text-white px-4 py-2 rounded-xl hover:bg-primary/90 transition text-center mt-auto">
                            Зарегистрироваться
                        </Link>
                    )}
                </div>
            )}
        </header>
    )
}
