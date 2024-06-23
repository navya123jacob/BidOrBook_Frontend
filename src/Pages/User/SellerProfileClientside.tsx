import React, { useState, useEffect } from "react";
import {  useSearchParams } from "react-router-dom";
import ReactStars from "react-rating-stars-component";
import {  useSelector } from "react-redux";
import Footer from "./../../Components/User/Footer";
import { RootState } from "./../../redux/slices/Reducers/types";
import { Navbar } from "./../../Components/User/Navbar";
import PostDetailModal from "./../../Components/ArtPho/PostDetailModal";
import DatePickerModal from "../../Components/User/DatePickerModal";
import ChatComponent from "../../Components/ChatSingle";
import BookingDetailModal from "../../Components/User/BookingDetailsClient";
import ConfirmationModal from "../../Components/User/CancelConfirmModal";
import {
  useAddReviewMutation,
  useGetUserReviewsQuery,
  useRemoveReviewMutation,
  useSingleUserPostMutation,
  useSpamUserMutation,
  useUnspamUserMutation,
} from "../../redux/slices/Api/EndPoints/clientApiEndPoints";
import {
  useBookingsConfirmMutation,
  useSingleBookingQuery,
  useCancelbookingMutation,
} from "../../redux/slices/Api/EndPoints/bookingEndpoints";
import { IReview, Post, User } from "../../types/user";
import { Booking } from "../../types/booking";
import SpamModal from "../../Components/User/SpamModal";
import AllBookingsModal from "../../Components/User/AllBookingViewClient";
import ReviewModal from "../../Components/ReviewModal";
import ViewReviewsModal from "../../Components/ViewReviewsModal";
const SellerProfileClientside: React.FC = () => {
  const userInfo = useSelector((state: RootState) => state.client.userInfo);


  const [searchParams] = useSearchParams();
  const id = searchParams.get("id") ?? undefined;
  const { data: reviewData,refetch } = useGetUserReviewsQuery(id ?? "");
  const [otheruser, setOtheruser] = useState<User | null>(null);
  const [page, setPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isPostDetailModalOpen, setIsPostDetailModalOpen] = useState(false);
  const [isDatePickerModalOpen, setIsDatePickerModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [usersWithPosts, setUsersWithPosts] = useState<Post[]>([]);
  const [bookingConfirmData, setBookingConfirmData] = useState<number>(0);
  const [isViewReviewsModalOpen, setIsViewReviewsModalOpen] = useState(false);
  const [reviews, setReviews] = useState<IReview[]>([]);

  const [value, setValue] = useState({
    startDate: new Date(),
    endDate: new Date(new Date().getFullYear(), 11, 31),
  });
  const [isBookingDetailModalOpen, setIsBookingDetailModalOpen] =
    useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [isSpamModalOpen, setIsSpamModalOpen] = useState(false);
  const [isReasonModalOpen, setIsReasonModalOpen] = useState(false);
  const [isUnspamModalOpen, setIsUnspamModalOpen] = useState(false);
  const [spamReason, setSpamReason] = useState("");
  const [spamUser] = useSpamUserMutation();
  const [unspamUser] = useUnspamUserMutation();
  const [isAllBookingsModalOpen, setIsAllBookingsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [changes, setChanges] = useState(0);
  const [singleBooking, setSingleBooking] = useState<Booking | null>(null);
  const [singleUserPost, { isLoading }] = useSingleUserPostMutation();
  const [cancelbooking] = useCancelbookingMutation();
  const [bookingsConfirm] = useBookingsConfirmMutation();
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [userReview, setUserReview] = useState({ stars: 0, review: "" });
  const [addReview] = useAddReviewMutation();
  const [removeReview] = useRemoveReviewMutation();

  const { data: queryData } = useSingleBookingQuery(
    {
      artistId: otheruser?._id || "",
      clientId: userInfo?.data?.message?._id || "",
    },
    { skip: !otheruser?._id || !userInfo?.data?.message?._id }
  );

  const handleValueChange = (newValue: any) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          const response = await singleUserPost(id);
          if ("data" in response) {
            setOtheruser(response.data);
            const filteredPosts = response.data.posts.filter(
              (post: Post) => post.is_blocked !== true
            );
            setUsersWithPosts(filteredPosts);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      fetchData();
    } else {
      console.error("User ID is undefined");
    }
  }, [id, singleUserPost, userInfo.data.message._id]);

  useEffect(() => {
    
    if (reviewData?.receivedReviews) {  
      setReviews(reviewData.receivedReviews);
      const existingReview = reviewData.receivedReviews.find(
        (review: any) => review.userId._id === userInfo.data.message._id
      );
      console.log('existing',existingReview)
      if (existingReview) {
        setUserReview({stars:existingReview.stars,review:existingReview.review});
      }
    }
  }, [reviewData]);
  

  const handleReviewClick = () => {
    setIsReviewModalOpen(true);
  };

  const handleReviewSubmit = async (stars: number, review: string) => {
    if (id) {
       await addReview({
        userId: userInfo.data.message._id,
        id,
        stars,
        review,
      });

      refetch()
      setIsReviewModalOpen(false);
    }
  };

  const handleRemoveReview = async () => {
    if (id) {
       await removeReview({
        reviewUserId: userInfo.data.message._id,
        id,
      });
      setUserReview({stars:0,review:''})
      refetch()
    }
  };

  useEffect(() => {
    if (queryData) {
      setSingleBooking(queryData);
    }
  }, [queryData]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        setPage((prevPage) => prevPage + 1);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await bookingsConfirm({ artistId: id, len: true });
        if ("data" in response) {
          setBookingConfirmData(response.data?.bookings.length);
        }
      } catch (err) {
        console.error("Error fetching bookings:", err);
      }
    };
    fetchBookings();
  }, [id, bookingsConfirm]);

  const handlePostClick = (post: any) => {
    setSelectedPost(post);
    setIsPostDetailModalOpen(true);
  };

  const handleBookClick = () => {
    setIsDatePickerModalOpen(true);
  };

  const handleDMClick = () => {
    setIsChatOpen(true);
  };

  const seeStatus = () => {
    setIsBookingDetailModalOpen(true);
  };

  const handleCancelBooking = () => {
    setIsConfirmationModalOpen(true);
  };

  const bookingCancel = async () => {
    if (selectedBooking) {
      const response = await cancelbooking({
        bookingId: selectedBooking._id,
        userId: otheruser?._id || "",
        clientId: userInfo?.data?.message?._id || "",
        amount: selectedBooking.amount,
        status: selectedBooking.status,
      });
      if ("data" in response) {
        setIsBookingDetailModalOpen(false);
        setIsConfirmationModalOpen(false);
        setSingleBooking(null);
        setChanges((prevChanges) => prevChanges + 1);
      }
    }
  };
  const handleSpamClick = () => {
    setIsSpamModalOpen(true);
  };

  const handleSpamConfirm = () => {
    setIsSpamModalOpen(false);
    setIsReasonModalOpen(true);
  };

  const handleSpamSubmit = async () => {
    if (id) {
      await spamUser({
        userId: userInfo.data.message._id,
        id,
        reason: spamReason,
      });
      setOtheruser((prevUser) => {
        if (!prevUser) return null;
        return {
          ...prevUser,
          spam: [
            ...(prevUser.spam || []),
            { userId: userInfo.data.message._id, reason: spamReason },
          ],
        };
      });
      setIsReasonModalOpen(false);
      setSpamReason("");
    }
  };

  const handleUnspamClick = () => {
    setIsUnspamModalOpen(true);
  };

  const handleUnspamConfirm = async () => {
    if (id) {
      const response = await unspamUser({
        userId: userInfo.data.message._id,
        id,
      });

      setOtheruser((prevUser) => {
        if (!prevUser) return null;
        return {
          ...prevUser,
          spam:
            prevUser.spam?.filter(
              (spam) => spam.userId !== userInfo.data.message._id
            ) || [],
        };
      });
      setIsUnspamModalOpen(false);
    }
  };
  const handleViewBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsBookingDetailModalOpen(true);
  };

  return (
    <>
      <header className="bg-stone-900 bg-opacity-80">
        <Navbar />
      </header>
      <main className="bg-black text-white min-h-screen">
        <div className="lg:w-8/12 lg:mx-auto mb-8">
          <header className="flex flex-col items-center justify-center p-4 md:py-8">
            <div className="flex flex-col justify-center  items-center">
              <img
                className="w-30 h-30 md:w-50 md:h-50 object-cover rounded-full p-1"
                src={otheruser?.profile}
                alt="profile"
              />
              <div className="md:flex md:flex-wrap md:items-center md:justify-center  justi mb-4">
                {userInfo.client && (
                  <>
                    {/* {!singleBooking ? ( */}
                    <button
                      onClick={handleBookClick}
                      className="bg-graydark m-5 px-2 py-1 text-white font-semibold text-sm rounded block text-center sm:inline-block"
                    >
                      Book
                    </button>
                    <button
                      onClick={() => setIsAllBookingsModalOpen(true)}
                      className="bg-graydark m-5 px-2 py-1 text-white font-semibold text-sm rounded block text-center sm:inline-block"
                    >
                      View All Bookings
                    </button>
                    {/* ) : (
                      <button
                      
                        onClick={seeStatus}
                        className="bg-graydark m-5 px-2 py-1 text-white font-semibold text-sm rounded block text-center sm:inline-block"
                      >
                        {singleBooking.status === 'pending'
                          ? 'Booking Requested'
                          : singleBooking.status === 'confirmed'
                          ? 'Booking Accepted'
                          : singleBooking.status === 'marked'
                          ? 'Marked'
                          : 'Booked'}
                      </button>
                    )} */}
                    <button
                      onClick={handleDMClick}
                      className="bg-graydark m-5 px-2 py-1 text-white font-semibold text-sm rounded block text-center sm:inline-block"
                    >
                      DM
                    </button>
                    {userReview.stars ? (
                      <>
                        <button
                          onClick={() => setIsReviewModalOpen(true)}
                          className="bg-graydark m-5 px-2 py-1 text-white font-semibold text-sm rounded block text-center sm:inline-block"
                        >
                          <ReactStars
                            count={5}
                            value={userReview.stars}
                            size={20}
                            isHalf={true}
                            edit={false}
                            activeColor="#ffd700"
                          />
                        </button>
                        
                        <button
                          onClick={handleRemoveReview}
                          className="bg-red-600 m-5 px-2 py-1 text-white font-semibold text-sm rounded block text-center sm:inline-block"
                        >
                          Remove Review
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={handleReviewClick}
                        className="bg-graydark m-5 px-2 py-1 text-white font-semibold text-sm rounded block text-center sm:inline-block"
                      >
                        Add Review
                      </button>
                    )}
                    <button
                      onClick={() => setIsViewReviewsModalOpen(true)}
                      className="bg-graydark m-5 px-2 py-1 text-white font-semibold text-sm rounded block text-center sm:inline-block"
                    >
                      View Reviews
                    </button>
                  </>
                )}
              </div>
            </div>
            <div className="flex flex-col items-center justify-center ml-4">
              <ul className="hidden md:flex space-x-8 mb-4">
                <li className="hover:cursor-pointer">
                  <span className="font-semibold">{usersWithPosts.length}</span>{" "}
                  posts
                </li>
                <li className="hover:cursor-pointer">
                  <span className="font-semibold">{bookingConfirmData}</span>{" "}
                  Booked
                </li>
              </ul>
              <div className="hidden md:block">
                <h1 className="font-semibold text-center">
                  {otheruser?.Fname} {otheruser?.Lname}
                </h1>
                <p>{otheruser?.description}</p>
                {otheruser?.spam &&
                otheruser.spam.some(
                  (spam) => spam.userId === userInfo.data.message._id
                ) ? (
                  <button
                    onClick={handleUnspamClick}
                    className="bg-red-600 m-5 px-2 py-1 text-white font-semibold text-sm rounded block text-center sm:inline-block"
                  >
                    Unspam
                  </button>
                ) : (
                  <button
                    onClick={handleSpamClick}
                    className="bg-red-600 m-5 px-2 py-1 text-white font-semibold text-sm rounded block text-center sm:inline-block"
                  >
                    Spam
                  </button>
                )}
              </div>
            </div>
            <div className="flex flex-col justify-center items-center  md:hidden text-sm my-2">
              <h1 className="font-semibold">
                {otheruser?.Fname} {otheruser?.Lname}
              </h1>
              <p>{otheruser?.description}</p>
              <p>
                Location : {otheruser?.location.district},
                {otheruser?.location.state},{otheruser?.location.country}
              </p>

              {otheruser?.spam &&
              otheruser.spam.some(
                (spam) => spam.userId === userInfo.data.message._id
              ) ? (
                <button
                  onClick={handleUnspamClick}
                  className="bg-red-600 mt-5 px-2 py-1 text-white font-semibold text-sm rounded block text-center sm:inline-block"
                >
                  Unspam
                </button>
              ) : (
                <button
                  onClick={handleSpamClick}
                  className="bg-red-600 mt-5 px-2 py-1 text-white font-semibold text-sm rounded block text-center sm:inline-block"
                >
                  Spam
                </button>
              )}
            </div>
          </header>
          <div className="px-px md:px-3">
            <ul className="flex md:hidden justify-around space-x-8 border-t text-center p-2 text-white leading-snug text-sm">
              <li className="hover:cursor-pointer">
                <span className="font-semibold text-gray-100 block">
                  {usersWithPosts.length}
                </span>{" "}
                posts
              </li>
              <li className="hover:cursor-pointer">
                <span className="font-semibold text-gray-100 block">
                  {bookingConfirmData}
                </span>{" "}
                Booked
              </li>
            </ul>
            <ul className="flex items-center justify-around md:justify-center space-x-12 uppercase tracking-widest font-semibold text-xs text-gray-600 border-t">
              <li className=" md:-mt-px md:text-gray-700">
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
                        <img
                          className="w-full h-full absolute left-0 top-0 object-cover"
                          src={post.image}
                          alt="image"
                        />
                        <div className="overlay bg-gray-800 bg-opacity-25 w-full h-full absolute left-0 top-0 hidden">
                          <div className="flex justify-center items-center space-x-4 h-full">
                            {/* <span className="p-2">
                              <i className="fas fa-heart"></i> {post.likes}
                            </span> */}
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
          category={otheruser?.category || ""}
          setSingle={setSingleBooking}
          setChanges={setChanges}
        />
      )}
      {isPostDetailModalOpen && selectedPost && (
        <PostDetailModal
          post={selectedPost}
          onClose={() => setIsPostDetailModalOpen(false)}
          setUsersWithPosts={setUsersWithPosts}
          setSelectedPost={setSelectedPost}
        />
      )}
      {isChatOpen && id && (
        <ChatComponent
          receiverId={otheruser?._id || ""}
          onClose={() => setIsChatOpen(false)}
          isOpen={isChatOpen}
          Fname={otheruser?.Fname || ""}
          Lname={otheruser?.Lname || ""}
          profile={otheruser?.profile || ""}
        />
      )}
      {isAllBookingsModalOpen && (
        <AllBookingsModal
          onClose={() => setIsAllBookingsModalOpen(false)}
          onViewBooking={handleViewBooking}
          artistId={id ?? ""}
          changes={changes}
        />
      )}

      {isBookingDetailModalOpen && selectedBooking && (
        <BookingDetailModal
          booking={selectedBooking}
          onClose={() => setIsBookingDetailModalOpen(false)}
          onCancel={handleCancelBooking}
          artist={otheruser}
          setChanges={setChanges}
          setSingle={setSingleBooking}
        />
      )}

      {isConfirmationModalOpen && (
        <ConfirmationModal
          message="Are you sure you want to cancel this booking?"
          onConfirm={bookingCancel}
          onCancel={() => setIsConfirmationModalOpen(false)}
        />
      )}
      {isSpamModalOpen && (
        <SpamModal
          onClose={() => setIsSpamModalOpen(false)}
          onConfirm={handleSpamConfirm}
          title="Confirm Spam"
          description="Are you sure you want to mark this user as spam?"
        />
      )}

      {isReasonModalOpen && (
        <SpamModal
          onClose={() => setIsReasonModalOpen(false)}
          onConfirm={handleSpamSubmit}
          title="Spam Reason"
          description="Please provide a reason for marking this user as spam."
        >
          <textarea
            value={spamReason}
            onChange={(e) => setSpamReason(e.target.value)}
            className="w-full p-2 mt-2"
            placeholder="Enter reason"
          />
        </SpamModal>
      )}

      {isUnspamModalOpen && (
        <SpamModal
          onClose={() => setIsUnspamModalOpen(false)}
          onConfirm={handleUnspamConfirm}
          title="Confirm Unspam"
          description="Are you sure you want to unmark this user as spam?"
        />
      )}
      {isReviewModalOpen && (
        <ReviewModal
          stars={userReview.stars}
          review={userReview.review}
          onClose={() => setIsReviewModalOpen(false)}
          onSubmit={handleReviewSubmit}
        />
      )}
      {isViewReviewsModalOpen && (
        <ViewReviewsModal
          reviews={reviews}
          onClose={() => setIsViewReviewsModalOpen(false)}
        />
      )}

      <Footer />
    </>
  );
};

export default SellerProfileClientside;
