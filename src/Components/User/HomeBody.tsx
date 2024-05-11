import React from 'react'

const HomeBody = () => {
  return (
    <div className="flex justify-center items-center p-5">
      <div className="2xl:mx-auto 2xl:container py-12 px-4 sm:px-6 xl:px-20 2xl:px-0 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          <div className="relative group flex flex-col justify-center items-center p-5">
            <a href="#" className="group relative block w-full h-full mb-10">
              <div className="relative w-full h-72 sm:h-80 md:h-96 lg:h-[550px]">
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
                  Explore and book your favorite Artist|Photographer
                </p>
                <span className="mt-3 inline-block bg-black px-5 py-3 text-xs font-medium uppercase tracking-wide text-white">
                  DISCOVER
                </span>
              </div>
            </a>
            <figcaption className="figcaption text-sm leading-relaxed">
              Step into the world of art and photography with Bid or Book! Explore a diverse collection of stunning
              paintings and captivating photographs, each telling its own unique story. From breathtaking landscapes to
              intimate portraits, Bid or Book offers you the opportunity to bid on your favorite pieces or book a
              session with talented artists and photographers. Immerse yourself in the beauty of visual art and
              photography, and let Bid or Book be your gateway to discovering and owning exceptional artwork. Start
              your artistic journey today!
            </figcaption>
          </div>

          <div className="relative group flex flex-col justify-between items-center p-5">
            <a href="#" className="group relative block w-full h-full mb-10">
              <div className="relative w-full h-72 sm:h-80 md:h-96 lg:h-[550px]">
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
              <div className="absolute inset-0 flex flex-col items-center justify-end p-10 ">
                <h3 className="text-xl font-bold text-white">AUCTION</h3>
                <p className="mt-1.5 text-pretty text-xs text-white">Bid on your favorite work now!</p>

                <span className="mt-3 inline-block bg-black px-5 py-3 text-xs font-medium uppercase tracking-wide text-white">
                  EXPLORE
                </span>
              </div>
            </a>
            <figcaption className="figcaption text-sm leading-relaxed">
              Step into the world of art and photography with Bid or Book! Explore a diverse collection of stunning
              paintings and captivating photographs, each telling its own unique story. From breathtaking landscapes to
              intimate portraits, Bid or Book offers you the opportunity to bid on your favorite pieces or book a
              session with talented artists and photographers. Immerse yourself in the beauty of visual art and
              photography, and let Bid or Book be your gateway to discovering and owning exceptional artwork. Start
              your artistic journey today!
            </figcaption>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeBody;

