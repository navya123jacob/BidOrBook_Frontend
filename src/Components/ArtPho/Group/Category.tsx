import React, { useEffect, useState } from "react";
import { useAllpostMutation } from "../../../redux/slices/Api/EndPoints/clientApiEndPoints";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/slices/Reducers/types";
import { Link } from "react-router-dom";

interface Post {
  image: string;
  description: string;
  name: string;
}

interface User {
  profile: string;
  posts: Post[];
  description: string;
  Fname: string;
  Lname: string;
  _id:string
}

interface GallerySectionProps {
  onTranslateUp: (category: "Photographer" | "Artist" | null) => void;
  translateUp: "Photographer" | "Artist" | null;
}

const GallerySection: React.FC<GallerySectionProps> = ({
  onTranslateUp,
  translateUp,
}) => {
  const [usersWithPosts, setUsersWithPosts] = useState<User[]>([]);
  const userInfo = useSelector((state: RootState) => state.client.userInfo);
  const [searchPlaceholder, setSearchPlaceholder] = useState<string>("");

  const [allpost, { isLoading }] = useAllpostMutation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const formdata: { category: "Photographer" | "Artist" | null; usernotid?: string; searchPlaceholder?: string } = {
          category: translateUp,
          usernotid: userInfo?.data?.message?._id,
        };

        if (searchPlaceholder) {
          formdata.searchPlaceholder = searchPlaceholder;
        }
        const response = await allpost(formdata).unwrap();
        setUsersWithPosts(response.posts);
        console.log(usersWithPosts);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [userInfo, translateUp, searchPlaceholder]);

  const handleBackButtonClick = () => {
    onTranslateUp(null);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black overflow-y-auto transform translate-y-0 transition-transform duration-300 h-screen">
        <div className="container mx-auto py-12">
          <section className="w-full mb-4">
            <div className="w-full h-[200px] bg-transparent flex flex-col justify-between items-center">
              <div className="flex flex-col justify-center items-center mt-10">
                <button
                  className="focus:outline-none px-4 py-2 rounded-md text-gray-800"
                  onClick={handleBackButtonClick}
                >
                  <img
                    width="48"
                    height="48"
                    src="https://img.icons8.com/pulsar-line/48/FFFFFF/circled-left-2.png"
                    alt="circled-left-2"
                  />
                </button>
                <h1
                  className="text-white text-center xl:text-3xl lg:text-2xl md:text-xl sm:text-l xs:text-base bg-gray-900 p-2 bg-opacity-40 rounded-sm"
                  style={{ fontFamily: "cursive" }}
                >
                  Discover {translateUp}
                </h1>
              </div>
              <div className="w-full mx-auto mb-10">
                <form>
                  <div className="xl:w-1/3 lg:w-1/3 md:w-1/3 sm:w-1/2 xs:w-2/3 mx-auto flex gap-2">
                    <input
                      type="text"
                      className="border border-gray-400 w-full p-1 bg-transparent rounded-md text-base pl-2"
                      placeholder={`Search for ${translateUp}...`}
                      value={searchPlaceholder}
                      onChange={(e) => setSearchPlaceholder(e.target.value)}
                    />
                  </div>
                </form>
              </div>
            </div>
          </section>

          {isLoading || usersWithPosts.length === 0 ? (
            <div className="flex justify-center items-center h-full">
              {isLoading ? (
                <span className="loader"></span>
              ) : (
               
                <div>
                <h2 className="text-white text-xl">
                  NO {translateUp?.toUpperCase()}'S FOUND
                </h2>
                <span className="loader"></span>
                
                </div>
                
              )}
            </div>
          ) : (
            usersWithPosts.map((user, index) => (
              <div
                key={index}
                className="max-w-screen-xl bg-opacity-20 bg-white p-5 mx-auto"
              >
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 md:gap-0 lg:grid-rows-2">
                  <Link
                    className="relative flex items-end justify-start w-full text-left bg-center bg-cover cursor-pointer h-60 md:col-span-2 lg:row-span-2 lg:h-full group"
                    style={{ backgroundImage: `url(${user.profile})` }}
                    to={`/artprof/client?id=${user._id}`} 
                  >
                    <div className="absolute top-0 left-0 right-0 flex items-center justify-between mx-5 mt-3">
                      <Link
                        rel="noopener noreferrer"
                        to={`/artprof/client?id=${user._id}`} 
                        className="px-3 py-2 text-s font-bold tracking-wider uppercase hover:underline"
                      >
                        {user?.Fname} {user?.Lname}
                      </Link>
                    </div>
                    <h2 className="z-10 p-5">
                      <Link
                        rel="noopener noreferrer"
                        to={`/artprof/client?id=${user._id}`} 
                        className="font-medium text-md lg:text-2xl lg:font-semibold bg-black text-white bg-opacity-50"
                      >
                        {user?.description}
                      </Link>
                    </h2>
                  </Link>
                  {user.posts.slice(0, 4).map((post, postIndex) => (
                    <div
                      key={postIndex}
                      className="relative flex items-end justify-start w-full text-left bg-center bg-cover cursor-pointer h-60 group"
                      style={{ backgroundImage: `url(${post.image})` }}
                    >
                      <div className="absolute top-0 left-0 right-0 flex items-center justify-between mx-5 mt-3">
                        <Link
                          rel="noopener noreferrer"
                          to={`/artprof/client?id=${user._id}`} 
                          className="px-3 py-2 text-xs font-bold tracking-wider uppercase hover:underline dark:text-gray-800"
                        >
                          {post?.name}
                        </Link>
                        <div className="flex flex-col justify-start text-center text-gray-800">
                          <span className="text-3xl font-semibold leading-none tracking-wide">
                            04
                          </span>
                          <span className="leading-none uppercase">Aug</span>
                        </div>
                      </div>
                      <h2 className="z-10 p-5">
                        <Link
                          rel="noopener noreferrer"
                          to={`/artprof/client?id=${user._id}`} 
                          className="font-medium text-md text-white"
                        >
                          {post?.description}
                        </Link>
                      </h2>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default GallerySection;
