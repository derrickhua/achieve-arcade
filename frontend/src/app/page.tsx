import Image from "next/image";
import { Gamepad2, Gift, Sparkle, Check, X, Sparkles, Copyright  } from 'lucide-react';
import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"


// Dynamically import FeatureSelect, which will be loaded only on the client side
const FeatureSelect = dynamic(() => import('@/components/landing/FeatureSelect'), {
  ssr: false, // This line is important. It disables server-side rendering for the component
});

export const metadata: Metadata = {
  title: 'Achieve Arcade',
  description: 'game your productivity',
  icons: {
    icon: '/icons/logo.png',
  },
};


export default function LandingPage() {

  return (
    <div className="bg-black min-h-screen w-full">
      <div className="max-w-[1280px] mx-auto">
        
        {/* First Section with Navbar */}
        <section className="h-[1100px] flex flex-col w-full">
          <nav className="py-5 px-8 flex items-center justify-between max-w-7xl mx-auto text-white w-full">
            <div className="flex items-center">
              <div className="flex">
                <Image src={'/icons/logo.png'} alt="Achieve Arcade Logo" width={24} height={34} />
                <p className="leading-none text-[18px] ml-2 hover:text-[#FFA501]">ACHIEVE<br/>ARCADE</p>
              </div>
              <div className="flex space-x-[30px] ml-[30px]">
                <a href="#demo" className="text-white hover:text-[#FFA501]">DEMO</a>
                <a href="#pricing" className="text-white hover:text-[#FFA501]">PRICING</a>
              </div>
            </div>
            <button className="text-black text-[20px] bg-white rounded-md px-4 hover:bg-[#FFA501]">
              <Link href='/auth/signin'>
                  LOGIN
              </Link>
            </button>
          </nav>
          <div className="w-full mt-[150px] flex px-8 text-white">
            <div className="w-1/2">
              <div className="text-[60px] text-white leading-tight mb-[30px]">
                Game your goals <br />
                get <span className="text-black bg-white px-4">more done</span>
              </div>
              <div className="text-[20px] mb-[60px]">
                Turn tasks into quests, earn rewards, and boost 
                <br/> productivity with Achieve Arcade.
              </div>
              <Link href="/auth/register">
                <button className="bg-[#FFA501] border border-[#FFA501] rounded-md px-4 py-2 
                text-[20px] text-black flex items-center justify-center hover:text-[#FFA501] hover:bg-black group">
                  <Gamepad2 size={24} className="inline-block mr-2 text-black group-hover:text-[#FFA501]" />
                  GET STARTED
                </button>
              </Link>
              <div className="mt-4">
                <Gift size={24} className="inline-block mr-2 text-[#6FCF97]"/>
                <span className="text-[#6FCF97] text-[15px]">FREE PRO ACCESS </span> 
                for the first 50 users!
              </div>
              <div className="text-[15px] text-white mt-2">
                <Sparkle size={24} className="inline-block mr-2 text-[#6FCF97]"/>
                Start your journey with our free version</div>

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
            <div className="w-1/2 flex justify-center">
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
        
        {/* Second Section with Feature Select */}
        <section id="features" className="h-[1100px] w-full flex flex-col justify-center items-center text-white">
          <div className="header text-[50px] max-w-[700px] leading-none">
            Level Up Your Productivity, <br/>
            One Game at a Time
            <div className="text-[15px] mt-4 leading-6">
              Transform your productivity with Achieve Arcade. 
              Track progress, conquer goals, build habits, slay tasks, 
              manage your schedule, and earn rewards. 
              Unlock your full potential and make every day a winning day.
            </div>
          </div>
          <div className="feature-select flex flex-wrap justify-center mt-8">
              <FeatureSelect />
          </div>
        </section>

        {/* Placeholder for remaining sections */}
        <section id="demo" className="h-[1300px] w-full flex flex-col justify-center items-center text-white">
          <div className="header text-[50px] max-w-[700px] leading-none">
            FOR FUTURE PLAYERS
            <div className="text-[20px] mt-[45px] leading-6">
              Hey, it&apos;s Derrick!
              <div className="mt-[45px] leading-7 text-[15px] ">
              I know, I know. It&apos;s another productivity app, but I made this because I&apos;ve always struggled with using the popular productivity apps...
              None of them could ever motivate me enough to use them long-term.  
              So, I created this product as both a solution to my very own problem. 
              There wasn&apos;t much thought put into to it, I just wanted to make something cool that I would use. I don&apos;t expect that you&apos;ll love it fully, but I really hope that you do! :D
              </div>
            </div>
          </div>
            <div className="w-[854px] h-[480px] mt-[60px] relative flex justify-center items-center border-white" style={{ borderWidth: '5px', borderStyle: 'solid', borderRadius: '12px' }}>
                DEMO
            </div>
            <div className="testimonial mt-[80px] flex flex-col text-[25px]">
                <div>
                  &quot;THIS IS WHAT I&apos;VE BEEN LOOKING FOR!&quot; <br/>
                </div>
                <div className="flex items-center mt-4">
                  <div className="rounded-3xl bg-white w-10 h-10 inline-block mr-4"></div>
                  <div>GUY GUY</div>
                </div>
            </div>
            
        </section>
        <section id="pricing" className="h-[1100px] w-full flex flex-col justify-center items-center text-white">
          <div className="header max-w-[700px] w-full">
            <div className="text-[25px] text-[#FFA501] w-full flex ">
              PRICING
            </div>
            <div className="text-[50px] leading-none">
              Upgrade Your Experience, <br/>
              Achieve More!
            </div>
            <div className="text-[15px] text-[#FFA501] w-full flex ">
              LIMITED TIME DEAL, PURCHASE FOR LIFETIME PRO ACCESS
            </div>
          </div>
          <div className="price-cards w-full mt-[80px] h-full flex items-center j
          ustify-center space-x-[30px] max-w-[1000px] max-h-[650px]">
              <div className="price-card bg-[#424242] rounded-xl flex flex-col w-full h-full py-4 px-10">
                <div className="price-category text-[20px]">STARTER</div>
                <div className="price-section flex mt-6 items-center">
                  <div className="price text-[40px] mr-2">FREE</div>
                  <div className="price-extra text-[15px] leading-none text-[#FFA501]">
                    NO MONEY <br/>
                    REQUIRED
                  </div>
                </div>
                <div className="benefits+limits mt-4 text-[20px]">
                  <div className="benefit mb-1">
                    <Check size={24} className="inline-block mr-2 text-white"/>
                    PLAYER DATA
                  </div>
                  <div className="benefit mb-3">
                    <Check size={24} className="inline-block mr-2 text-white"/>
                    GOAL KNIGHT
                  </div>               
                  <div className="benefit mb-3">
                    <Check size={24} className="inline-block mr-2 text-white"/>
                    HABIT FARM
                  </div>              
                  <div className="benefit mb-3">
                    <Check size={24} className="inline-block mr-2 text-white"/>
                    TASK SLAYER
                  </div>               
                  <div className="benefit mb-3">
                    <Check size={24} className="inline-block mr-2 text-white"/>
                    DAILY SCHEDULE
                  </div>               
                  <div className="benefit mb-3">
                    <Check size={24} className="inline-block mr-2 text-white"/>
                    REWARDS SHOP
                  </div>
                  <div className="limit text-[#BDBDBD] mb-3">
                    <X size={24} className="inline-block mr-2 text-[#BDBDBD]"/>
                    LIMITED # OF GOALS
                  </div>
                  <div className="limit text-[#BDBDBD] mb-3">
                    <X size={24} className="inline-block mr-2 text-[#BDBDBD]"/>
                    LIMITED # OF HABITS
                  </div>
                  <div className="limit text-[#BDBDBD] mb-3">
                    <X size={24} className="inline-block mr-2 text-[#BDBDBD]"/>
                    LIMITED # OF TASKS
                  </div>
                </div>
                <Link href="/auth/register" className="w-full flex items-center justify-center mt-auto">
                  <button className="bg-[#FFA501] border border-[#FFA501] rounded-md px-4 py-2 
                  text-[20px] text-black flex items-center justify-center hover:text-[#FFA501] hover:bg-black group mt-auto mb-4 w-full">
                    <Gamepad2 size={24} className="inline-block mr-2 text-black group-hover:text-[#FFA501]" />
                    START PLAYING
                  </button>
                </Link>
              </div>
              <div className="price-card border border-[#FFA501] bg-[#424242] rounded-xl flex flex-col w-full h-full py-4 px-10">
                <div className="price-category text-[20px]">PRO
                  <div className="inline-block text-[13px] text-[#FFA501] ml-1">Lifetime
                    <Sparkles
                      size={20}
                      className="inline-block ml-1 mb-2 text-[#FFA501]" />
                  </div>
                </div>
                <div className="price-section flex mt-6 items-center">
                  <div className="price text-[40px] mr-2">4.99</div>
                  <div className="price-extra text-[15px] leading-none text-[#FFA501]">
                    <span className="line-through decoration-2 text-[#EB5757]">
                      <span className="text-white">PER MONTH</span>
                    </span>
                    <div className="text-[#FFA501]">ONE TIME FEE</div>
                  </div>
                </div>
                <div className="benefits+limits mt-4 text-[20px]">
                  <div className="benefit mb-1">
                    <Check size={24} className="inline-block mr-2 text-white"/>
                    PLAYER DATA
                  </div>
                  <div className="benefit mb-3">
                    <Check size={24} className="inline-block mr-2 text-white"/>
                    GOAL KNIGHT
                  </div>               
                  <div className="benefit mb-3">
                    <Check size={24} className="inline-block mr-2 text-white"/>
                    HABIT FARM
                  </div>              
                  <div className="benefit mb-3">
                    <Check size={24} className="inline-block mr-2 text-white"/>
                    TASK SLAYER
                  </div>               
                  <div className="benefit mb-3">
                    <Check size={24} className="inline-block mr-2 text-white"/>
                    DAILY SCHEDULE
                  </div>               
                  <div className="benefit mb-3">
                    <Check size={24} className="inline-block mr-2 text-white"/>
                    REWARDS SHOP
                  </div>
                  <div className="benefit mb-3">
                    <Check size={24} className="inline-block mr-2 text-white"/>
                    UNLIMITED NUMBER OF GOALS
                  </div>
                  <div className="benefit mb-3">
                    <Check size={24} className="inline-block mr-2 text-white"/>
                    MAX AMOUNT OF HABITS
                  </div>
                  <div className="benefit mb-3">
                    <Check size={24} className="inline-block mr-2 text-white"/>
                    UNLIMITED NUMBER OF TASKS
                  </div>
                </div>
                <Link href="/auth/register" className="w-full flex items-center justify-center mt-auto">
                  <button className="bg-[#FFA501] border border-[#FFA501] rounded-md px-4 py-2 
                  text-[20px] text-black flex items-center justify-center hover:text-[#FFA501] hover:bg-black group mt-auto mb-4 w-full">
                    <Gamepad2 size={24} className="inline-block mr-2 text-black group-hover:text-[#FFA501]" />
                    START PLAYING
                  </button>
                </Link>
              </div>
          </div>
          {/* Add this section when theres more testimonials */}
          {/* <div className="testimonial mt-[80px] flex flex-col text-[25px]">
                <div>
                  &quot;THIS IS WHAT I&apos;VE BEEN LOOKING FOR!&quot; <br/>
                </div>
                <div className="flex items-center mt-4">
                  <div className="rounded-3xl bg-white w-10 h-10 inline-block mr-4"></div>
                  <div>GUY GUY</div>
                </div>
            </div> */}

        </section>
        <section className="FAQ h-[800px] w-full flex justify-center items-center text-white">
          <div className="text-[30px] w-1/2">
            FAQ? <br/>
            FREQUESNTLY ASKED QUESTIONS
            <div className="text-[15px] mt-2">
              HAVE ANOTHER QUESTION? CONTACT ME @ EMAIL
            </div>
          </div>
          <div className="questions w-1/2 text-[25px]">
          <Accordion type="single" collapsible className="text-[25px]">
            <AccordionItem value="item-1">
              <AccordionTrigger>Is this a subscription based product?</AccordionTrigger>
              <AccordionContent>
              Achieve Arcade offers both free and subscription-based versions. The free version provides essential features, while the Pro version unlocks additional benefits for a subscription fee. Notably, 
              the first 50 users who sign up will enjoy Pro version access for free, forever.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Is this on mobile?</AccordionTrigger>
              <AccordionContent>
              Sadly, Achieve Arcade is currently available only on web platforms. I plan to develop a 
              mobile version once this application reaches a certain number of paying subscribers.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Can I get a refund?</AccordionTrigger>
              <AccordionContent>
                  Yes, you can request a refund at any time! I will refund all your past 
                  monthly subscriptions. Please let me know if you encountered any issues that 
                  led to your cancellation. Your feedback is valuable, and 
                  I will do my best to address your concerns to improve the app.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>What features are included in the Pro version?</AccordionTrigger>
              <AccordionContent>
              The Pro version of Achieve Arcade includes the following features: 
              Unlimited Goals, Max Number of Habits, and Unlimited Tasks.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          </div>
        </section>
      </div>
        <section className="Footer h-[460px] w-full py-10 flex flex-col justify-center items-center border-t border-white">
            <div className="text-white h-[250px] w-full max-w-[1200px] space-x-[15px] flex justify-start ">
                  <div className="first-col flex flex-col w-1/3 gap-4 h-[200px]">
                    <div className="flex">
                    <Image src={'/icons/logo.png'} alt="Achieve Arcade Logo" width={24} height={34} />
                    <p className="leading-none text-[18px] ml-2 hover:text-[#FFA501]">ACHIEVE<br/>ARCADE</p>
                    </div>
                    <div className="text-[15px]">
                    Turn tasks into quests, earn rewards, and boost <br/>
                    productivity with Achieve Arcade.
                    </div>
                    <div>
                      COPYRIGHT <Copyright size={15} className="inline-block mr-2"/>2024 * All rights reserved
                    </div>
                    <Link href="/auth/register" className="w-full flex items-center justify-center mt-6">
                      <button className="bg-[#FFA501] border border-[#FFA501] rounded-md px-4 py-2 
                      text-[20px] text-black flex items-center justify-center hover:text-[#FFA501] hover:bg-black group mt-auto mb-4 w-full">
                        <Gamepad2 size={24} className="inline-block mr-2 text-black group-hover:text-[#FFA501]" />
                        START PLAYING
                      </button>
                    </Link>
                  </div>
                  <div className="second-col ml-8 flex flex-col items-center h-[200px] text-left w-[250px] ">
                    <div className="flex flex-col ">
                      <div className="text-[#808080]">LINKS</div>
                      <Link href='/auth/signin' className="hover:text-[#FFA501] cursor-pointer">
                          LOGIN
                      </Link>
                      <a href="#features" className="hover:text-[#FFA501] cursor-pointer">FEATURES</a>
                      <a href="#demo" className="hover:text-[#FFA501] cursor-pointer">DEMO</a>
                      <a href="#pricing" className="hover:text-[#FFA501] cursor-pointer">PRICING</a>

                    </div>
                  </div>
                  <div className="third-col flex flex-col items-center h-[200px] text-left w-[250px]">
                    <div>
                      <div className="text-[#808080]">LEGAL</div>
                      <div className="hover:text-[#FFA501] cursor-pointer">TERMS OF SERVICE</div>
                      <div className="hover:text-[#FFA501] cursor-pointer">PRIVACY POLICY</div>

                    </div>
                  </div>
            </div>
                <div className="mt-4 w-full max-w-[1200px] text-white">
                  Hello! I&apos;m Derrick, creator of Achieve Arcade. You can follow me on X for more updates!
                </div>
        </section>
    </div>
  );
}
