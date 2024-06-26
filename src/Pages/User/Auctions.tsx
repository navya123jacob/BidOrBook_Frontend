import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/slices/Reducers/types";
import { Link } from "react-router-dom";
import {
  useAllAuctionsMutation,
  useDeleteAuctionMutation,
} from "../../redux/slices/Api/EndPoints/auctionEndPoints";
import { Navbar } from "../../Components/User/Navbar";
import AuctionDetailModal from "../../Components/ArtPho/AuctionDetail";
import BiddingModal from "../../Components/User/MakeBid";
import { IAuction } from "../../types/auction";

const Auctions: React.FC = () => {
  const [allAuctions, { isLoading }] = useAllAuctionsMutation();
  const [deleteAuction] = useDeleteAuctionMutation();
  const userInfo = useSelector((state: RootState) => state.client.userInfo);
  const [auctions, setAuctions] = useState<any[]>([]);
  const [selectedAuction, setSelectedAuction] = useState<IAuction | null>(null);
  const [isAuctionDetailModalOpen, setIsAuctionDetailModalOpen] =
    useState(false);
  const [isBiddingModalOpen, setIsBiddingModalOpen] = useState(false);
  const [bids, setBids] = useState<{ userId: string; amount: number }[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const ITEMS_PER_PAGE = 6;
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await allAuctions({
          userId: "1",
          notId: userInfo.data.message._id,
        });
        console.log(response);
        if ("data" in response) {
          setAuctions(response.data.auctions);
        }
      } catch (error) {
        console.error("Error fetching auctions:", error);
      }
    };

    fetchData();
  }, [allAuctions, userInfo.data.message._id, selectedAuction]);

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
  const filteredAuctions = auctions.filter((auction) => {
    const auctionEndDate = new Date(auction.endingdate);
    const matchesSearchTerm = auction.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase().trim());
    const matchesDateRange =
      (!startDate || auctionEndDate >= startDate) &&
      (!endDate || auctionEndDate <= endDate);
    return matchesSearchTerm && matchesDateRange;
  });

  const paginatedAuctions = filteredAuctions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(filteredAuctions.length / ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      <header className="bg-stone-900 bg-opacity-80">
        <Navbar />
      </header>
      <div className="bg-black transform translate-y-0 transition-transform duration-300 min-h-screen">
        <div className="container mx-auto py-12">
          <section className="w-full mb-4">
            <div className="w-full h-auto bg-transparent flex flex-col justify-between items-center">
              <div className="flex flex-col justify-center items-center mt-1">
                <Link
                  to="/"
                  className="focus:outline-none px-4 py-2 rounded-md text-gray-800"
                >
                  <img
                    width="48"
                    height="48"
                    src="https://img.icons8.com/pulsar-line/48/FFFFFF/circled-left-2.png"
                    alt="circled-left-2"
                  />
                </Link>
                <h1
                  className="text-white text-center xl:text-3xl lg:text-2xl md:text-xl sm:text-l xs:text-base bg-gray-900 p-2 bg-opacity-40 rounded-sm"
                  style={{ fontFamily: "cursive" }}
                >
                  Discover
                </h1>
              </div>
              <div className="w-full mx-auto mb-10">
                <div className="xl:w-1/3 lg:w-1/3 md:w-1/3 sm:w-1/2 xs:w-2/3 mx-auto flex gap-2">
                  <input
                    type="text"
                    className="border border-gray text-white w-full p-1 bg-transparent rounded-md text-base pl-2"
                    placeholder="Search for auctions by name"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                </div>
                <div className="xl:w-1/3 lg:w-1/3 md:w-1/3 sm:w-1/2 xs:w-2/3 mx-auto flex gap-2 mt-4">
                  <input
                    type="date"
                    className="border border-gray text-white w-full p-1 bg-transparent rounded-md text-base pl-2"
                    placeholder="Start Date"
                    onChange={(e) =>
                      setStartDate(
                        e.target.value ? new Date(e.target.value) : null
                      )
                    }
                  />
                  <input
                    type="date"
                    className="border border-gray text-white w-full p-1 bg-transparent rounded-md text-base pl-2"
                    placeholder="End Date"
                    onChange={(e) =>
                      setEndDate(
                        e.target.value ? new Date(e.target.value) : null
                      )
                    }
                  />
                </div>
              </div>
            </div>
          </section>

          <div className="flex flex-wrap -mx-px md:-mx-3">
            {isLoading ? (
              <span className="loader"></span>
            ) : paginatedAuctions.length === 0 ? (
              <div className="w-full text-center text-white py-8">
                No auctions
              </div>
            ) : (
              paginatedAuctions.map((auction: any, index: number) => (
                <div key={index} className="w-1/3 p-px md:px-3">
                  <a href="#" onClick={() => handleAuctionClick(auction)}>
                    <article className="post bg-gray-100 text-white relative pb-full md:mb-6">
                      <img
                        className="w-full h-full absolute left-0 top-0 object-cover"
                        src={auction.image}
                        alt="image"
                      />
                      <div className="overlay bg-gray-800 bg-opacity-25 w-full h-full absolute left-0 top-0 hidden">
                        <div className="flex justify-center items-center space-x-4 h-full"></div>
                      </div>
                    </article>
                  </a>
                </div>
              ))
            )}
          </div>
          <div className="flex justify-center mt-4">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={`${
                  currentPage === index + 1
                    ? "bg-graydark text-white"
                    : "bg-white text-graydark"
                } mx-1 px-3 py-1 rounded`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      {isAuctionDetailModalOpen && selectedAuction && (
        <AuctionDetailModal
          auction={selectedAuction}
          onClose={() => {
            setIsAuctionDetailModalOpen(false);
          }}
          onDelete={() => handleDeleteAuction(selectedAuction._id)}
          onOpenBiddingModal={() => setIsBiddingModalOpen(true)}
          SetselectedAuction={setSelectedAuction}
          profbut={true}
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
    </>
  );
};

export default Auctions;
