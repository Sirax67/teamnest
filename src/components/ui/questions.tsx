import Image from "next/image";
import Link from "next/link";

export function Questions () {
    return(
        <section className="px-16 py-12">
            <div className="mx-auto bg-gray-100 border border-gray-200 rounded-2xl p-4 h-75 relative">
                <div className="w-full z-0 lg:hidden ">
                    <Image
                        src="/images/@.png"
                        alt="Background"
                        fill
                        className="object-cover object-center"
                    />
                </div>
                
                <div className="flex justify-between h-full">
                    <div className="flex flex-col justify-between">
                        <div className="flex flex-col gap-2">
                            <h2 className="text-3xl lg:text-6xl font-medium">Остались вопросы?</h2>
                            <p className="text-gray-500">Хотите стать нашим автором или задать любой другой вопрос? <br />Напишите нам!</p>
                        </div>

                        <button className="outline-offset-1 border-white w-full sm:w-fit text-center text-white bg-gray-950 py-3 px-4 rounded-xl lg:text-xl cursor-pointer font-medium hover:bg-gray-900 transition relative">
                            Задать вопрос
                        </button>
                    </div>
                    
                    <div className="hidden lg:flex w-105 relative ">
                        <Image 
                            src="/images/@.png" 
                            alt="" 
                            fill
                            className="object-cover object-top">
                        </Image>
                    </div>
                </div>
                
                
            </div>
        </section>
    )
}