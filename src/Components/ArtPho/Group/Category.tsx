import React, { useEffect, useState } from 'react';
import { useAllpostMutation } from '../../../redux/slices/Api/Client/clientApiEndPoints';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/slices/Reducers/types';

interface GallerySectionProps {
  onTranslateUp: (category: 'Photographer' | 'Artist' | null) => void;
  translateUp: 'Photographer' | 'Artist' | null;
}

const GallerySection: React.FC<GallerySectionProps> = ({ onTranslateUp, translateUp }) => {
  const [usersWithPosts, setUsersWithPosts] = useState([]);
  const userInfo = useSelector((state: RootState) => state.client.userInfo);
  const [allpost, { isLoading }] = useAllpostMutation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await allpost({ category: translateUp }).unwrap();
        setUsersWithPosts(response.posts);
        console.log(usersWithPosts)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [userInfo, translateUp]);

  const handleBackButtonClick = () => {
    onTranslateUp(null);
  };

  return (
<div className="fixed inset-0 bg-black overflow-y-auto transform translate-y-0 transition-transform duration-300">
  <div className="container mx-auto py-24">
    <button className="focus:outline-none bg-white  px-4 py-2 rounded-md text-gray-800" onClick={handleBackButtonClick}>
      <svg className="h-6 fill-current text-gray-600 hover:text-green-700" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <title>Back</title>
        <path fillRule="evenodd" clipRule="evenodd" d="M10.707 4.293a1 1 0 0 1 1.414 1.414l-4 4a1 1 0 0 0 0 1.414l4 4a1 1 0 1 1-1.414 1.414L6.414 14H20a1 1 0 0 1 1 1v2a1 1 0 1 1-2 0v-1H6.414l4.293 4.293a1 1 0 0 1-1.414 1.414l-6-6a1 1 0 0 1 0-1.414l6-6z"></path>
      </svg>
    </button>
    {/* here*/}
    {usersWithPosts.map((post,index)=>(
    <div className="max-w-screen-xl bg-opacity-20 bg-white p-5 mx-auto ">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 md:gap-0 lg:grid-rows-2">
        <div className="relative flex items-end justify-start w-full text-left dark:bg-gray-500 bg-center bg-cover cursor-pointer h-96 md:col-span-2 lg:row-span-2 lg:h-full group" style={{ backgroundImage: `url(${post.profile})` }}>
          
          <div className="absolute top-0 left-0 right-0 flex items-center justify-between mx-5 mt-3">
            <a rel="noopener noreferrer" href="#" className="px-3 py-2 text-xs font-semibold tracking-wider uppercase hover:underline dark:text-gray-800 dark:bg-violet-600">Art</a>
            <div className="flex flex-col justify-start text-center dark:text-gray-800">
              <span className="text-3xl font-semibold leading-none tracking-wide">31</span>
              <span className="leading-none uppercase">Jul</span>
            </div>
          </div>
          <h2 className="z-10 p-5">
            <a rel="noopener noreferrer" href="#" className="font-medium text-md group-hover:underline lg:text-2xl lg:font-semibold dark:text-gray-800">Fuga ea ullam earum assumenda, beatae labore eligendi.</a>
          </h2>
        </div>
        <div className="relative flex items-end justify-start w-full text-left dark:bg-gray-500 bg-center bg-cover cursor-pointer h-96 group" style={{ backgroundImage: "url(https://source.unsplash.com/random/240x320)" }}>
          
          <div className="absolute top-0 left-0 right-0 flex items-center justify-between mx-5 mt-3">
            <a rel="noopener noreferrer" href="#" className="px-3 py-2 text-xs font-semibold tracking-wider uppercase hover:underline dark:text-gray-800 dark:bg-violet-600">Politics</a>
            <div className="flex flex-col justify-start text-center dark:text-gray-800">
              <span className="text-3xl font-semibold leading-none tracking-wide">04</span>
              <span className="leading-none uppercase">Aug</span>
            </div>
          </div>
          <h2 className="z-10 p-5">
            <a rel="noopener noreferrer" href="#" className="font-medium text-md group-hover:underline dark:text-gray-800"> Autem sunt tempora mollitia magnam non voluptates</a>
          </h2>
        </div>
        
      </div>
    </div>
    ))}
    {/* here*/}
  </div>
</div>

  );
};

export default GallerySection;
