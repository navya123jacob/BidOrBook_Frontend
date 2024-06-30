import React, { useState, useEffect } from 'react';
import { Booking } from '../types/booking';
import { IAuction } from '../types/auction';

interface WalletHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  walletBookings: Booking[];
  walletAuctions: IAuction[];
}

const WalletHistoryModal: React.FC<WalletHistoryModalProps> = ({
  isOpen,
  onClose,
  walletBookings,
  walletAuctions,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [bookingsPerPage] = useState(5);
  const [sortedBookings, setSortedBookings] = useState<Booking[]>([]);
  const [sortedAuctions, setSortedAuctions] = useState<IAuction[]>([]);
  const [selectedOption, setSelectedOption] = useState<'bookings' | 'auctions'>('bookings'); // Default to 'bookings'

  useEffect(() => {
    const sortedBookingsData = [...walletBookings].sort((a, b) => {
      const dateA = a.payment_date ? new Date(a.payment_date).getTime() : 0;
      const dateB = b.payment_date ? new Date(b.payment_date).getTime() : 0;
      return dateB - dateA;
    });
    setSortedBookings(sortedBookingsData);

    const sortedAuctionsData = [...walletAuctions].sort((a, b) => {
      const dateA = a.payment_date ? new Date(a.payment_date).getTime() : 0;
      const dateB = b.payment_date ? new Date(b.payment_date).getTime() : 0;
      return dateB - dateA;
    });
    setSortedAuctions(sortedAuctionsData);
  }, [walletBookings, walletAuctions]);

  if (!isOpen) return null;

  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = sortedBookings.slice(
    indexOfFirstBooking,
    indexOfLastBooking
  );

  const indexOfLastAuction = currentPage * bookingsPerPage;
  const indexOfFirstAuction = indexOfLastAuction - bookingsPerPage;
  const currentAuctions = sortedAuctions.slice(
    indexOfFirstAuction,
    indexOfLastAuction
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleOptionChange = (option: 'bookings' | 'auctions') => {
    setSelectedOption(option);
    setCurrentPage(1); // Reset pagination when changing options
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-3/4 max-w-lg p-6">
        <div className="flex justify-between">
          <h2 className="text-2xl font-semibold mb-4">Wallet History</h2>
          <button className="text-black top-0 right-0 p-2" onClick={onClose}>
            <i className="fa fa-close"></i>
          </button>
        </div>
        <div className="flex justify-center mb-4">
          <select
            value={selectedOption}
            onChange={(e) => handleOptionChange(e.target.value as 'bookings' | 'auctions')}
            className="px-4 py-2 border border-gray-300 rounded-md"
          >
            <option value="bookings">Bookings</option>
            <option value="auctions">Auctions</option>
          </select>
        </div>
        <div className="overflow-y-auto max-h-80">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2">Item</th>
                <th className="py-2">Amount</th>
                <th className="py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {selectedOption === 'bookings' &&
                currentBookings.map((booking, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2">
                      {booking.artistId?.Fname} {booking.artistId?.Lname}
                    </td>
                    <td className="py-2">₹{booking.amount}</td>
                    <td className="py-2">
                      {booking.payment_date
                        ? new Date(booking.payment_date).toLocaleDateString()
                        : 'N/A'}
                    </td>
                  </tr>
                ))}
              {selectedOption === 'bookings' && walletBookings.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-2 text-center">
                    None
                  </td>
                </tr>
              )}
              {selectedOption === 'auctions' &&
                currentAuctions.map((auction, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2">{auction.name}</td>
                    <td className="py-2">₹{auction.bids[auction.bids.length - 1].amount}</td>
                    <td className="py-2">
                      {auction.payment_date
                        ? new Date(auction.payment_date).toLocaleDateString()
                        : 'N/A'}
                    </td>
                  </tr>
                ))}
              {selectedOption === 'auctions' && walletAuctions.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-2 text-center">
                    None
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between mt-4">
          <button
            className="py-2 px-4 bg-gray-300 rounded"
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <button
            className="py-2 px-4 bg-gray-300 rounded"
            onClick={() => paginate(currentPage + 1)}
            disabled={
              (selectedOption === 'bookings' && indexOfLastBooking >= sortedBookings.length) ||
              (selectedOption === 'auctions' && indexOfLastAuction >= sortedAuctions.length)
            }
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default WalletHistoryModal;
