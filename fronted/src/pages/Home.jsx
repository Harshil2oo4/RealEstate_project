import React from 'react'
import './home.css'
import Hero from '../components/Hero'
import About from '../components/About'
import Properties from '../components/Properties'
import Blog from '../components/Blog'
import bannerImg from "../assets/banner.png"

const Home = () => {
  return (
    // <div className='flexCenter h-[999px]'>Home</div>
    <main>
      <Hero/>
      <About />
      <Properties />
      <Blog />
      <div className='max-padd-container py-16 overflow-x-hidden'>
      <img src={bannerImg} alt="" />
      </div>
    </main>
  )
}

export default Home