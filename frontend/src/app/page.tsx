import Image from "next/image";
import { Gamepad2, Gift } from 'lucide-react';
import Head from "next/head";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Achieve Arcade',
  description:
    'game your productivity',
  icons: {
      icon: '/icons/logo.png',
  },
};

export default function LandingPage() {
  return (
    <div className="bg-black min-h-screen w-full">
      <div className="max-w-[1280px] mx-auto">
        
        {/* First Section with Navbar */}
        <section className="h-[900px] flex flex-col w-full">
          <nav className="py-5 px-8 flex items-center justify-between max-w-7xl mx-auto text-white w-full">
            <div className="flex items-center ">
              <div className="flex">
                <Image src={'/icons/logo.png'} alt="Achieve Arcade Logo" width={24} height={34} />
                <p className="leading-none text-[18px] ml-2 hover:text-[#FFA501]">ACHIEVE<br/>ARCADE</p>
              </div>
              <div className="flex space-x-[30px] ml-[30px]">
                <a href="#pricing" className="text-white hover:text-[#FFA501]">PRICING</a>
                <a href="#demo" className="text-white hover:text-[#FFA501]">DEMO</a>
              </div>
            </div>
            <button className="text-black  text-[20px] bg-white rounded-md px-4 hover:bg-[#FFA501]">
              LOGIN
            </button>
          </nav>
          <div className="w-full mt-[200px] flex px-8 text-white">
              <div className="w-1/2">
                  <div className="text-[60px] text-white leading-tight mb-[30px]">
                      Game your goals <br />
                      get <span className="text-black bg-white px-4">more done</span>
                  </div>
                  <div className="text-[20px] mb-[60px]">
                  Turn tasks into quests, earn rewards, and boost 
                  <br/> productivity with Achieve Arcade.
                  </div>
                  <button className="bg-[#FFA501] border border-[#FFA501] rounded-md px-4 py-2 text-[20px] text-black hover:text-[#FFA501] hover:bg-black">
                    <Gamepad2 size={24} className="inline-block mr-2" />
                    GET STARTED
                  </button>
                  <div className="mt-4">
                    <Gift size={24} className="inline-block mr-2 text-[#6FCF97]"/>
                    <span className="text-[#6FCF97] text-[15px]">FREE PRO ACCESS </span> 
                    for the first 50 users!
                  </div>

                  <div className="mt-[80px] flex flex-col text-[15px]">
                    <div>
                      "THIS IS WHAT I&apos;VE BEEN LOOKING FOR!" <br/>
                    </div>
                    <div className="flex items-center mt-2">
                      <div className="rounded-3xl bg-white w-10 h-10 inline-block mr-2"></div>
                      <div>SOME RANDOM NAME</div>

                    </div>
                  </div>

              </div>
              <div className="w-1/2 flex justify-center ">
              <div>
                <Image src={'/icons/landing/images/section-1.png'} alt="section 1" 
                width={564} height={535} style={{ imageRendering: 'pixelated' }}/>
              </div>
              </div>
         </div>
         <div className="text-white w-full flex justify-center mt-[100px] text-[13px] gap-4">
            <div>FEATURED ON</div>

            <div className="">PRODUCT HUNT</div>
            <div className="">reddit</div>
            <div className="">X</div>
         </div>
        </section>
        
        {/* Placeholder for remaining sections */}
        <section className="h-[900px] w-full">Section 2</section>
        <section className="h-[900px] w-full">Section 3</section>
        <section className="h-[900px] w-full">Section 4</section>
        <section className="h-[900px] w-full">Section 5</section>
        
      </div>
    </div>
  );
}
