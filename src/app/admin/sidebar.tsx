"use client"

import { Grid2x2, LayoutGrid } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

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
        <div className="fixed left-0 h-screen bg-gray-950 rounded-r-2xl flex flex-col gap-4 text-white py-20 px-4">
            <Link href="/" className="w-35 h-5 relative">
                <Image
                    src="/images/Logo.svg"
                    alt="/"
                    fill
                    className="object-cover object-center"
                />
            </Link>
            <hr className="border border-gray-900" />

            {links.map(({ href, label }) => (
                <Link
                    key={href}
                    href={href}
                    className={cn(
                        "hover:bg-gray-900 transition px-4 py-2 rounded-sm",
                        pathname === href && "bg-gray-800"
                    )}
                >
                    {label}
                </Link>
            ))}
        </div>
    )
}
