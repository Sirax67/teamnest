import Link from "next/link";
import Image from "next/image";
import {AboutCard} from "../components/aboutCard";

export default function Home() {
  return (
    <div >
        <Welcome/>
        <About/>
    </div>
  );
}

function Welcome() {
  return(
    <section className="w-full h-screen flex justify-center overflow-y-auto">
      <div className="w-full h-full absolute z-0 pointer-events-none">
        <Image
          className="object-cover object-center"
          src="/images/welcome/background-img.png"
          alt=""
          fill
        ></Image>
      </div>

      <div className="flex flex-col gap-20 justify-center items-center p-4 ">
        <div className="z-10 relative text-center flex flex-col gap-6 items-center ">
          <div className="bg-blue-100 text-blue-600 flex rounded-full py-2 px-4 font-medium text-center w-fit lg:text-xl">Вместе сильнее!</div>
          <div className="flex flex-col gap-4">
            <h1 className="font-semibold text-[clamp(24px,5vw,28px)] md:text-4xl lg:text-6xl bg-clip-text text-transparent bg-gradient-to-br from-[#5D5D5D] via-[#1C1C1C] to-[#5D5D5D] max-w-[35ch]">
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

        <Link href="/" className="outline-offset-1 border-white w-full sm:w-fit text-center text-white bg-gray-950 py-3 px-4 rounded-xl lg:text-xl cursor-pointer font-medium hover:bg-gray-900 transition relative">
          Зарегистрироваться
        </Link>
      </div>
      
    </section>
  )
}

function About () {
  return(
    <section className="py-12 px-16 text-center flex flex-col gap-12 items-center">
      
      <div className="flex flex-col gap-4 items-center">
        <h2 className="
          font-semibold 
          text-[clamp(24px,5vw,28px)] md:text-4xl lg:text-6xl 
          bg-clip-text text-transparent bg-gradient-to-br from-[#5D5D5D] via-[#1C1C1C] to-[#5D5D5D]
          max-w-[30ch]
        ">
          Платформа для тех, кто хочет создавать, а не ждать
        </h2>
        <p className="lg:text-xl text-gray-500 max-w-[60ch]">Мы помогаем находить команду, запускать стартапы и делать первые шаги к настоящим изменениям.</p>
      </div>
      
      <div className="">
        <AboutCard/>
      </div>
     
      <p className="lg:text-2xl max-w-[75ch]">Наша миссия — дать каждому шанс воплотить идею в жизнь и получить поддержку на каждом этапе пути. Присоединяйтесь и начинайте строить будущее вместе с нами!</p>
      
    </section>
  )
}