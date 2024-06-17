import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Footer from "../../../Components/User/Footer";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/slices/Reducers/types";
import { Navbar } from "../../../Components/User/Navbar";
import AuctionDetailModal from "../../../Components/ArtPho/AuctionDetail";
import AuctionModal from "../../../Components/ArtPho/AuctionModal";
import BiddingModal from "../../../Components/User/MakeBid";
import {
  useAllAuctionsMutation,
  useDeleteAuctionMutation,
} from "../../../redux/slices/Api/EndPoints/auctionEndPoints";
import { IAuction } from "../../../types/auction";
import { useParams, useSearchParams } from "react-router-dom";
import { useSingleUserMutation } from "../../../redux/slices/Api/EndPoints/clientApiEndPoints";
import { User } from "../../../types/user";
import ChatComponent from "../../../Components/ChatSingle";

const AuctionProfilePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const id = searchParams.get('id')?? undefined;
  const [allAuctions, { isLoading }] = useAllAuctionsMutation();
  const [deleteAuction] = useDeleteAuctionMutation();
  const userInfo = useSelector((state: RootState) => state.client.userInfo);
  const [isAuctionModalOpen, setIsAuctionModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [selectedAuction, setSelectedAuction] = useState<IAuction | null>(null);
  const [isAuctionDetailModalOpen, setIsAuctionDetailModalOpen] =
  useState(false);
  const [isBiddingModalOpen, setIsBiddingModalOpen] = useState(false);
  const [auctions, setAuctions] = useState<any[]>([]);
  const [bids, setBids] = useState<{ userId: string; amount: number }[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [SingleUser] = useSingleUserMutation();
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await SingleUser(id ?? "");
        if ("data" in response) {
          setUser(response.data.user);
        }
        console.log(response);
      } catch (error) {
        console.error("Error fetching auctions:", error);
      }
    };

    fetchData();
  }, []);

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

  const handleScroll = () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  return (
    <>
      <header className="bg-gray-950 bg-opacity-80">
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
              <button
                onClick={handleDMClick}
                className="bg-gray-900 mx-5 px-2 py-1 text-white font-semibold text-sm rounded block text-center sm:inline-block"
              >
                DM
              </button>
            )}
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
              ) : (
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
          bids={selectedAuction?.bids||[]}
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
      <Footer />
    </>
  );
};

export default AuctionProfilePage;
