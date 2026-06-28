"use client"

import { useMutation } from "@tanstack/react-query"
import z from "zod/v4"
import { authClient } from "../../lib/client/auth-client"
import { useForm } from "@tanstack/react-form"
import { MoveLeft } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"

export default function SignUp() {

    const RegisterSchema = z.object({
        name: z.string(),
        email: z.email(),
        password: z.string().min(8, { message: "Пароль минимум 8 символов" }),
        confirmPassword: z.string(),
    }).refine((data) => data.password === data.confirmPassword, {
        message: "Пароли не совпадают",
        path: ["confirmPassword"]
    })

    const signUpMutation = useMutation({
        mutationKey: ["sign-up"],
        mutationFn: async (data: Omit<z.infer<typeof RegisterSchema>, "confirmPassword">) => {
            const { error } = await authClient.signUp.email(data)
            if (error) throw new Error(error.message)
        },
        onSuccess: () => {
            toast.success("Успешная регистрация")
        },
        onError: (error) => {
            toast.error(error.message)
        }
    })

    const form = useForm({
        defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
        onSubmit: async ({ value }) => {
            const { confirmPassword, ...data } = value
            await signUpMutation.mutateAsync({ ...data, name: "" })
        },
        validators: {
            onSubmit: RegisterSchema,
        },
    })

    return (
        <div className="container mx-auto w-full flex flex-col h-screen items-center justify-center">
            <div className="flex flex-col gap-8 w-100">
                <div className="w-full">
                    <Link href="/" className="flex gap-2">
                        <MoveLeft />
                        Назад
                    </Link>
                </div>

                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl font-semibold">Регистрация</h1>
                    <p className="text-gray-500">Заполните данные, чтобы создать аккаунт</p>
                </div>

                <form
                    className="flex flex-col gap-4"
                    onSubmit={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        form.handleSubmit()
                    }}
                >
                    <form.Field name="email">
                        {(field) => (
                            <div className="flex flex-col gap-1">
                                <Input
                                    className="bg-gray-50 rounded-xl py-3 h-auto"
                                    type="email"
                                    value={field.state.value}
                                    placeholder="Почта"
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    errors={field.state.meta.errors.flatMap((e) => e?.message ?? "")}
                                />
                            </div>
                        )}
                    </form.Field>
                    <form.Field name="password">
                        {(field) => (
                            <div className="flex flex-col gap-1">
                                <Input
                                    className="bg-gray-50 rounded-xl py-3 h-auto"
                                    type="password"
                                    value={field.state.value}
                                    placeholder="Пароль"
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    errors={field.state.meta.errors.flatMap((e) => e?.message ?? "")}
                                />
                            </div>
                        )}
                    </form.Field>
                    <form.Field name="confirmPassword">
                        {(field) => (
                            <div className="flex flex-col gap-1">
                                <Input
                                    className="bg-gray-50 rounded-xl py-3 h-auto"
                                    type="password"
                                    value={field.state.value}
                                    placeholder="Повторите пароль"
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    errors={field.state.meta.errors.flatMap((e) => e?.message ?? "")}
                                />
                            </div>
                        )}
                    </form.Field>
                    <form.Subscribe>
                        {(formState) => (
                            <button
                                type="submit"
                                disabled={signUpMutation.isPending}
                                className="border-white text-center text-white bg-gray-950 py-2 px-4 rounded-xl cursor-pointer font-medium hover:bg-gray-900 w-full disabled:opacity-50"
                            >
                                Зарегистрироваться
                            </button>
                        )}
                    </form.Subscribe>
                    <div className="justify-center text-sm flex gap-2 text-gray-500">
                        Уже есть аккаунт?
                        <Link href="/auth/sign-in" className="underline hover:text-gray-400">
                            Войти
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}
