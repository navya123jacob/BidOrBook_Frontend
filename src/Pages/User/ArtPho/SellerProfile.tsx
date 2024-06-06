
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import Footer from '../../../Components/User/Footer';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/slices/Reducers/types';
import { Navbar } from '../../../Components/User/Navbar';
import PostDetailModal from '../../../Components/ArtPho/PostDetailModal';
import { useAllpostMutation } from '../../../redux/slices/Api/EndPoints/clientApiEndPoints';
import PostModal from '../../../Components/ArtPho/postModal';
import { useDeletePostMutation } from '../../../redux/slices/Api/EndPoints/clientApiEndPoints';
import { Booking } from '../../../types/booking';
import { useBookingsreqMutation, useBookingsConfirmMutation, useMarkedMutation, useCancelbookingMutation } from '../../../redux/slices/Api/EndPoints/bookingEndpoints';
import BookingRequestModal from '../../../Components/ArtPho/Group/BookingRequestModal';
import ConfirmationModal from '../../../Components/User/CancelConfirmModal';

const ProfilePageSeller: React.FC = () => {
  const [bookingsreq] = useBookingsreqMutation();
  const [bookingsConfirm] = useBookingsConfirmMutation();
  const [marked] = useMarkedMutation();
  const [cancelbooking] = useCancelbookingMutation();
  const userInfo = useSelector((state: RootState) => state.client.userInfo);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [isPostDetailModalOpen, setIsPostDetailModalOpen] = useState(false);
  const [usersWithPosts, setUsersWithPosts] = useState<any[]>([]);
  const [allpost, { isLoading }] = useAllpostMutation();
  const [deletePost] = useDeletePostMutation();
  const [bookingReqData, setBookingReqData] = useState<Booking[]>([]);
  const [bookingConfirmData, setBookingConfirmData] = useState<Booking[]>([]);
  const [markedData, setMarkedData] = useState<Booking[]>([]);
  const [isBookingRequestModalOpen, setIsBookingRequestModalOpen] = useState(false);
  const [isMarkedByModalOpen, setIsMarkedByModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [changes, setChanges] = useState<number>(0);

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

  const handleDeletePost = async (postId: string) => {
    console.log('Deleting post with ID:', postId);
    await deletePost({ postId, userId: userInfo.data.message._id });
    setUsersWithPosts((prevPosts) => prevPosts.filter(post => post._id !== postId));
    setIsPostDetailModalOpen(false);
  };

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await bookingsreq({ artistId: userInfo.data.message._id });
        if ('data' in response) {
          setBookingReqData(response.data?.bookings);
        }

        const response2 = await bookingsConfirm({ artistId: userInfo.data.message._id });
        if ('data' in response2) {
          setBookingConfirmData(response2.data?.bookings);
        }

        const response3 = await marked({ artistId: userInfo.data.message._id });
        if ('data' in response3) {
          setMarkedData(response3.data?.bookings);
        }
      } catch (err) {
        console.error("Error fetching bookings:", err);
      }
    };

    fetchBookings();
  }, [bookingsreq, bookingsConfirm, marked,  changes]);

  const handleBookingRequestClick = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsBookingRequestModalOpen(true);
  };
  const handleMarkingRequestClick = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsMarkedByModalOpen(true);
  };

  

  const handleCancelBooking = () => {
    setIsConfirmationModalOpen(true);
  };

  const bookingCancel = async () => {
    if (selectedBooking) {
      try {
        const response = await cancelbooking({ bookingId: selectedBooking._id, userId: userInfo.data.message._id });
        if ('data' in response) {

          setBookingReqData((prevData) => prevData.filter(booking => booking._id !== selectedBooking._id));
          setIsConfirmationModalOpen(false);
          setIsBookingRequestModalOpen(false);
          setSelectedBooking(null);
        }
      } catch (err) {
        console.error("Error canceling booking:", err);
      }
    }
  };
  return (
    <>
      <header className='bg-gray-950 bg-opacity-80'>
        <Navbar />
      </header>
      <main className="bg-black text-white min-h-screen">
        <div className="lg:w-8/12 lg:mx-auto mb-8">
          <header className="flex flex-wrap items-center p-4 md:py-8">
            <div className="w-full flex justify-end items-center mb-4">
              <FontAwesomeIcon icon={faPlus} className="text-3xl text-white" onClick={() => setIsModalOpen(true)} />
            </div>
            <div className="md:w-3/12 md:ml-16">
              <img
                className="w-20 h-20 md:w-40 md:h-40 object-cover rounded-full p-1"
                src={userInfo.data.message.profile}
                alt="profile"
              />
            </div>
            <div className="w-8/12 md:w-7/12 ml-4">
              <div className="md:flex md:flex-wrap md:items-center mb-4">
                <h2 className="text-3xl inline-block font-semibold md:mr-2 mb-2 sm:mb-0">
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
                <li onClick={() => handleBookingRequestClick(bookingReqData[0])}>
                  <span className="font-semibold">{bookingReqData.length}</span> Booking Requests
                </li>
                <li onClick={()=>handleMarkingRequestClick(markedData[0])}>
                  <span className="font-semibold">{markedData.length}</span> Marked By
                </li>
                <li>
                  <span className="font-semibold">{bookingConfirmData.length}</span> Booked
                </li>
              </ul>
              <div className="hidden md:block">
                <h1 className="font-semibold">{userInfo.data.message.Fname}</h1>
                <p>{userInfo.data.message.description}</p>
              </div>
            </div>
            <div className="md:hidden text-sm my-2">
              <h1 className="font-semibold">{userInfo.data.message.Fname} {userInfo.data.message.Lname}</h1>
              <p>{userInfo.data.message.description}</p>
            </div>
          </header>
          <div className="px-px md:px-3">
            <ul className="flex md:hidden justify-around space-x-8 border-t text-center p-2 text-white leading-snug text-sm">
              <li>
                <span className="font-semibold block text-white">{usersWithPosts.length}</span> posts
              </li>
              <li  onClick={() => handleBookingRequestClick(bookingReqData[0])}>
                <span className="font-semibold text-gray-200 block">{bookingReqData.length}</span> Booking Requests
              </li>
              <li onClick={()=>handleMarkingRequestClick(markedData[0])}>
                <span className="font-semibold text-gray-200 block">{markedData.length}</span> Marked By
              </li>
              <li>
                <span className="font-semibold text-gray-200 block">{bookingConfirmData.length}</span> Booked
              </li>
            </ul>
            <ul className="flex items-center justify-around md:justify-center space-x-12 uppercase tracking-widest font-semibold text-xs text-gray-600 border-t">
              <li className="md:border-t md:border-gray-700 md:-mt-px md:text-gray-700">
                <a className="inline-block p-3" href="#"></a>
              </li>
            </ul>
            <div className="flex flex-wrap -mx-px md:-mx-3">
              {isLoading ? (
                <span className="loader"></span>
              ) : (
                usersWithPosts.map((post: any, index: number) => (
                  <div key={index} className="w-1/3 p-px md:px-3">
                    <a href="#" onClick={() => handlePostClick(post)}>
                      <article className="post bg-gray-100 text-white relative pb-full md:mb-6">
                        <img className="w-full h-full absolute left-0 top-0 object-cover" src={post.image} alt="image" />
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
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      {isModalOpen && (
        <PostModal
          onClose={() => setIsModalOpen(false)}
          setUsersWithPosts={setUsersWithPosts}
          usersWithPosts={usersWithPosts}
        />
      )}

      {isPostDetailModalOpen && selectedPost && (
        <PostDetailModal
          post={selectedPost}
          onClose={() => setIsPostDetailModalOpen(false)}
          onDelete={() => handleDeletePost(selectedPost._id)}
        />
      )}
     
      <BookingRequestModal
        isOpen={isBookingRequestModalOpen}
        onClose={() => setIsBookingRequestModalOpen(false)}
        bookings={bookingReqData}
        onCancel={() => handleCancelBooking()}
       setChanges={setChanges}
       message="Booking Request"
       mark={false}
      />
     
      {isConfirmationModalOpen && (
       
        <ConfirmationModal
          message="Are you sure you want to cancel this booking?"
          onConfirm={bookingCancel}
          onCancel={() => setIsConfirmationModalOpen(false)}
        />
        
      )}
      
      {isMarkedByModalOpen && (
       
        <BookingRequestModal
        isOpen={isMarkedByModalOpen}
        onClose={()=>{setIsMarkedByModalOpen(false)}}
        bookings={markedData}
        onCancel={() => handleCancelBooking()}
       setChanges={setChanges}
       message="Marked Requests"
       mark={true}
        />
        
      )}
      <Footer />
    </>
  );
};

export default ProfilePageSeller;
