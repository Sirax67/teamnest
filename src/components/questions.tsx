"use client"
import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link";

export function Questions () {
    const [open, setOpen] = useState(false)
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [question, setQuestion] = useState("")
    const [checked, setChecked] = React.useState(false)
    

    const handleSubmit = () => {
        if (!name || !email || !question) {
            toast.error("Заполните все поля")
            return
        } else if (!checked) {
            toast.error("Подтвердите согласие");
            return;
        }
        toast.success("Вопрос отправлен!")
        setOpen(false)
        setName("")
        setEmail("")
        setQuestion("")
    }

    return(
        <section className="px-4 sm:px-8 lg:px-16 py-12 container mx-auto">

            <div className="bg-card border border-border rounded-2xl relative overflow-hidden">

                <div className="absolute inset-0 z-0 overflow-hidden">
                    <div className="absolute right-0  w-105 h-105">
                        <Image
                            src="/images/@.png"
                            alt=""
                            fill
                            className="object-contain"
                        />
                    </div>
                </div>

                <div className="relative z-10 p-6 sm:p-10 lg:p-12 flex flex-col gap-15">
                    <div className="flex flex-col gap-2">
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium leading-tight">Остались вопросы?</h2>
                        <p className="text-muted-foreground text-sm sm:text-base max-w-[50ch]">Хотите стать нашим автором или задать любой другой вопрос? Напишите нам!</p>
                    </div>

                    <Button
                        onClick={() => setOpen(true)}
                        className="w-fit cursor-pointer text-lg font-medium"
                    >
                        Задать вопрос
                    </Button>
                </div>
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="md:min-w-125 p-0 gap-0 ">
                <DialogHeader className="bg-card p-4 rounded-t-xl">
                    <DialogTitle>
                       Обратная связь
                    </DialogTitle>
                </DialogHeader>
                    <div className="flex flex-col gap-4 p-4">
                        <Input placeholder="Имя" value={name} onChange={e => setName(e.target.value)} />
                        <Input placeholder="Почта" value={email} onChange={e => setEmail(e.target.value)} />
                        <Textarea className="max-h-70" placeholder="Ваш вопрос" value={question} onChange={e => setQuestion(e.target.value)} />
                        <div className="flex items-start gap-2">
                            <Checkbox id="terms" onCheckedChange={(val) => setChecked(val === true)} />
                            <label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer">
                                Я принимаю условия <Link href="/" className="text-blue-600 underline">публичной оферты</Link> и подтверждаю своё согласие с ними.
                            </label>
                        </div>
                        <Button onClick={handleSubmit}  className="cursor-pointer h-auto py-3">
                            Задать вопрос
                        </Button>
                        
                    </div>
                </DialogContent>
            </Dialog>

        </section>
    )
}
