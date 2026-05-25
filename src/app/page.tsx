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
    <section className="w-screen h-screen">
      <div className="w-full h-full absolute left-0 right-0 top-0 z-0 ">
        <Image
          className="object-cover object-center"
          src="/images/welcome/background-img.png"
          alt=""
          fill
        ></Image>
      </div>

      <div className="z-10 relative text-center">
        <div>Вместе сильнее</div>
        <div>
          <h1 className="text-6xl bg-clip-text text-transparent bg-gradient bg-gradient-to-r from-gray-500 to-black">TEAMNEST объединяем амбициозных для создания больших проектов</h1>
          <p>
            Мы объединяем 
            <span className="font-semibold italic">амбициозных</span> 
            и 
            <span className="font-semibold italic">молодых</span>  
            специалистов, чтобы запускать 
            <span className="font-semibold italic">сильные команды</span>
            и воплощать 
            <span className="font-semibold italic">смелые идеи</span> в жизнь.
          </p>
        </div>
      </div>
    </section>
  )
}