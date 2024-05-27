import { useState } from 'react';
import { Navbar } from '../../../Components/User/Navbar';
import HeroSection from '../../../Components/ArtPho/Group/Hero';
import GallerySection from '../../../Components/ArtPho/Group/Category';


const ProfilesSellers = () => {
  

    const [translateUp, setTranslateUp] = useState<'Photographer' | 'Artist' | null>(null);

    const handleTranslateUp = (category: 'Photographer' | 'Artist' | null) => {
        setTranslateUp(category);
    };

  return (
    <>
    
      <header className={`${translateUp ? 'bg-gray-900 bg-opacity-80' : ''} absolute inset-x-0 top-0 z-50`}>
        <Navbar />
      </header>
      <div className={`relative h-screen ${translateUp ? '' : 'overflow-hidden'}`}>
        <div className={`absolute inset-0 transition-transform duration-500 ${translateUp ? '-translate-y-full' : 'translate-y-0'} z-10`}>
          <HeroSection onTranslateUp={handleTranslateUp} />
        </div>
        {translateUp && (
          <div className="absolute inset-0">
            <GallerySection onTranslateUp={handleTranslateUp} translateUp={translateUp}/>
          </div>
        )}
      </div>
    </>
  );
};

export default ProfilesSellers;
