import React, { Dispatch, SetStateAction, useState } from 'react';
import { Booking } from '../../types/booking';
import { Link } from 'react-router-dom';
import BookingDetailModal from './BookingDetailsClient';
import ConfirmationModal from './CancelConfirmModal';
import { useCancelbookingMutation } from '../../redux/slices/Api/EndPoints/bookingEndpoints';

interface Props {
    message: string;
    marked: Booking[];
    setChanges: Dispatch<SetStateAction<number>>;
}

const BookingViewModal: React.FC<Props> = ({ message, marked,setChanges }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const totalPages = Math.ceil(marked.length / itemsPerPage);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
const [cancelbooking]=useCancelbookingMutation()
const formatBookingDates = (dates: Date[]) => {
    if (!dates || dates.length === 0) return "";

    const formattedDates = dates
      .map((date) => new Date(date))
      .sort((a: any, b: any) => a - b);

    let dateRanges = [];
    let currentRange: Date[] = [];

    formattedDates.forEach((date: any, index: number) => {
      const previousDate: any = formattedDates[index - 1];
      if (previousDate && (date - previousDate) / (1000 * 60 * 60 * 24) === 1) {
        currentRange.push(date);
      } else {
        if (currentRange.length > 0) {
          dateRanges.push(currentRange);
        }
        currentRange = [date];
      }
    });

    if (currentRange.length > 0) {
      dateRanges.push(currentRange);
    }

    return dateRanges
      .map((range) => {
        if (range.length > 1) {
          return `${range[0].getDate()}/${
            range[0].getMonth() + 1
          }/${range[0].getFullYear()} to ${
            range[range.length - 1].getDate()
          }/${range[range.length - 1].getMonth() + 1}/${range[range.length - 1].getFullYear()}`;
        } else {
          return `${range[0].getDate()}/${
            range[0].getMonth() + 1
          }/${range[0].getFullYear()}`;
        }
      })
      .join(", ");
  };

const handleViewBooking = (booking: Booking) => {
    
    setSelectedBooking(booking);
    setIsBookingModalOpen(true);
};
const handleCloseBookingModal = () => {
    setSelectedBooking(null);
    setIsBookingModalOpen(false);
};
const handleCancelBooking = () => {
    setIsConfirmationModalOpen(true);
  };


const bookingCancel = async () => {
    if (selectedBooking) {
        const response = await cancelbooking({
            bookingId: selectedBooking._id,
            userId: selectedBooking.artistId._id, 
            clientId: selectedBooking.clientId._id, 
            amount: selectedBooking.amount,
            status: selectedBooking.status,
        });

        if ("data" in response) {
            setIsBookingModalOpen(false);
            setIsConfirmationModalOpen(false);
            setSelectedBooking(null);
            setChanges((prevChanges) => prevChanges + 1);
        }
    }
};



    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const startIdx = (currentPage - 1) * itemsPerPage;
    const currentBookings = marked.slice(startIdx, startIdx + itemsPerPage);

    const renderUserRow = (booking: any) => {
        const user = booking.artistId;

        return (
            <div key={user._id} className="flex items-center justify-between py-2 px-4 border-b">
                <div className="flex items-center">
                    <img
                        src={user.profile || 'src/assets/dummy_profile.jpg'}
                        alt={`${user.Fname} ${user.Lname}`}
                        className="w-10 h-10 rounded-full object-cover mr-4"
                    />
                    <span>{user.Fname} {user.Lname}</span>
                </div>
                <span>{formatBookingDates(booking.date_of_booking)}</span>
                <button
                    className="ml-4 bg-teal-900 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => handleViewBooking(booking)}
                >
                    View
                </button>
                <Link to={`/artprof/client?id=${user._id}`} className=" text-white px-3 py-1 rounded bg-graydark">Go to Profile</Link>
            </div>
        );
    };

    return (<>
        <div className="bg-gray-200 flex flex-col items-center justify-center w-full lg:w-1/2 space-y-6 p-6 h-full">
            <h2 className="text-2xl font-bold mb-4">{message}</h2>
            <div className="chats-list w-full space-y-4 overflow-y-auto h-80">
                {marked.length > 0 ? currentBookings.map(renderUserRow) : <p>No {message}</p>}
            </div>
            {marked.length > 0 && (
                <div className="flex justify-between items-center mt-4 w-full">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className=" bg-gray text-black px-4 py-2 rounded disabled:bg-gray-2"
                    >
                        Previous
                    </button>
                    <span className="text-gray-700 font-medium">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className=" text-black px-4 py-2 rounded disabled:bg-gray-2 bg-gray"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
        {isBookingModalOpen && selectedBooking && (
            <BookingDetailModal
                booking={selectedBooking}
                onClose={handleCloseBookingModal}
                onCancel={ handleCancelBooking}
                artist={selectedBooking.artistId}
                setChanges={setChanges}
                setSingle={setSelectedBooking}
            />
        )}
        {isConfirmationModalOpen && (
        <ConfirmationModal
          message="Are you sure you want to cancel this booking?"
          onConfirm={bookingCancel}
          onCancel={() => setIsConfirmationModalOpen(false)}
        />
      )}
        </>
        
    );
};

export default BookingViewModal;
