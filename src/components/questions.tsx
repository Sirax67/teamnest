import Image from "next/image";

export function Questions () {
    return(
        <section className="px-4 sm:px-8 lg:px-16 py-12 container mx-auto">

            <div className="bg-gray-100 border border-gray-200 rounded-2xl relative overflow-hidden">

                {/* Картинка на заднем плане */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/images/@.png"
                        alt=""
                        fill
                        className="object-contain object-right"
                    />
                </div>

                {/* Контент поверх */}
                <div className="relative z-10 p-6 sm:p-10 lg:p-12 flex flex-col gap-6 sm:gap-10">
                    <div className="flex flex-col gap-2 max-w-xs sm:max-w-sm lg:max-w-md">
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium leading-tight">Остались вопросы?</h2>
                        <p className="text-gray-500 text-sm sm:text-base">Хотите стать нашим автором или задать любой другой вопрос? Напишите нам!</p>
                    </div>

                    <button className="w-full sm:w-fit text-center text-white bg-gray-950 py-3 px-6 rounded-xl text-base cursor-pointer font-medium hover:bg-gray-900 transition">
                        Задать вопрос
                    </button>
                </div>
            </div>
        </section>
    )
}
