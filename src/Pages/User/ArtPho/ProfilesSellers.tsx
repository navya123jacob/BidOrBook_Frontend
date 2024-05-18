import React, { useState } from 'react';
import { Navbar } from '../../../Components/User/Navbar';
import HeroSection from '../../../Components/ArtPho/Group/Hero';
import GallerySection from '../../../Components/ArtPho/Group/Category';
import EachCategory from './Group/EachCategory';
const ProfilesSellers = () => {
  const [translateUp, setTranslateUp] = useState(false);

  const handleTranslateUp = () => {
    setTranslateUp(true);
  };

  return (
    <>
      <Navbar />
      <div className={`relative h-screen  ${translateUp ? '' : 'overflow-hidden'}`}>
        <div className={`absolute inset-0 transition-transform duration-500 ${translateUp ? '-translate-y-full' : 'translate-y-0'} z-10`}>
          <HeroSection onTranslateUp={handleTranslateUp} />
        </div>
        {translateUp && (
          <div className="absolute inset-0 ">
            <GallerySection onTranslateUp={handleTranslateUp} />
          </div>
        )}
      </div>
    </>
  );
};

export default ProfilesSellers;
