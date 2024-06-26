import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Footer from "../../../Components/User/Footer";
import {  useSelector } from "react-redux";
import { RootState } from "../../../redux/slices/Reducers/types";
import { Navbar } from "../../../Components/User/Navbar";
import AuctionDetailModal from "../../../Components/ArtPho/AuctionDetail";
import AuctionModal from "../../../Components/ArtPho/AuctionModal";
import BiddingModal from "../../../Components/User/MakeBid";
import ReviewModal from "../../../Components/ReviewModal";
import ViewReviewsModal from "../../../Components/ViewReviewsModal";
import ReactStars from "react-rating-stars-component";
import {
  useAllAuctionsMutation,
  useDeleteAuctionMutation,
} from "../../../redux/slices/Api/EndPoints/auctionEndPoints";
import { IAuction } from "../../../types/auction";
import { useSearchParams } from "react-router-dom";
import {
  useSingleUserMutation,
  useSpamUserMutation,
  useUnspamUserMutation,
  useAddReviewMutation,
  useGetUserReviewsQuery,
  useRemoveReviewMutation,
} from "../../../redux/slices/Api/EndPoints/clientApiEndPoints";
import { IReview, User } from "../../../types/user";
import ChatComponent from "../../../Components/ChatSingle";
import SpamModal from "../../../Components/User/SpamModal";

const AuctionProfilePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id") ?? undefined;
  const { data: reviewData, refetch } = useGetUserReviewsQuery(id ?? "");
  const [allAuctions, { isLoading }] = useAllAuctionsMutation();
  const [deleteAuction] = useDeleteAuctionMutation();
  const userInfo = useSelector((state: RootState) => state.client.userInfo);
  const [isAuctionModalOpen, setIsAuctionModalOpen] = useState(false);
  // const [page, setPage] = useState(1);
  const [selectedAuction, setSelectedAuction] = useState<IAuction | null>(null);
  const [isAuctionDetailModalOpen, setIsAuctionDetailModalOpen] =
    useState(false);
  const [isBiddingModalOpen, setIsBiddingModalOpen] = useState(false);
  const [auctions, setAuctions] = useState<any[]>([]);
  const [bids, setBids] = useState<{ userId: string; amount: number }[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [SingleUser] = useSingleUserMutation();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSpamModalOpen, setIsSpamModalOpen] = useState(false);
  const [isReasonModalOpen, setIsReasonModalOpen] = useState(false);
  const [isUnspamModalOpen, setIsUnspamModalOpen] = useState(false);
  const [spamReason, setSpamReason] = useState("");
  const [spamUser] = useSpamUserMutation();
  const [unspamUser] = useUnspamUserMutation();
  const [isViewReviewsModalOpen, setIsViewReviewsModalOpen] = useState(false);
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [userReview, setUserReview] = useState({ stars: 0, review: "" });
  const [addReview] = useAddReviewMutation();
  const [removeReview] = useRemoveReviewMutation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await SingleUser(id ?? "");
        if ("data" in response) {
          setUser(response.data.user);
        }
        console.log(response);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchData();
  }, [id, SingleUser]);

  useEffect(() => {
    if (reviewData?.receivedReviews) {
      setReviews(reviewData.receivedReviews);
      const existingReview = reviewData.receivedReviews.find(
        (review: any) => review.userId._id === userInfo.data.message._id
      );
      if (existingReview) {
        setUserReview({
          stars: existingReview.stars,
          review: existingReview.review,
        });
      }
    }
  }, [reviewData]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await allAuctions({ userId: id ?? "", notId: "" });

        if ("data" in response) {
          setAuctions(response.data.auctions);
        }
      } catch (error) {
        console.error("Error fetching auctions:", error);
      }
    };

    fetchData();
  }, [allAuctions, userInfo.data.message._id, selectedAuction]);

  // const handleScroll = () => {
  //   if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
  //     setPage((prevPage) => prevPage + 1);
  //   }
  // };

  // useEffect(() => {
  //   window.addEventListener("scroll", handleScroll);
  //   return () => window.removeEventListener("scroll", handleScroll);
  // }, []);

  const handleAuctionClick = (auction: any) => {
    setSelectedAuction(auction);
    setIsAuctionDetailModalOpen(true);
  };

  const handleDeleteAuction = async (auctionId: string) => {
    await deleteAuction({ auctionId, userId: userInfo.data.message._id });
    setAuctions((prevAuctions) =>
      prevAuctions.filter((auction) => auction._id !== auctionId)
    );
    setIsAuctionDetailModalOpen(false);
  };

  const handleBid = (amount: number) => {
    setBids([{ userId: userInfo.data.message._id, amount }, ...bids]);
    setIsBiddingModalOpen(false);
  };

  const handleDMClick = () => {
    setIsChatOpen(true);
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
      setUser((prevUser) => {
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
       await unspamUser({
        userId: userInfo.data.message._id,
        id,
      });

      setUser((prevUser) => {
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

      refetch();
      setIsReviewModalOpen(false);
    }
  };

  const handleRemoveReview = async () => {
    if (id) {
      await removeReview({
        reviewUserId: userInfo.data.message._id,
        id,
      });
      setUserReview({ stars: 0, review: "" });
      refetch();
    }
  };

  return (
    <>
      <header className="bg-stone-900 bg-opacity-80">
        <Navbar />
        <div className="relative h-40">
          <img
            src="/Auction.jpg"
            alt="Auction"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-white text-center py-4">
            <h1 className="text-4xl font-bold">AUCTION</h1>
          </div>
        </div>
      </header>
      <main className="bg-black text-white min-h-screen">
        <div className="lg:w-8/12 lg:mx-auto mb-8">
          <header className="flex flex-col items-center p-4 md:py-8">
            {!userInfo.client && (
              <div className="mb-4">
                <FontAwesomeIcon
                  icon={faPlus}
                  className="text-3xl text-white"
                  onClick={() => setIsAuctionModalOpen(true)}
                />
              </div>
            )}
            <div className="md:w-3/12 md:ml-16 mb-4">
              <img
                className="w-20 h-20 md:w-40 md:h-40 object-cover rounded-full p-1"
                src={user?.profile}
                alt="profile"
              />
            </div>
            <div className="text-center">
              <h2 className="text-3xl font-semibold mb-2">
                {user?.Fname} {user?.Lname}
              </h2>
            </div>
            {userInfo.client && (
              <>
                <div className="flex space-x-4">
                  <button
                    onClick={handleDMClick}
                    className="bg-graydark mx-5 px-2 py-1 text-white font-semibold text-sm rounded block text-center sm:inline-block"
                  >
                    DM
                  </button>
                  {user?.spam &&
                  user.spam.some(
                    (spam) => spam.userId === userInfo.data.message._id
                  ) ? (
                    <button
                      onClick={handleUnspamClick}
                      className="bg-red-600 mx-5 px-2 py-1 text-white font-semibold text-sm rounded block text-center sm:inline-block"
                    >
                      Unspam
                    </button>
                  ) : (
                    <button
                      onClick={handleSpamClick}
                      className="bg-red-600 mx-5 px-2 py-1 text-white font-semibold text-sm rounded block text-center sm:inline-block"
                    >
                      Spam
                    </button>
                  )}
                </div>
                <div className="flex "></div>
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
              </>
            )}
            <button
              onClick={() => setIsViewReviewsModalOpen(true)}
              className="bg-graydark m-5 px-2 py-1 text-white font-semibold text-sm rounded block text-center sm:inline-block"
            >
              View Reviews
            </button>
            <ul className="hidden md:flex space-x-8 mb-4">
              <li>
                <span className="font-semibold">{auctions.length}</span>{" "}
                {auctions.length > 1 ? "auctions" : "auction"}
              </li>
            </ul>
          </header>
          <div className="px-px md:px-3">
            <ul className="flex md:hidden justify-around space-x-8 border-t text-center p-2 text-white leading-snug text-sm">
              <li>
                <span className="font-semibold block text-white">
                  {auctions.length}
                </span>{" "}
                auctions
              </li>
            </ul>
            <ul className="flex items-center justify-around md:justify-center space-x-12 uppercase tracking-widest font-semibold text-xs text-gray-600 border-t">
              <li className="md:border-t md:border-gray-700 ">
                <a className="inline-block p-3" href="#"></a>
              </li>
            </ul>
            <div className="flex flex-wrap -mx-px md:-mx-3">
              {isLoading ? (
                <span className="loader"></span>
              ) : auctions.length > 0 ? (
                auctions.map((auction: any, index: number) => (
                  <div
                    key={index}
                    className={`w-1/3 p-px md:px-3 ${
                      auction.status === "inactive" ? "opacity-50" : ""
                    }`}
                  >
                    <a href="#" onClick={() => handleAuctionClick(auction)}>
                      <article className="post bg-gray-100 text-white relative pb-full md:mb-6">
                        <img
                          className="w-full h-full absolute left-0 top-0 object-cover"
                          src={auction.image}
                          alt="image"
                        />
                        {auction.status === "inactive" && (
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <span className="text-white font-bold text-lg">
                              Auction ended
                            </span>
                          </div>
                        )}
                        <div className="overlay bg-gray-800 bg-opacity-25 w-full h-full absolute left-0 top-0 hidden">
                          <div className="flex justify-center items-center space-x-4 h-full"></div>
                        </div>
                      </article>
                    </a>
                  </div>
                ))
              ) : (
                <div className="w-full text-center py-8">
                  <p className="text-gray-500">No Auctions</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {isAuctionModalOpen && (
        <AuctionModal
          onClose={() => setIsAuctionModalOpen(false)}
          setAuctions={setAuctions}
          auctions={auctions}
        />
      )}

      {isAuctionDetailModalOpen && selectedAuction && (
        <AuctionDetailModal
          auction={selectedAuction}
          onClose={() => setIsAuctionDetailModalOpen(false)}
          onDelete={() => handleDeleteAuction(selectedAuction._id)}
          onOpenBiddingModal={() => setIsBiddingModalOpen(true)}
          SetselectedAuction={setSelectedAuction}
        />
      )}

      {isBiddingModalOpen && (
        <BiddingModal
          initialBid={selectedAuction?.initial || 0}
          bids={selectedAuction?.bids || []}
          onClose={() => setIsBiddingModalOpen(false)}
          onBid={handleBid}
          auctionId={selectedAuction?._id || ""}
          SetselectedAuction={setSelectedAuction}
        />
      )}
      {isChatOpen && id && (
        <ChatComponent
          receiverId={user?._id || ""}
          onClose={() => setIsChatOpen(false)}
          isOpen={isChatOpen}
          Fname={user?.Fname || ""}
          Lname={user?.Lname || ""}
          profile={user?.profile || ""}
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

export default AuctionProfilePage;
