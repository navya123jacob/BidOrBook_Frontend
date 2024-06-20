import React, { useState, useEffect } from "react";
import { useGetAllAuctionsWithUserDetailsQuery } from "../../../redux/slices/Api/EndPoints/auctionEndPoints";
import { AdIAuction } from "../../../types/auction";
import ConfirmationModal from "../../User/CancelConfirmModal";
import ChatComponent from "../../ChatSingle";
const AuctionTable = () => {
  const { data: auctions = [], isLoading } = useGetAllAuctionsWithUserDetailsQuery({});
  const [auctionsData, setAuctionsData] = useState<AdIAuction[]>(auctions);
  const [selectedAuction, setSelectedAuction] = useState<AdIAuction | null>(null);
  const [isAuctionModalOpen, setIsAuctionModalOpen] = useState(false);
  const [isBidsModalOpen, setIsBidsModalOpen] = useState(false);

  useEffect(() => {
    setAuctionsData(auctions.auctions);
  }, [auctions]);

  const handleOpenAuctionModal = (auction: AdIAuction) => {
    setSelectedAuction(auction);
    setIsAuctionModalOpen(true);
  };

  const handleCloseAuctionModal = () => {
    setIsAuctionModalOpen(false);
    setSelectedAuction(null);
  };

  const handleOpenBidsModal = (auction: AdIAuction) => {
    setSelectedAuction(auction);
    setIsBidsModalOpen(true);
  };

  const handleCloseBidsModal = () => {
    setIsBidsModalOpen(false);
    setSelectedAuction(null);
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }
  if (!Array.isArray(auctionsData)) {
    return <div>Data is not an array</div>;
  }

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                Auction Name
              </th>
              <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white">
                Owner Name
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                Bids
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {auctionsData && auctionsData.map((auction: AdIAuction, key: number) => (
              <tr key={key}>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <button
                    className="dark:bg-graydark dark:text-white bg-meta-2 text-black rounded p-2"
                    onClick={() => handleOpenAuctionModal(auction)}
                  >
                    {auction.name}
                  </button>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <h5 className="font-medium text-black dark:text-white">
                    {auction.userId.Fname} {auction.userId.Lname}
                  </h5>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <button
                    className="dark:bg-graydark dark:text-white bg-meta-2 text-black rounded p-2"
                    onClick={() => handleOpenBidsModal(auction)}
                  >
                    {auction.bids.length} Bids
                  </button>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <div className="flex items-center space-x-3.5">
                    {/* Actions if any */}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isAuctionModalOpen && selectedAuction && (
        <div className="fixed inset-0 flex items-center justify-center z-40">
          <div
            className="fixed inset-0 bg-black opacity-50"
            onClick={handleCloseAuctionModal}
          ></div>
          <div className="bg-white rounded-lg p-6 z-10">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{selectedAuction.name}</h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={handleCloseAuctionModal}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>
            <p className="text-gray-700">{selectedAuction.description}</p>
            {/* Additional auction details if needed */}
          </div>
        </div>
      )}

      {isBidsModalOpen && selectedAuction && (
        <div className="fixed inset-0 flex items-center justify-center z-40">
          <div
            className="fixed inset-0 bg-black opacity-50"
            onClick={handleCloseBidsModal}
          ></div>
          <div className="bg-white rounded-lg p-6 z-10">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Bids</h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={handleCloseBidsModal}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>
            <ul>
              {selectedAuction.bids.map((bid, index) => (
                <li key={index} className="mb-2">
                  <p className="text-gray-700">
                    <strong>
                      {bid.userId.Fname} {bid.userId.Lname}:
                    </strong>{" "}
                    {bid.amount}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuctionTable;
