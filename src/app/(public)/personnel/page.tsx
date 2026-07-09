"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api } from "@/src/app/lib/client/api";
import CardPersonnel from "@/src/components/personnel/CardPersonnel";
import { useQuery } from "@tanstack/react-query"
import { Search } from "lucide-react";
import { useState } from "react";

import type { Category } from "@/src/app/lib/types/category"
import type { Specialty } from "@/src/app/lib/types/specialty"

export default function Personnel() {
    const [categoryId, setCategoryId] = useState("")
    const [specialtyId, setSpecialtyId] = useState("")
    const [search, setSearch] = useState("")

    const { data: personnel, isLoading } = useQuery({
        queryKey: ["personnel"],
        queryFn: async () => {
            return (await api.personnel.get()).data;
        }
    })

    const { data: categories } = useQuery({
        queryKey: ["categories"],
        queryFn: async () => (await api.categories.get()).data,
    })

    const { data: allSpecialties } = useQuery({
        queryKey: ["specialties"],
        queryFn: async () => (await api.specialties.get()).data,
    })

    const filtered = personnel?.filter(p => {
        if (categoryId && categoryId !== "all" && p.categoryId !== categoryId) return false
        if (specialtyId && specialtyId !== "all" && p.specialtiesId !== specialtyId) return false
        return true
    })

    const { data: searchResults } = useQuery({
        queryKey: ["personnel-search", search],
        queryFn: async () => (await api.personnel.search.get({ query: { q: search } })).data,
        enabled: search.length >= 1,
    })
    const displayData = search.length >= 1 ? (searchResults ?? []) : (filtered ?? [])


    const specialties = (allSpecialties as Specialty[])?.filter(s => s.categoryId === categoryId) ?? []

    return(
        <div className="py-12 px-16 my-20 flex flex-col gap-12 container mx-auto">
            <div className="flex flex-col gap-4 justify-center text-center items-center w-full">
                <h1 className=" font-semibold text-[clamp(24px,5vw,28px)] md:text-4xl lg:text-6xl bg-clip-text text-transparent bg-gradient-to-br from-muted-foreground via-foreground to-muted-foreground max-w-[35ch]">
                    Кадры в поиске стартапа
                </h1>
                <p className="lg:text-xl text-muted-foreground max-w-[60ch] mx-auto">
                    Разместите информацию о себе в каталоге — дайте стартапам 
                    возможность найти вас и пригласить в команду! Перспективные 
                    проекты уже рядом.
                </p>
            </div>

            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
                    <Select
                        value={categoryId}
                        onValueChange={val => { setCategoryId(val); setSpecialtyId("") }}
                    >
                        <SelectTrigger className="w-full py-5 px-4 bg-card">
                            <SelectValue placeholder="Категория"/>
                        </SelectTrigger>
                        <SelectContent className="">
                            <SelectItem value="all" className="py-4 px-4">Все категории</SelectItem>
                            {(categories as Category[])?.map((c) => (
                                <SelectItem className="py-4 px-4" key={c.id} value={c.id}>{c.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select
                        value={specialtyId}
                        onValueChange={ setSpecialtyId}
                        disabled={!categoryId || categoryId === "all"}
                    >
                        <SelectTrigger className="w-full py-5 px-4 bg-card">
                            <SelectValue placeholder="Специальность" />
                        </SelectTrigger>
                        <SelectContent className="">
                            <SelectItem value="all" className="py-4 px-4">Все специальности</SelectItem>
                            {specialties.map((s) => (
                                <SelectItem className="py-4 px-4" key={s.id} value={s.id}>{s.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <div className="
                        relative flex items-center justify-between 
                        lg:col-start-4 
                        w-full 
                        border border-border 
                        rounded-lg py-2 px-4
                        outline-none focus:border-gray-400 
                        bg-card
                        ">
                        <input
                            className="focus:border-none focus:outline-none"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Поиск специалиста"
                        />
                        <Search className="text-muted-foreground/60 size-5" />
                        
                    </div>
            </div>

            {isLoading ? (
                <div className="text-muted-foreground text-center py-20">
                    <p>Загрузка профилей...</p>
                </div>
            ) : personnel?.length === 0 ? (
                <div className="text-muted-foreground text-center py-20">
                    <p>Кадров пока нет</p>
                </div>
            ) : filtered?.length === 0 || displayData.length === 0 ? (
                <div className="text-muted-foreground text-center py-20">
                    <p>Ничего не найдено по заданным параметрам.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    <CardPersonnel filters={{categoryId, specialtyId}} data={displayData}/>
                </div>
            )}
            
        </div>

    )
}
