import React, { useState, useEffect } from 'react';
import Footer from './../../Components/User/Footer';
import { useSelector } from 'react-redux';
import { RootState } from './../../redux/slices/Reducers/types';
import { Navbar } from './../../Components/User/Navbar';
import PostDetailModal from './../../Components/ArtPho/PostDetailModal';
import { useSingleUserPostMutation } from '../../redux/slices/Api/EndPoints/clientApiEndPoints';
import { useParams } from 'react-router-dom';
import { User } from '../../types/user';
import DatePickerModal from '../../Components/User/DatePickerModal';
import { useBookingsreqMutation ,useBookingsConfirmMutation,useMarkedMutation} from '../../redux/slices/Api/EndPoints/bookingEndpoints';
const SellerProfileClientside: React.FC = () => {
  const [bookingsreq]=useBookingsreqMutation()
  const [bookingsConfirm]=useBookingsConfirmMutation()
  const [marked]=useMarkedMutation()
  const userInfo = useSelector((state: RootState) => state.client.userInfo);
  const [otheruser, setOtheruser] = useState<User | null>(null);
  const { id } = useParams<{ id: string }>();
  const [page, setPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [isPostDetailModalOpen, setIsPostDetailModalOpen] = useState(false);
  const [isDatePickerModalOpen, setIsDatePickerModalOpen] = useState(false); 
  const [usersWithPosts, setUsersWithPosts] = useState<any[]>([]);
  const [singleUserPost,{isLoading}]=useSingleUserPostMutation();
 const [bookingReqData,setBookingReqData]=useState<number>(0);
 const [bookingConfirmData,setBookingConfirmData]=useState<number>(0);
 const [markedData,setMarkedData]=useState<number>(0);
//   date
const [value, setValue] = useState({
  startDate: new Date(),
  endDate: new Date(new Date().getFullYear(), 11, 31) 
});


const handleValueChange = (newValue: any) => {
    console.log("newValue:", newValue);
    setValue(newValue);
};

  
  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          const response = await singleUserPost(id);
          if ('data' in response) {
            setOtheruser(response.data);
            setUsersWithPosts(response.data.posts);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      fetchData();
    } else {
      console.error('User ID is undefined');
    }
  }, [id, singleUserPost]);

 
  const handleScroll = () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await bookingsreq({artistId:id,len:true});
        if ('data' in response) {
          setBookingReqData(response.data?.bookings.length);
        } 
        
        const response2 = await bookingsConfirm({artistId:id,len:true})
        if ('data' in response2) {
          setBookingConfirmData(response2.data?.bookings.length);
        }
        
        const response3 = await marked({artistId:id,len:true})
        if ('data' in response3) {
          setMarkedData(response3.data?.bookings.length);
        }
      } catch (err) {
        console.error("Error fetching bookings:", err);
      }
    };

    fetchBookings();
  }, [bookingReqData,bookingConfirmData]);


 
  const handlePostClick = (post: any) => {
    setSelectedPost(post);
    setIsPostDetailModalOpen(true);
  };

 
  const handleBookClick = () => {
    setIsDatePickerModalOpen(true); 
    
  };

  return (
    <>
      <header className='bg-gray-950 bg-opacity-80'>
        <Navbar />
      </header>
      <main className="bg-black text-white min-h-screen">
        <div className="lg:w-8/12 lg:mx-auto mb-8">
          <header className="flex flex-wrap items-center p-4 md:py-8">
            <div className="md:w-3/12 md:ml-16">
              <img
                className="w-20 h-20 md:w-40 md:h-40 object-cover rounded-full p-1"
                src={otheruser?.profile}
                alt="profile"
              />
            </div>
            <div className="w-8/12 md:w-7/12 ml-4">
              <div className="md:flex md:flex-wrap md:items-center mb-4">
                <h2 className="text-3xl inline-block font-semibold md:mr-2 mb-2 sm:mb-0">
                  {otheruser?.Fname} {otheruser?.Lname}
                </h2>
                {userInfo.client && (
                  <>
                  <button
                   
                    onClick={handleBookClick}
                    className="bg-gray-900 mx-5 px-2 py-1 text-white font-semibold text-sm rounded block text-center sm:inline-block"
                  >
                    Book
                  </button>
                  <button
                   
                    onClick={handleBookClick}
                    className="bg-gray-900 mx-5 px-2 py-1 text-white font-semibold text-sm rounded block text-center sm:inline-block"
                  >
                    DM
                  </button>
                  </>
                )}
              </div>
              <ul className="hidden md:flex space-x-8 mb-4">
                <li>
                  <span className="font-semibold">{usersWithPosts.length}</span> posts
                </li>
                <li>
                  <span className="font-semibold">{bookingReqData}</span> Booking Requests
                </li>
               
                <li>
                  <span className="font-semibold">{markedData}</span> Marked By
                </li>
                <li>
                  <span className="font-semibold">{bookingConfirmData}</span> Booked
                </li>
                
              </ul>
              <div className="hidden md:block">
                <h1 className="font-semibold">{otheruser?.Fname}</h1>
                <p>{userInfo.data.message.description}</p>
              </div>
            </div>
            <div className="md:hidden text-sm my-2">
              <h1 className="font-semibold">{otheruser?.Fname} {otheruser?.Lname}</h1>
              <p>{otheruser?.description}</p>
            </div>
          </header>
          <div className="px-px md:px-3">
            <ul className="flex md:hidden justify-around space-x-8 border-t text-center p-2 text-gray-600 leading-snug text-sm">
              <li>
                <span className="font-semibold text-gray-800 block">{usersWithPosts.length}</span> posts
              </li>
              <li>
                <span className="font-semibold text-gray-800 block">{bookingReqData}</span> Booking Requests
              </li>
              <li>
                <span className="font-semibold text-gray-800 block">{markedData}</span> Marked By
              </li>
              
              <li>
                <span className="font-semibold text-gray-800 block">{bookingConfirmData}</span> Booked
              </li>
            </ul>
            <ul className="flex items-center justify-around md:justify-center space-x-12 uppercase tracking-widest font-semibold text-xs text-gray-600 border-t">
              <li className="md:border-t md:-mt-px md:text-gray-700">
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
      {isDatePickerModalOpen && (
        <DatePickerModal
          onClose={() => setIsDatePickerModalOpen(false)}
          value={value}
          handleValueChange={handleValueChange}
          artistId={id}
          bookingReqData={bookingReqData}
          setBookingReqData={setBookingReqData}
          markedData={markedData}
         setMarkedData={setMarkedData}
          category={otheruser?.category|| ""}
          
        />
      )}
      {isPostDetailModalOpen && selectedPost && (
        <PostDetailModal
          post={selectedPost}
          onClose={() => setIsPostDetailModalOpen(false)}
        />
      )}

      <Footer />
    </>
  );
};

export default SellerProfileClientside;
