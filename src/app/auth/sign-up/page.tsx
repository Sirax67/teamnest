"use client"

import { useMutation } from "@tanstack/react-query"
import z from "zod"
import { authClient } from "../../lib/client/auth-client"
import { useForm } from "@tanstack/react-form";
import { MoveLeft } from "lucide-react";
import Link from "next/link";


export default function SignUp () {

    const schema = z.object({
        email: z.email(),
        password: z.string(),
        name: z.string(),
    })

    const signUpMutation = useMutation({
        mutationKey: ["sing-up"],
        
        mutationFn: async (data: z.infer<typeof schema>) => {
            await authClient.signUp.email(data);
        },
        onSuccess: () => {
            alert("Успешно")
        }
    });

    const form = useForm ({
        defaultValues: {} as z.infer<typeof schema>,
        onSubmit: async ({value}) => {
            signUpMutation.mutate(value)
        },
        validators: {
            onSubmit: schema,
        },
    });

    return (
        <div className="container mx-auto  w-full flex flex-col h-screen items-center justify-center">
            <div className="flex flex-col gap-8 w-100">
                <div className="w-full">
                    <Link href="/" className="flex gap-2">
                        <MoveLeft/>
                        Назад
                    </Link>
                </div>

                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl font-semibold">Регистрация</h1>
                    <p className="text-gray-500">Заполните данные, чтобы создать аккаунт</p>
                </div>

                
                <form 
                className="flex flex-col gap-4 "
                onSubmit={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        form.handleSubmit();
                }}>
                    <form.Field name="email">
                        {(field) => (
                            <div>
                                <input 
                                    type="email"
                                    className="bg-gray-100 border border-gray-300 rounded-xl py-2 px-4 outline-gray-300 w-full"
                                    value={field.state.value}
                                    placeholder="Почта"
                                    onChange={(e) => field.handleChange(e.target.value)}
                                />
                            </div>
                        )}
                    </form.Field>
                    <form.Field name="password">
                        {(field) => (
                            <div>
                                <input 
                                    type="password" 
                                    className="bg-gray-100 border border-gray-300 rounded-xl py-2 px-4 outline-gray-300 w-full"
                                    value={field.state.value}
                                    placeholder="Пароль"
                                    onChange={(e) => field.handleChange(e.target.value)}
                                />
                            </div>
                        )}
                    </form.Field>
                    <form.Field name="name">
                        {(field) => (
                            <div>
                                <input 
                                    type="text" 
                                    className="bg-gray-100 border border-gray-300 rounded-xl py-2 px-4 outline-gray-300 w-full"
                                    value={field.state.value}
                                    placeholder="Имя"
                                    onChange={(e) => field.handleChange(e.target.value)}
                                />
                            </div>
                        )}
                    </form.Field>
                    <form.Subscribe>
                        {(state) => (
                            <button type="submit" className="
                                border-white text-center text-white bg-gray-950 py-2 px-4 rounded-xl  cursor-pointer font-medium hover:bg-gray-900 w-full 
                                "
                            >
                                Зарегистрироваться
                            </button>
                        )}
                    </form.Subscribe>
                    <div className="justify-center text-sm flex gap-2 text-gray-500">
                        Уже есть аккаунт? 
                        <Link 
                            href="/auth/sign-in" 
                            className="underline hover:text-gray-400">
                            Войти
                        </Link>
                    </div>
                </form>
            </div>
            
        </div>
    )
}