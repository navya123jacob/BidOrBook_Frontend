import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/slices/Reducers/types';

interface HeroSectionProps {
  onTranslateUp: (category: 'Photographer' | 'Artist') => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onTranslateUp }) => {
  const userInfo = useSelector((state: RootState) => state.client.userInfo);

  return (
    <div className="relative w-full h-screen bg-cover bg-center overflow-hidden bg-[url('https://assets.codepen.io/1462889/photo.jpeg')]">
      <div className="absolute inset-0 flex flex-col justify-center items-center text-center">
        <h1 className="text-8vw font-extrabold text-white">
          {userInfo?.data?.message?.Fname}
          <br />
          {userInfo?.data?.message?.Lname}
        </h1>
        <div className="mt-2 text-lg font-bold text-white uppercase transform -translate-y-40 rotate-[-40deg]">
          <span className="bg-blue-900 px-4 py-2 rounded">EXPLORE</span>
        </div>
        <div className="mt-4">
          <p className="text-lg font-bold">
            <span
              className="mx-4 cursor-pointer text-white hover:text-yellow-300"
              onClick={() => onTranslateUp('Photographer')}
            >
              Photographers
            </span>
            <span
              className="mx-4 cursor-pointer text-white hover:text-yellow-300"
              onClick={() => onTranslateUp('Artist')}
            >
              Artists
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
