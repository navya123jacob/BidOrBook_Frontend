import React, { useEffect, useState } from 'react';
import { useAllpostMutation } from '../../../redux/slices/Api/Client/clientApiEndPoints';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/slices/Reducers/types';


interface Post {
  image: string;
  description:string;
}

interface User {
  profile: string;
  posts: Post[];
  description:string;
  Fname:string;
  Lname:string;
}

interface GallerySectionProps {
  onTranslateUp: (category: 'Photographer' | 'Artist' | null) => void;
  translateUp: 'Photographer' | 'Artist' | null;
}

const GallerySection: React.FC<GallerySectionProps> = ({ onTranslateUp, translateUp }) => {
  const [usersWithPosts, setUsersWithPosts] = useState<User[]>([]);
  const userInfo = useSelector((state: RootState) => state.client.userInfo);
  const [allpost, { isLoading }] = useAllpostMutation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await allpost({ category: translateUp }).unwrap();
        setUsersWithPosts(response.posts); 
        console.log(usersWithPosts);
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
    <div className="fixed inset-0 bg-black overflow-y-auto transform translate-y-0 transition-transform duration-300 h-screen">
      <div className="container mx-auto py-12">
        <button className="focus:outline-none bg-white px-4 py-2 rounded-md text-gray-800" onClick={handleBackButtonClick}>
          <svg className="h-6 fill-current text-gray-600 hover:text-green-700" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <title>Back</title>
            <path fillRule="evenodd" clipRule="evenodd" d="M10.707 4.293a1 1 0 0 1 1.414 1.414l-4 4a1 1 0 0 0 0 1.414l4 4a1 1 0 1 1-1.414 1.414L6.414 14H20a1 1 0 0 1 1 1v2a1 1 0 1 1-2 0v-1H6.414l4.293 4.293a1 1 0 0 1-1.414 1.414l-6-6a1 1 0 0 1 0-1.414l6-6z"></path>
          </svg>
        </button>
        {usersWithPosts.map((user, index) => (
          <div key={index} className="max-w-screen-xl bg-opacity-20 bg-white p-5 mx-auto">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 md:gap-0 lg:grid-rows-2">
              <div
                className="relative flex items-end justify-start w-full text-left bg-center bg-cover cursor-pointer h-60 md:col-span-2 lg:row-span-2 lg:h-full group"
                style={{ backgroundImage: `url(${user.profile})` }}
              >
                <div className="absolute top-0 left-0 right-0 flex items-center justify-between mx-5 mt-3">
                  <a rel="noopener noreferrer" href="#" className="px-3 py-2 text-s font-bold tracking-wider uppercase hover:underline">{user?.Fname} {user?.Lname}</a>
                  <div className="flex flex-col justify-start text-center text-gray-800">
                    <span className="text-3xl font-semibold leading-none tracking-wide">31</span>
                    <span className="leading-none uppercase">Jul</span>
                  </div>
                </div>
                <h2 className="z-10 p-5">
                  <a rel="noopener noreferrer" href="#" className="font-medium text-md lg:text-2xl lg:font-semibold bg-black text-white bg-opacity-50">{user?.description}</a>
                </h2>
              </div>
              {user.posts.slice(0, 4).map((post, postIndex) => (<>
                <div
                  key={postIndex}
                  className="relative flex items-end justify-start w-full text-left bg-center bg-cover cursor-pointer h-60 group"
                  style={{ backgroundImage: `url(${post.image})` }}
                >
                  <div className="absolute top-0 left-0 right-0 flex items-center justify-between mx-5 mt-3">
                    <a rel="noopener noreferrer" href="#" className="px-3 py-2 text-xs font-semibold tracking-wider uppercase hover:underline dark:text-gray-800">Politics</a>
                    <div className="flex flex-col justify-start text-center text-gray-800">
                      <span className="text-3xl font-semibold leading-none tracking-wide">04</span>
                      <span className="leading-none uppercase">Aug</span>
                    </div>
                  </div>
                  <h2 className="z-10 p-5">
                    <a rel="noopener noreferrer" href="#" className="font-medium text-md text-white">{post?.description}</a>
                  </h2>
                </div>
                </>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GallerySection;
