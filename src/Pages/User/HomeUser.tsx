import React from 'react'
import { Hero } from '../../Components/User/Hero'
import HomeBody from '../../Components/User/HomeBody'
import LowerHome from '../../Components/User/LowerHome'

const HomeUser = () => {
  return (
    <div>
      <Hero></Hero>
      <HomeBody></HomeBody>
      <LowerHome/>
    </div>
  )
}

export default HomeUser
