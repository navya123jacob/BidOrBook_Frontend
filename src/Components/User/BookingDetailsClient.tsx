import React from "react";
import { Booking } from "../../types/booking";
import { User } from "../../types/user";
interface BookingDetailModalProps {
  booking: Booking;
  onClose: () => void;
  onCancel: () => void;
  artist: User | null;
}

const BookingDetailModal: React.FC<BookingDetailModalProps> = ({
  booking,
  onClose,
  onCancel,
  artist,
}) => {
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white bg-opacity-80 p-4 rounded-lg max-w-lg mx-auto text-gray-900 relative">
        <div className="modal-header flex justify-between bg-modal-header rounded-t-lg p-4">
          <h2 className="modal-title text-black">Booking Details</h2>
          <button className="modal-close" onClick={onClose}>
            <i className="fas fa-times text-black"></i>
          </button>
        </div>
        <div className="modal-body bg-modal-body">
          <table>
            <tbody>
              <tr>
                <td>Artist Name:</td>
                <td className="flex justify-between">
                  <span>
                    {artist?.Fname} {artist?.Lname}
                  </span>
                  <img
                    src={artist?.profile}
                    className="profile-image ml-2"
                    alt="Artist Profile"
                  />
                </td>
              </tr>
              <tr>
                <td>Client Name:</td>
                <td className="flex items-center">
                  {booking.clientId.Fname} {booking.clientId.Lname}
                  <img
                    src={booking.clientId.profile}
                    className="profile-image ml-2"
                    alt="Client Profile"
                  />
                </td>
              </tr>
              <tr>
                <td>Status:</td>
                <td colSpan={2}>
                  {booking.status === "pending"
                    ? "Booking Requested"
                    : booking.status === "marked"
                    ? "Marked Artist"
                    : booking.status === "confirmed"
                    ? "Booking Accepted"
                    : "Booked"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <button
          className="bg-red-900 hover:bg-red-700 text-white font-bold py-2 px-4 my-5 rounded cancel-button"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default BookingDetailModal;
