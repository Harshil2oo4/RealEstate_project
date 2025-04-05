import React, { useEffect, useState } from 'react'
import aboutImg from "../assets/about.jpg"
import { RiDoubleQuotesL } from 'react-icons/ri'
import Countup from "react-countup"

const About = () => {

    const statistics = [
        {label: "Happy Clients",value:12},
        {label: "Diffrent Cities" , value: 3},
        {label : "Projects Completed" , value : 45},
    ]

    const [isVisible , setIsVisible] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
                  const aboutSection = document.getElementById('about')
                  if(aboutSection){
                     const top = aboutSection.getBoundingClientRect().top;
                     const isVisible = top < window.innerHeight - 100;
                     setIsVisible(isVisible);
                  }
        }
        window.addEventListener("scroll",handleScroll)
        //cleanup function to remove he event listener
        return()=>{
            window.removeEventListener("scroll",handleScroll);
        }
    }, [])

  return (
   <section id='about' className='max-padd-container py-16 xl:py-28'>
    {/* container */}
    <div className='flex flex-col xl:flex-row gap-10'>
        {/* left side */}
        <div className='flex-1 relative'>
            <img src={aboutImg} alt="" className='rounded-3xl rounded-tr-[155px] w-[488px]' />
            <div className='bg-white absolute bottom-16 left-16 max-w-xs p-4 rounded-lg flexCenter flex-col'>
                <span className='relative bottom-8 p-3 shadow-md bg-white h-12 w-50  flex items-center rounded-full' ><RiDoubleQuotesL className='text-2xl'/>
                </span>
                <p className='text-center relative bottom-3'>"Discover your dream home with ease—trusted listings, seamless transactions, and expert guidance, all in one place!"</p>
            </div>
        </div>
        {/* right side */}
        <div className='flex-1 flex justify-center flex-col'>
            <span className='medium-18'>Unveilling Our Journey</span>
            <h2 className='h2'>Our Commitement Crafting Extraordinary Real Estate Expiernce</h2>
            <p className='py-5'>"Finding the perfect home has never been easier! Explore top real estate listings, connect with trusted agents, and make seamless property transactions—all in one place. Your dream home is just a click away!"</p>
            {/* Statistics conatiner */}
            <div className='flex flex-wrap gap-4'>
                {statistics.map((statistic,index)=>(
                    <div key={index} className='bg-primary p-4 rounded-lg'>
                        <div className='flex items-center gap-1'>
                            <Countup start={isVisible ? 0 : null}
                            end={statistic.value}
                            duration={7} delay={1}>
                                {({countUpRef}) => (
                                    <h3 className='text-2xl font-semibold' ref={countUpRef}> </h3>
                                )}
                            </Countup>
                            <h4 className='bold-22'>k+</h4>
                        </div>
                        <p>{statistic.label}</p>
                     </div>
                ))}
            </div>
        </div>
    </div>
   </section>
 )
}

export default About