import Image from "next/image";
import { Gamepad2, Gift, Sparkle, Check, X, Sparkles, Copyright, HeartCrack  } from 'lucide-react';
import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";


// Dynamically import FeatureSelect, which will be loaded only on the client side
const FeatureSelect = dynamic(() => import('../components/landing/FeatureSelect'), {
  ssr: false, // This line is important. It disables server-side rendering for the component
});

export const metadata: Metadata = {
  title: 'Achieve Arcade - Gamified Productivity Tools, Goal Tracker, Habit Tracker',
  description: 'Achieve Arcade: Gamify your productivity with our goal and habit trackers. Boost your productivity with our gamified tools.',
  icons: {
    icon: '/icons/logo.png',
  },
};



export default function LandingPage() {

  return (
    <div className="bg-black min-h-screen w-full">
      <div className="max-w-[1280px] mx-auto">
        
        {/* First Section with Navbar */}
        <section className="min-h-[875px] md:min-h-[1100px] flex flex-col w-full">
          <nav className="py-5 px-8 flex items-center justify-between max-w-7xl mx-auto text-white w-full">
            <div className="flex items-center">
              <div className="flex">
               <Image src={'/icons/logo.png'} alt="Achieve Arcade - Gamified Productivity Tools" width={24} height={34} />
                <p className="leading-none text-[18px] ml-2 hover:text-[#FFA501]">ACHIEVE<br/>ARCADE</p>
              </div>
              <div className="flex space-x-[30px] ml-[30px]">
                <a href="#demo" className="text-white hover:text-[#FFA501]">DEMO</a>
                <a href="#pricing" className="text-white hover:text-[#FFA501]">PRICING</a>
              </div>
            </div>
            <div className="hidden md:flex">
              <button className="text-black text-[20px] bg-white rounded-md px-4 hover:bg-[#FFA501]">
                <Link href='/auth/signin'>
                    LOGIN
                </Link>
              </button>
            </div>
          </nav>
          <div className="w-full mt-[150px] flex flex-col md:flex-row px-8 text-white items-center">
            <div className="w-full h-full justify-center md:w-1/2 text-center md:text-left flex flex-col items-center md:items-start">
              <h1 className="text-[40px] md:text-[60px] text-white leading-tight mb-[30px]">
                Game your goals <br />
                get <span className="text-black bg-white px-4">more done</span> <span className="hidden">with our productivity tools</span>
              </h1>
              <div className="text-[16px] md:text-[20px] mb-[40px]">
                Turn tasks into quests, earn rewards, and boost 
                <br className="hidden md:block"/> productivity with Achieve Arcade. <span className="hidden">your ultimate goal. tracker and habit tracker</span>
              </div>
              <div className="w-full flex items-center justify-center max-w-[300px]">
                <Link href="/auth/register" className="w-full flex items-center justify-center">
                  <button className="bg-[#FFA501] border border-[#FFA501] rounded-md px-4 py-2 text-[16px] md:text-[20px] text-black flex items-center justify-center hover:text-[#FFA501] hover:bg-black group mt-auto mb-4 w-full">
                    <span className="">
                      <Gamepad2 className="inline-block mr-2 text-black group-hover:text-[#FFA501] w-6 h-6" />
                      START PLAYING
                    </span>
                  </button>
                </Link>
              </div>
  
              <div className="text-[15px] text-white mt-2">
                <Sparkle size={24} className="inline-block mr-2 text-[#6FCF97]"/>
                Start your journey with our free version
              </div>
            </div>
            <div className="w-full md:w-1/2 flex justify-center md:block hidden">
              <div>
                <Image src={'/icons/landing/images/section-1.png'} alt="Achieve Arcade Productivity Tools"
                 width={564} height={535} style={{ imageRendering: 'pixelated' }} />
              </div>
            </div>
          </div>

          <div className="text-white w-full flex justify-center mt-[100px] text-[15px] gap-4">
            <div>FEATURED ON</div>
            <div>Product Hunt</div>
            <div>reddit</div>
            <div>X</div>
            <div>Hacker News</div>
          </div>
        </section>

              {/* <div className="mt-[80px] flex flex-col text-[15px] items-center md:items-start">
                <div>
                  &quot;THIS IS WHAT I&apos;VE BEEN LOOKING FOR!&quot; <br/>
                </div>
                <div className="flex items-center mt-2">
                  <div className="rounded-3xl bg-white w-10 h-10 inline-block mr-2"></div>
                  <div>SOME RANDOM NAME</div>
                </div>
              </div> */}


        
        {/* 2: FEATURE SHOWCASE */}
        <section id="features" className="min-h-[875px] md:min-h-[1100px] w-full flex flex-col justify-center items-center text-white px-4">
        <div className="header text-[40px] md:text-[50px] max-w-[700px] leading-none">
          <h1>Level Up Your Productivity, One Game at a Time<span className="hidden">with our productivity tools</span></h1>
          <h2 className="text-[15px] md:text-[20px] mt-4 leading-6">
            Transform your productivity with Achieve Arcade. 
            Track progress, conquer goals, build habits, slay tasks, 
            manage your schedule, and earn rewards. 
            Unlock your full potential and make every day a winning day.
          </h2>
        </div>
        <div className="feature-select flex flex-wrap justify-center mt-8 w-full max-w-[700px]">
              <FeatureSelect />
          </div>
        </section>


        {/* 3: DEMO */}
        <section id="demo" className="min-h-[1000px] md:min-h-[1300px] w-full flex flex-col justify-center items-center text-white px-4">
          <div className="header text-[30px] md:text-[50px] max-w-[700px] leading-none md:text-left">
            <h2>FOR FUTURE PLAYERS</h2>
            <p className="text-[15px] md:text-[20px] mt-4 md:mt-[45px] leading-8">
              Hey, it&apos;s Derrick! <br/><br/>I know, it&apos;s another productivity app... <br/> But I made this because I&apos;ve always struggled with 
              using existing productivity apps. None of them could ever motivate me enough to use them long-term.  
              So, I created this product as a solution to my very own problem. There wasn&apos;t much thought put into it, I just wanted to make something cool 
              that I would use. I don&apos;t expect that you&apos;ll love it fully, but I really hope that you do! :D
            </p>
          </div>
          <div className="w-full md:w-[854px] h-[240px] md:h-[480px] mt-8 md:mt-[60px] relative flex justify-center items-center border-white" style={{ borderWidth: '5px', borderStyle: 'solid', borderRadius: '12px' }}>
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/TKsPGsSD4QM"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </section>



        {/*4: PRICING  */}
        <section id="pricing" className="min-h-[875px] md:min-h-[1100px] w-full flex flex-col justify-center items-center text-white px-4">
          <div className="header max-w-[700px] w-full text-center md:text-left">
            <div className="text-[20px] md:text-[25px] text-[#FFA501] w-full">
              PRICING
            </div>
            <div className="text-[30px] md:text-[50px] leading-none">
              Upgrade Your Experience, <br/>
              Achieve More!
            </div>
            <div className="text-[15px] text-[#FFA501] w-full">
              LIMITED TIME DEAL, PURCHASE FOR LIFETIME PRO ACCESS
            </div>
          </div>
          <div className="price-cards w-full mt-8 md:mt-[80px] flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-[30px] max-w-[1000px]">
            <div className="price-card bg-[#424242] rounded-xl flex flex-col w-full md:w-1/2 h-full py-4 px-6 md:px-10">
              <div className="price-category text-[18px] md:text-[20px]">STARTER</div>
              <div className="price-section flex mt-4 md:mt-6 items-center">
                <div className="price text-[30px] md:text-[40px] mr-2">FREE</div>
                <div className="price-extra text-[12px] md:text-[15px] leading-none text-[#FFA501]">
                  NO MONEY <br/>
                  REQUIRED
                </div>
              </div>
              <div className="benefits+limits mt-4 text-[18px] md:text-[20px]">
                <div className="benefit mb-1">
                  <Check className="inline-block mr-2 text-white" size={20} />
                  PLAYER DATA
                </div>
                <div className="benefit mb-3">
                  <Check className="inline-block mr-2 text-white" size={20} />
                  GOAL KNIGHT
                </div>               
                <div className="benefit mb-3">
                  <Check className="inline-block mr-2 text-white" size={20} />
                  HABIT FARM
                </div>              
                <div className="benefit mb-3">
                  <Check className="inline-block mr-2 text-white" size={20} />
                  TASK SLAYER
                </div>               
                <div className="benefit mb-3">
                  <Check className="inline-block mr-2 text-white" size={20} />
                  DAILY SCHEDULE
                </div>               
                <div className="benefit mb-3">
                  <Check className="inline-block mr-2 text-white" size={20} />
                  REWARDS SHOP
                </div>
                <div className="limit text-[#BDBDBD] mb-3">
                  <X className="inline-block mr-2 text-[#BDBDBD]" size={20} />
                  LIMITED # OF GOALS
                </div>
                <div className="limit text-[#BDBDBD] mb-3">
                  <X className="inline-block mr-2 text-[#BDBDBD]" size={20} />
                  LIMITED # OF HABITS
                </div>
                <div className="limit text-[#BDBDBD] mb-3">
                  <X className="inline-block mr-2 text-[#BDBDBD]" size={20} />
                  LIMITED # OF TASKS
                </div>
              </div>
              <div className="w-full flex items-center justify-center mt-6 max-w-[300px] self-center">
                <Link href="/auth/register" className="w-full flex items-center justify-center">
                  <button className="bg-[#FFA501] border border-[#FFA501] rounded-md px-4 py-2 text-[16px] md:text-[20px] 
                    text-black flex items-center justify-center hover:text-[#FFA501] hover:bg-black group mt-auto mb-4 w-full">
                    <span className="">
                      <Gamepad2 className="inline-block mr-2 text-black group-hover:text-[#FFA501] w-6 h-6" />
                      START PLAYING
                    </span>
                </button>
                </Link>
              </div>
            </div>
            <div className="price-card border border-[#FFA501] bg-[#424242] rounded-xl flex flex-col w-full md:w-1/2 h-full py-4 px-6 md:px-10">
              <div className="price-category text-[18px] md:text-[20px]">PRO
                <div className="inline-block text-[11px] md:text-[13px] text-[#FFA501] ml-1">Lifetime
                  <Sparkles className="inline-block ml-1 mb-1 md:mb-2 text-[#FFA501]" size={16} />
                </div>
              </div>
              <div className="price-section flex mt-4 md:mt-6 items-center">
                <div className="price text-[30px] md:text-[40px] mr-2">4.99</div>
                <div className="price-extra text-[12px] md:text-[15px] leading-none text-[#FFA501]">
                  <span className="line-through decoration-2 text-[#EB5757]">
                    <span className="text-white">PER MONTH</span>
                  </span>
                  <div className="text-[#FFA501]">ONE TIME FEE</div>
                </div>
              </div>
              <div className="benefits+limits mt-4 text-[18px] md:text-[20px]">
                <div className="benefit mb-1">
                  <Check className="inline-block mr-2 text-white" size={20} />
                  PLAYER DATA
                </div>
                <div className="benefit mb-3">
                  <Check className="inline-block mr-2 text-white" size={20} />
                  GOAL KNIGHT
                </div>               
                <div className="benefit mb-3">
                  <Check className="inline-block mr-2 text-white" size={20} />
                  HABIT FARM
                </div>              
                <div className="benefit mb-3">
                  <Check className="inline-block mr-2 text-white" size={20} />
                  TASK SLAYER
                </div>               
                <div className="benefit mb-3">
                  <Check className="inline-block mr-2 text-white" size={20} />
                  DAILY SCHEDULE
                </div>               
                <div className="benefit mb-3">
                  <Check className="inline-block mr-2 text-white" size={20} />
                  REWARDS SHOP
                </div>
                <div className="benefit mb-3">
                  <Check className="inline-block mr-2 text-white" size={20} />
                  UNLIMITED NUMBER OF GOALS
                </div>
                <div className="benefit mb-3">
                  <Check className="inline-block mr-2 text-white" size={20} />
                  MAX AMOUNT OF HABITS
                </div>
                <div className="benefit mb-3">
                  <Check className="inline-block mr-2 text-white" size={20} />
                  UNLIMITED NUMBER OF TASKS
                </div>
              </div>
              <div className="w-full flex self-center items-center justify-center mt-6 max-w-[300px]">
                <Link href="/auth/premium-register" className="w-full flex items-center justify-center">
                  <button className="bg-[#FFA501] border border-[#FFA501] rounded-md px-4
                    py-2 text-[16px] md:text-[20px] text-black flex items-center justify-center 
                    hover:text-[#FFA501] hover:bg-black group mt-auto mb-4 w-full">
                    <span className="">
                      <Gamepad2 className="inline-block mr-2 text-black group-hover:text-[#FFA501] w-6 h-6" />
                      START PLAYING
                    </span>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>

          {/*5: FAQ  */}
          <section className="FAQ min-h-[800px] w-full flex flex-col md:flex-row justify-center items-center text-white px-4">
            <div className="text-[20px] md:text-[30px] w-full md:w-1/2 text-center md:text-left mb-8 md:mb-0">
              FAQ? <br/>
              FREQUENTLY ASKED QUESTIONS ABOUT OUR PRODUCTIVITY TOOLS
              <div className="text-[15px] mt-2">
                HAVE ANOTHER QUESTION? CONTACT ME @ EMAIL
              </div>
            </div>
            <div className="questions w-full md:w-1/2 text-[20px] md:text-[25px]">
              <Accordion type="single" collapsible className="text-[20px] md:text-[25px]">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Is this a subscription-based product?</AccordionTrigger>
                  <AccordionContent>
                    Achieve Arcade offers both free and subscription-based versions of our productivity tools. The free version provides essential features, while the Pro version unlocks additional benefits for a subscription fee. Notably, 
                    the first 50 users who sign up will enjoy Pro version access for free, forever.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>Is this on the app store or play store?</AccordionTrigger>
                  <AccordionContent>
                    Sadly, Achieve Arcade is currently available only on web and mobile browsers. I plan to develop a 
                    mobile app for our productivity tools once this application reaches a certain number of pro players.
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
                    Unlimited Goals, Max Number of Habits, and Unlimited Tasks. These features enhance our goal tracker and habit tracker functionalities.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </section>


      </div>
     
      <section className="Footer w-full py-10 flex flex-col justify-center items-center border-t border-white">
        <div className="text-white w-full max-w-[1200px] flex flex-col md:flex-row justify-between items-center px-4 space-y-6 md:space-y-0">
          <div className="first-col flex flex-col w-full md:w-1/3 gap-4 items-center md:items-start h-[150px] md:h-[200px] text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start">
              <Image src={'/icons/logo.png'} alt="Achieve Arcade - Gamified Productivity Tools" width={24} height={34} />
              <p className="leading-none text-[18px] ml-2 hover:text-[#FFA501]">ACHIEVE<br/>ARCADE</p>
            </div>
            <div className="text-[15px]">
              Turn tasks into quests, earn rewards, and boost <br/>
              productivity with Achieve Arcade.
            </div>
            <div className="flex items-center justify-center md:justify-start">
              COPYRIGHT <Copyright className="inline-block mr-2" size={15} /> 2024 * All rights reserved
            </div>
          </div>
          <div className="second-col flex flex-col items-center md:items-start h-[150px] md:h-[200px] text-center md:text-left w-full md:w-1/4 space-y-2">
            <div className="text-[#808080]">LINKS</div>
            <Link href='/auth/signin' className="hover:text-[#FFA501] cursor-pointer">LOGIN</Link>
            <a href="#features" className="hover:text-[#FFA501] cursor-pointer">FEATURES</a>
            <a href="#demo" className="hover:text-[#FFA501] cursor-pointer">DEMO</a>
            <a href="#pricing" className="hover:text-[#FFA501] cursor-pointer">PRICING</a>
          </div>
          <div className="third-col flex flex-col items-center md:items-start h-[150px] md:h-[200px] text-center md:text-left w-full md:w-1/4 space-y-2">
            <div className="text-[#808080]">LEGAL</div>
            <Link href='/terms-of-service' className="hover:text-[#FFA501] cursor-pointer">TERMS OF SERVICE</Link>
            <Link href='/privacy-policy' className="block hover:text-[#FFA501] cursor-pointer">PRIVACY POLICY</Link>
          </div>
        </div>
        <div className="mt-4 w-full text-white text-center px-4">
          Hello! I&apos;m Derrick, creator of Achieve Arcade. You can follow me on X at <Link href='https://x.com/DerrickHua_'>@derrickhua_</Link> for more updates!
        </div>
      </section>

    </div>
  );
}
