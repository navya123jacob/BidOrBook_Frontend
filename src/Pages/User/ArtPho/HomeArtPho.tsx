import { Navbar } from '../../../Components/User/Navbar'
import Footer from '../../../Components/User/Footer'
import { Hero } from '../../../Components/User/Hero'
import HomeBody from '../../../Components/User/HomeBody'

const HomeArtPho = () => {
  return (
    <>
      <header className="absolute inset-x-0 top-0 z-50">
      <Navbar />
      </header>
      <Hero/>
      <HomeBody/>
      <Footer></Footer>
    </>
  )
}

export default HomeArtPho
