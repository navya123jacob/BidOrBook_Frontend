


import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../redux/slices/Reducers/types';
import { Navbar } from './Navbar';
import HomeBody from '../../Pages/User/HomeBody';
import { IonIcon } from '@ionic/react';
import { useEffect } from 'react';


export const Hero = () => {
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userInfo = useSelector((state: RootState) => state.client.userInfo);
  
  return (
    <div className="bg-white" style={{backgroundImage: 'url(/src/assets/ClientHome.webp)',height:'90vh',backgroundSize:'cover'}}>
      <Navbar></Navbar>

      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          aria-hidden="true"
        >
         

        </div>
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="hidden sm:mb-8 sm:flex sm:justify-center">
            
          </div>
          <div className="text-center ">
            <h1 className="text-4xl  tracking-tight text-gray-300 sm:text-6xl " style={{fontFamily:'cursive'}}>
              BID or BOOK
            </h1>
            {/* <p className="mt-6 text-lg leading-8 text-gray-400">
              Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo. Elit sunt amet
              fugiat veniam occaecat fugiat aliqua.
            </p> */}
            <div className="mt-8 flex items-center justify-center gap-x-6">
              <a
                href="#"
                className="rounded-md bg-white bg-opacity-65 px-3.5 py-2.5 text-sm font-semibold text-black shadow-sm hover:bg-indigo-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Explore
              </a>
              <a href="#" className="text-sm font-semibold leading-6 text-gray-400">
                Auction <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
        
      </div>

      <HomeBody></HomeBody>
     
    </div>
  )
}





{/* <div className="bg-black w-full h-full min-h-screen p-8">
<div className="container mx-auto">
  <div className="w-full z-0 relative md:min-h-[41rem]">
    <div className="w-full h-full relative z-0 rounded-2xl">
      <video
        className="relative z-[1] inline w-full h-full object-center object-cover rounded-2xl"
        preload="metadata"
        autoPlay
        loop
        playsInline
        aria-hidden="false"
      >
        <source
          src="https://player.vimeo.com/progressive_redirect/playback/840627949/rendition/1080p/file.mp4?loc=external&amp;signature=df9cfec6465233ea6f14bd85906ac7412e35a0a00e65cdb6823b45d2b2cf5607"
          type="video/mp4"
        />
      </video>
      <video
        className="absolute top-0 left-0 w-full h-full transform-gpu translate-x-0 translate-y-0 z-0 inline object-center object-cover rounded-2xl blur-2xl"
        preload="none"
        autoPlay
        loop
        playsInline
        aria-hidden="false"
      >
        <source
          src="https://player.vimeo.com/progressive_redirect/playback/840627949/rendition/1080p/file.mp4?loc=external&amp;signature=df9cfec6465233ea6f14bd85906ac7412e35a0a00e65cdb6823b45d2b2cf5607"
          type="video/mp4"
        />
      </video>
    </div>
  </div>
</div>
</div> */}


// <div className="hello2 relative group flex justify-center items-center h-full w-full p-5"> {/* Adjusted className for the third div */}
// <div className="absolute inset-0 flex flex-col items-center justify-center px-6">
//   <div className="bg-transparent p-6 rounded-lg text-center" style={{ fontFamily: 'cursive' }}>
//     <p className="text-gray-800 dark:text-white mb-4" style={{ fontSize: '1.2rem' }}>
//       At Bid or Book, we believe in the power of visual storytelling to inspire, connect, and transform. Whether you're searching for the perfect photographer to capture your wedding day, family portraits, or corporate event, our platform is your one-stop destination to discover talented photographers and book your ideal match.
//     </p>
//   </div>
// </div>
// </div>