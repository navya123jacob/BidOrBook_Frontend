import React from 'react'
import { Hero } from '../../Components/User/Hero'
import HomeBody from '../../Components/User/HomeBody'
import LowerHome from '../../Components/User/LowerHome'
import Footer from '../../Components/User/Footer'

const HomeUser = () => {
  return (
    <div>
      <Hero></Hero>
      <HomeBody></HomeBody>
      <LowerHome/>
      <Footer/>
    </div>
  )
}

export default HomeUser
