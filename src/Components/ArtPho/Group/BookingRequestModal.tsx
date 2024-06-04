import React from 'react';
import { Booking } from '../../../types/booking';
import ChatComponent from '../../Chat';

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
  <>
<div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
<div className="bg-white bg-opacity-80 p-4 rounded-lg max-w-lg mx-auto text-gray-900 relative">
  <div className="modal-header flex justify-between bg-modal-header rounded-t-lg p-4">
    <h2 className="modal-title text-black">Booking Request Details</h2>
    <button className="modal-close" onClick={onClose}>
      <i className="fas fa-times text-black"></i>
    </button>
  </div>
  <div className="modal-body bg-modal-body">
  {bookings.length === 0 ? (
      <div className="text-center text-black font-semibold">No Booking Requests</div>
    ) : (
    <table>
    <thead>
          <tr className="text-left border-b border-gray-200">
            <th className="text-lg font-semibold w-1/3 px-2 py-4">Name</th>
            <th className="text-lg font-semibold w-1/3 px-2 py-4">Dates</th>
            <th className="text-lg font-semibold w-1/3 px-2 py-4">Action</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking, index) => (
            <tr key={index} className="border-b border-gray-200">
               <td className="flex items-center">
                  {booking.clientId.Fname} {booking.clientId.Lname}
                  <img
                    src={booking.clientId.profile}
                    className="profile-image ml-2"
                    alt="Client Profile"
                  />
                </td>
              
              <td className="px-2 py-4">
                {formatDate(booking.date_of_booking[0])}
                {booking.date_of_booking.length > 1 && (
                  <>
                    {' '}
                    to {formatDate(booking.date_of_booking[booking.date_of_booking.length - 1])}
                  </>
                )}
              </td>
              <td className="px-2 py-4 flex justify-between">
                <button
                  className="bg-gray-700 text-white px-4 py-2 rounded mr-2"
                  onClick={() => console.log('DM button clicked')}
                >
                  DM
                </button>
                <button
                  className="text-white px-4 py-2 rounded bg-red-700"
                  onClick={() => console.log('Cancel button clicked')}
                >
                  Cancel
                </button>
              </td>
            </tr>
            
          ))}
        </tbody>
    </table>
     )}
  </div>
  
</div>
</div>

</>
  );
};

export default BookingRequestModal;

