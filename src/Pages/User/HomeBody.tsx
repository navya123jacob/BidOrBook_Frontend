import React from 'react'

const HomeBody = () => {
  return (
    <div>
        <div className="flex justify-center items-center p-5">
  <div className="2xl:mx-auto 2xl:container py-12 px-4 sm:px-6 xl:px-20 2xl:px-0 w-full">
    <div className="flex flex-col justify-center items-center space-y-10 ">
     
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 md:gap-x-4 md:gap-x-8 w-full">
        <div className="relative group flex justify-center items-center h-[550px] w-full p-5"> {/* Increased height for the first div */}
          <a href="#" className="group relative block w-full h-full">
            <div className="relative w-full h-full"> {/* Adjusted height for the image div */}
              <img
                src="/src/assets/clientpho.jpg"
                alt=""
                className="absolute inset-0 h-full w-full object-cover opacity-100 group-hover:opacity-0"
              />
              <img
                src="/src/assets/clientPho2.jpeg"
                alt=""
                className="absolute inset-0 h-full w-full object-cover opacity-0 group-hover:opacity-100"
              />
              
            </div>

            <div className="absolute inset-0 flex flex-col items-center justify-end p-10">
              <h3 className="text-xl font-bold text-white">ARTISTS|PHOTOGRAPHERS</h3>
              <p className="mt-1.5 text-pretty text-xs text-white">
               Explore and book your favourite Artist|Photographer
              </p>
              <span className="mt-3 inline-block bg-black px-5 py-3 text-xs font-medium uppercase tracking-wide text-white">
                DISCOVER
              </span>
            </div>
          </a>
        </div>
       
        
        <div className="relative group flex justify-center items-center h-[550px] w-full p-5 "> {/* Increased height for the fourth div */}
          <a href="#" className="group relative block w-full h-full">
            <div className="relative w-full h-full"> 
              <img
                src="/src/assets/ClientAuction.jpg"
                alt=""
                className="absolute inset-0 h-full w-full object-cover opacity-100 group-hover:opacity-0"
              />
              <img
                src="/src/assets/ClientAuction2.jpeg"
                alt=""
                className="absolute inset-0 h-full w-full object-cover opacity-0 group-hover:opacity-100"
              />
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-end p-10">
              <h3 className="text-xl font-bold text-white">AUCTION</h3>
              <p className="mt-1.5 text-pretty text-xs text-white">
               Bid on your favourite work now!
              </p>
              <span className="mt-3 inline-block bg-black px-5 py-3 text-xs font-medium uppercase tracking-wide text-white">
                EXPLORE
              </span>
            </div>
            
          </a>
        </div>
      </div>
    </div>
  </div>
</div>

    </div>
  )
}

export default HomeBody
