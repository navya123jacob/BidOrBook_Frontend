import React, { Dispatch, SetStateAction, useState } from "react";
import { IAuction } from "../../types/auction";

interface AuctionListProps {
  auctions: IAuction[];
  onSelectAuction: (auction: IAuction) => void;
  setIsAuctionDetModalOpen: Dispatch<SetStateAction<boolean>>;
}

const AuctionList: React.FC<AuctionListProps> = ({ auctions, onSelectAuction, setIsAuctionDetModalOpen }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(auctions.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const startIdx = (currentPage - 1) * itemsPerPage;
  const currentAuctions = auctions.slice(startIdx, startIdx + itemsPerPage);

  return (
    <div className="bg-gray-200 flex flex-col items-center justify-center w-full lg:w-1/2 space-y-6 p-6 h-full">
      {auctions.length === 0 ? (
        <p className="text-gray-700 font-medium">None</p>
      ) : (
        <>
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b-2 border-gray-300 text-left">Image</th>
                <th className="py-2 px-4 border-b-2 border-gray-300 text-left">Name</th>
                <th className="py-2 px-4 border-b-2 border-gray-300 text-left">View</th>
              </tr>
            </thead>
            <tbody>
              {currentAuctions.map((auction) => (
                <tr key={auction._id}>
                  <td className="py-2 px-4 border-b border-gray-300">
                    <img src={auction.image} alt={auction.name} className="w-12 h-12 rounded-full object-cover" />
                  </td>
                  <td className="py-2 px-4 border-b border-gray-300">{auction.name}</td>
                  <td className="py-2 px-4 border-b border-gray-300">
                    <button
                      onClick={() => { onSelectAuction(auction); setIsAuctionDetModalOpen(true); }}
                      className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="bg-gray-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
            >
              Previous
            </button>
            <span className="text-gray-700 font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="bg-gray-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AuctionList;
