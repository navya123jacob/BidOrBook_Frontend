import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import Footer from '../../../Components/User/Footer';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/slices/Reducers/types';
import { Navbar } from '../../../Components/User/Navbar';
import PostDetailModal from '../../../Components/ArtPho/PostDetailModal';
import { useAllpostMutation } from '../../../redux/slices/Api/Client/clientApiEndPoints';
import PostModal from '../../../Components/ArtPho/postModal';
import { useDeletePostMutation } from '../../../redux/slices/Api/Client/clientApiEndPoints';
const ProfilePageSeller: React.FC = () => {
  const userInfo = useSelector((state: RootState) => state.client.userInfo);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [isPostDetailModalOpen, setIsPostDetailModalOpen] = useState(false);
  const [usersWithPosts, setUsersWithPosts] = useState<any[]>([]);
  const [allpost, { isLoading }] = useAllpostMutation();
  const [deletePost, { isLoading:deleteload }] = useDeletePostMutation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await allpost({ userid: userInfo.data.message._id });
        if ('data' in response) {
          setUsersWithPosts(response.data.posts);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [allpost, userInfo.data.message._id]);

  const handleScroll = () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handlePostClick = (post: any) => {
    setSelectedPost(post);
    setIsPostDetailModalOpen(true);
  };

  const handleDeletePost = async(postId: string) => {
    
      console.log('Deleting post with ID:', postId);
      const response=await deletePost({postId,userId:userInfo.data.message._id})
      setUsersWithPosts((prevPosts) => prevPosts.filter(post => post._id !== postId));
      setIsPostDetailModalOpen(false);
    
  };

  return (
    <>
      <header className='bg-gray-950 bg-opacity-80'>
        <Navbar />
      </header>
      <main className="bg-black text-white min-h-screen">
        <div className="lg:w-8/12 lg:mx-auto mb-8">
          <header className="flex flex-wrap items-center p-4 md:py-8">
            <div className="w-full flex justify-between items-center mb-4">
              <h1 className="text-3xl font-light">Profile</h1>
              <FontAwesomeIcon icon={faPlus} className="text-3xl text-white" onClick={() => setIsModalOpen(true)} />
            </div>
            <div className="md:w-3/12 md:ml-16">
              <img
                className="w-20 h-20 md:w-40 md:h-40 object-cover rounded-full border-2 border-pink-600 p-1"
                src={userInfo.data.message.profile}
                alt="profile"
              />
            </div>
            <div className="w-8/12 md:w-7/12 ml-4">
              <div className="md:flex md:flex-wrap md:items-center mb-4">
                <h2 className="text-3xl inline-block font-light md:mr-2 mb-2 sm:mb-0">
                  {userInfo.data.message.Fname} {userInfo.data.message.Lname}
                </h2>
                {userInfo.client && (
                  <a
                    href="#"
                    className="bg-blue-500 px-2 py-1 text-white font-semibold text-sm rounded block text-center sm:inline-block"
                  >
                    Book
                  </a>
                )}
              </div>
              <ul className="hidden md:flex space-x-8 mb-4">
                <li>
                  <span className="font-semibold">{usersWithPosts.length}</span> posts
                </li>
                <li>
                  <span className="font-semibold">{userInfo.data.message.bookings.length}</span> Booked
                </li>
                <li>
                  <span className="font-semibold">{userInfo.data.message.marked.length}</span> Marked By
                </li>
                <li>
                  <span className="font-semibold">{userInfo.data.message.bookings.length}</span> Booking Requests
                </li>
                
              </ul>
              <div className="hidden md:block">
                <h1 className="font-semibold">{userInfo.data.message.Fname}</h1>
                <p>{userInfo.data.message.description}</p>
              </div>
            </div>
            <div className="md:hidden text-sm my-2">
              <h1 className="font-semibold">{userInfo.data.message.Fname} {userInfo.data.message.Lname}</h1>
              
              <p>{userInfo.data.message.description} </p>
            </div>
          </header>
          <div className="px-px md:px-3">
            <ul className="flex md:hidden justify-around space-x-8 border-t text-center p-2 text-gray-600 leading-snug text-sm">
              
              <li>
                  <span className="font-semibold text-gray-800 block">{usersWithPosts.length}</span> posts
                </li>
                <li>
                  <span className="font-semibold text-gray-800 block">{userInfo.data.message.bookings.length}</span> Booked
                </li>
                <li>
                  <span className="font-semibold text-gray-800 block">{userInfo.data.message.marked.length}</span> Marked By
                </li>
                <li>
                  <span className="font-semibold text-gray-800 block">{userInfo.data.message.bookings.length}</span> Booking Requests
                </li>
            </ul>
            <ul className="flex items-center justify-around md:justify-center space-x-12 uppercase tracking-widest font-semibold text-xs text-gray-600 border-t">
              <li className="md:border-t md:border-gray-700 md:-mt-px md:text-gray-700">
                <a className="inline-block p-3" href="#">
                  <i className="fas fa-th-large text-xl md:text-xs"></i> <span className="hidden md:inline">post</span>
                </a>
              </li>
            </ul>
            <div className="flex flex-wrap -mx-px md:-mx-3">
              {usersWithPosts.map((post: any, index: number) => (
                <div key={index} className="w-1/3 p-px md:px-3">
                  <a href="#" onClick={() => handlePostClick(post)}>
                    <article className="post bg-gray-100 text-white relative pb-full md:mb-6">
                      <img className="w-full h-full absolute left-0 top-0 object-cover" src={post.image} alt="image" />
                      <i className="fas fa-square absolute right-0 top-0 m-1"></i>
                      <div className="overlay bg-gray-800 bg-opacity-25 w-full h-full absolute left-0 top-0 hidden">
                        <div className="flex justify-center items-center space-x-4 h-full">
                          <span className="p-2">
                            <i className="fas fa-heart"></i> {post.likes}
                          </span>
                         
                        </div>
                      </div>
                    </article>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {isModalOpen && (
        <PostModal onClose={() => setIsModalOpen(false)} 
        setUsersWithPosts={setUsersWithPosts}
        usersWithPosts={usersWithPosts}/>
      )}

      {isPostDetailModalOpen && selectedPost && (
        <PostDetailModal
          post={selectedPost}
          onClose={() => setIsPostDetailModalOpen(false)}
          onDelete={() => handleDeletePost(selectedPost._id)}
         
        />
      )}
      <Footer />
    </>
  );
};

export default ProfilePageSeller;
