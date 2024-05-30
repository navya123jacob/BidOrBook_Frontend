import React from 'react';
import { Booking } from '../../../types/booking';

interface BookingRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: Booking[] | null;
}

const formatDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('en-GB');
};

const BookingRequestModal: React.FC<BookingRequestModalProps> = ({ isOpen, onClose, bookings }) => {
  if (!isOpen || !bookings) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-md w-11/12 md:w-3/4 lg:w-2/3 overflow-y-auto max-h-full bg-opacity-90">
        <button
          onClick={onClose}
          style={{ color: 'black' }}
          className="mb-4"
        >
          <i className="fa fa-arrow-left" aria-hidden="true"></i>
            </button>
        <h2 className="text-xl text-black font-semibold mb-4">Booking Request Details</h2>
       
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold w-1/3 text-black">Name</h3>
          <h3 className="text-lg font-semibold w-1/3 text-black">Dates</h3>
          <h3 className="text-lg font-semibold w-1/3 text-black">Action</h3>
        </div>
        {bookings.map((booking, index) => (
          <div key={index} className="flex justify-between items-center mb-4 text-black">
            <div className="w-1/4">
              <p>{booking.clientId.Fname} {booking.clientId.Lname}</p>
            </div>
            <div className="w-1/3">
              <p>
                {formatDate(booking.date_of_booking[0])}
                {booking.date_of_booking.length > 1 && ` to ${formatDate(booking.date_of_booking[booking.date_of_booking.length - 1])}`}
              </p>
            </div>
            <div className="flex w-1/3 ">
              <button className="bg-gray-700 text-white px-4 py-2 rounded mr-2" onClick={() => console.log('DM button clicked')}>
                DM
              </button>
              <button className=" text-white px-4 py-2 rounded bg-red-700" onClick={() => console.log('Cancel button clicked')}>
                Cancel
              </button>
            </div>
          </div>
        ))}
        <button className="absolute top-2 right-2 text-gray-500" onClick={onClose}>X</button>
      </div>
    </div>
  );
};

export default BookingRequestModal;
