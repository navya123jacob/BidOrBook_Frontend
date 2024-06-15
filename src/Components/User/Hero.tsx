


import {  useSelector } from 'react-redux';
import { RootState } from '../../redux/slices/Reducers/types';
import { Navbar } from './Navbar';
import { useSignupMutation } from '../../redux/slices/Api/EndPoints/clientApiEndPoints';


export const Hero = () => {

  const userInfo = useSelector((state: RootState) => state.client.userInfo);
  const [signup] = useSignupMutation();
  const something=async(e:any)=>{
    const res = await signup({'navya':'yaya'})
    console.log(res)
  }
  return (
    <>
    
    <div className={`bg-white ${!userInfo.client && 'bg-center'}`} style={{backgroundImage: `url(${userInfo.client ? "/src/assets/ClientHome.webp" : "/src/assets/ArtPho/ArtPhoHome.jpg"})`, height:'90vh', backgroundSize:'cover'}}>
    <header className="absolute inset-x-0 top-0 z-50">
      <Navbar />
      </header>

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
            
            <div className="mt-8 flex items-center justify-center gap-x-6">
              <a
                href="#"
                className="rounded-md bg-white bg-opacity-65 px-3.5 py-2.5 text-sm font-semibold text-black shadow-sm hover:bg-indigo-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Explore
              </a>
              <a href="#" className="text-sm font-semibold leading-6 text-gray-400" onClick={something}>
                Auction <span aria-hidden="true">→</span>
                
              </a>
            </div>
          </div>
        </div>
        
      </div>
        
    </div>
      
     
    </> 
    
  )
}



