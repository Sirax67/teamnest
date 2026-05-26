import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div>
        <Welcome/>
    </div>
  );
}

function Welcome() {
  return(
    <section className="w-screen h-screen flex flex-col justify-center">
      <div className="w-full h-full absolute z-0 pointer-events-none">
        <Image
          className="object-cover object-center"
          src="/images/welcome/background-img.png"
          alt=""
          fill
        ></Image>
      </div>

      <div className="flex flex-col gap-20 justify-center items-center p-4">
        <div className="z-10 relative text-center flex flex-col gap-6 items-center ">
          <div className="bg-blue-100 text-blue-600 flex rounded-full py-2 px-4 font-medium text-center w-fit lg:text-xl">Вместе сильнее!</div>
          <div className="flex flex-col gap-4">
            <h1 className="mx-auto font-semibold text-[clamp(24px,5vw,28px)] md:text-4xl lg:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-gray-500 to-black max-w-[35ch]">
              TEAMNEST объединяем амбициозных для создания больших проектов
            </h1>
            <p className="lg:text-xl text-gray-500 max-w-[60ch] mx-auto">
              Мы объединяем
              <span className="font-semibold"> амбициозных </span> 
              и 
              <span className="font-semibold"> молодых </span>  
              специалистов, чтобы запускать 
              <span className="font-semibold"> сильные команды </span>
              и воплощать 
              <span className="font-semibold"> смелые идеи </span> в жизнь.
            </p>
          </div>
        </div>

        <Link href="/" className="outline-offset-1 border-white w-full lg:w-fit text-center text-white bg-gray-950 py-3 px-4 rounded-xl lg:text-xl cursor-pointer font-medium hover:bg-gray-900 transition relative">
          Зарегистрироваться
        </Link>
      </div>
      
    </section>
  )
}

