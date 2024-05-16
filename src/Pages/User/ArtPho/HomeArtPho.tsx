import React from 'react'
import { Navbar } from '../../../Components/User/Navbar'
import Footer from '../../../Components/User/Footer'
import { Hero } from '../../../Components/User/Hero'
import HomeBody from '../../../Components/User/HomeBody'

const HomeArtPho = () => {
  return (
    <>
      <Navbar></Navbar>
      <Hero/>
      <HomeBody/>
      <Footer></Footer>
    </>
  )
}

export default HomeArtPho
