import React from 'react'

const EachCategory = () => {
  return (
    
        <div className="fixed inset-0 bg-blue-900 overflow-y-auto transform translate-y-0 transition-transform duration-300">
          <div className="absolute top-5 right-5 w-8 h-8 cursor-pointer transition-transform duration-200 transform hover:rotate-90" onClick={onBack}>
            <img src="http://www.ivang-design.com/svg-load/portfolio/close.svg" alt="Close" />
          </div>
          <div className="container mx-auto py-24">
            <div className="text-center text-7vw font-bold text-white">travel</div>
            <div className="mt-3 text-center text-lg font-bold text-yellow-300">Canon PowerShot S95</div>
            <div className="mt-3 text-center text-white">
              <p>focal length: 22.5mm<br />aperture: ƒ/5.6<br />exposure time: 1/1000<br />ISO: 80</p>
            </div>
            <div className="flex flex-wrap justify-center mt-10">
              {[...Array(12)].map((_, index) => (
                <div key={index} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2">
                  <img src="https://assets.codepen.io/1462889/photo-p.jpg" alt="" className="w-full h-auto rounded shadow-lg" />
                </div>
              ))}
            </div>
          </div>
        </div>
      );
  )
}

export default EachCategory
