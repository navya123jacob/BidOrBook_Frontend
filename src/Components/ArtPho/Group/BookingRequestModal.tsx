import React, { SetStateAction, Dispatch, useState } from "react";
import { Booking } from "../../../types/booking";
import ChatComponent from "../../Chat";
import BookingFormModal from "../BookinFormModal";
import ConfirmationModal from "../../User/CancelConfirmModal";
import { useCancelPaymentReqMutation } from "../../../redux/slices/Api/EndPoints/bookingEndpoints";

interface BookingRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: Booking[] | null;
  onCancel: (bookingId: string) => void;
  setChanges: Dispatch<SetStateAction<number>>;
  message: string;
  mark: boolean;
  selectedBooking:Booking| null;
  setSelectedBooking:Dispatch<SetStateAction<Booking | null>>;
}

const formatDate = (date: string | Date): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleDateString("en-GB");
};

const formatBookingDates = (dates: Date[]): string => {
  if (!dates || dates.length === 0) return "";
  
  const formattedDates = dates
    .map(date => new Date(date))
    .sort((a, b) => a.getTime() - b.getTime());

  let dateRanges = [];
  let currentRange: Date[] = [];

  formattedDates.forEach((date, index) => {
    const previousDate = formattedDates[index - 1];
    if (previousDate && (date.getTime() - previousDate.getTime()) / (1000 * 60 * 60 * 24) === 1) {
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
    .map(range => {
      if (range.length > 1) {
        return `${range[0].getDate()}/${range[0].getMonth() + 1}/${range[0].getFullYear()} to ${range[range.length - 1].getDate()}/${range[range.length - 1].getMonth() + 1}/${range[range.length - 1].getFullYear()}`;
      } else {
        return `${range[0].getDate()}/${range[0].getMonth() + 1}/${range[0].getFullYear()}`;
      }
    })
    .join(", ");
};

const BookingRequestModal: React.FC<BookingRequestModalProps> = ({
  isOpen,
  onClose,
  bookings,
  onCancel,
  setChanges,
  message,
  mark,
  selectedBooking,
  setSelectedBooking
}) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isBookingFormModalOpen, setIsBookingFormModalOpen] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [cancelPaymentReq] = useCancelPaymentReqMutation();

  const handleDMClick = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsChatOpen(true);
  };

  const handleProceedClick = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsBookingFormModalOpen(true);
  };

  const handlePayment = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowConfirmationModal(true);
  };

  const handleConfirmation = async () => {
    if (selectedBooking) {
      try {
        const result = await cancelPaymentReq({ _id: selectedBooking._id });
        setChanges((prevChanges) => prevChanges + 1);
      } catch (error) {
        console.error("Error cancelling payment request: ", error);
      } finally {
        setShowConfirmationModal(false);
      }
    }
  };

  const handleCancelConfirmation = () => {
    setShowConfirmationModal(false);
  };

  return isOpen ? (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-40">
        <div className="bg-white bg-opacity-80 p-4 rounded-lg max-w-4xl mx-auto text-gray-900 relative">
          <div className="modal-header flex justify-between bg-modal-header rounded-t-lg p-4">
            <h2 className="modal-title text-black">{message} Details</h2>
            <button className="modal-close" onClick={onClose}>
              <i className="fas fa-times text-black"></i>
            </button>
          </div>
          <div className="modal-body bg-modal-body">
            {bookings && bookings.length === 0 ? (
              <div className="text-center text-black font-semibold">
                No {message}
              </div>
            ) : (
              <table className="w-full border-collapse border border-gray-200">
                <thead>
                  <tr className="text-left border-b border-gray-200">
                    <th className="text-lg font-semibold px-2 py-4 border-r w-1/4">
                      Name
                    </th>
                    <th className="text-lg font-semibold px-2 py-4 border-r w-1/4">
                      Location
                    </th>
                    <th className="text-lg font-semibold px-2 py-4 border-r w-1/6">
                      Dates
                    </th>
                    <th className="text-lg font-semibold px-2 py-4 border-r w-1/6">
                      Event
                    </th>
                    <th className="text-lg font-semibold px-2 py-4 w-1/3">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {bookings &&
                    bookings.map((booking, index) => (
                      <tr key={index} className="border-b border-gray-200">
                        <td className="flex-col items-center px-2 py-4 border-r">
                          {booking.clientId.Fname} {booking.clientId.Lname}
                          <img
                            src={booking.clientId.profile}
                            className="profile-image ml-2"
                            alt="Client Profile"
                          />
                        </td>
                        <td className="px-2 py-4 border-r">
                          {`${booking.location.district}, ${booking.location.state}, ${booking.location.country}`}
                        </td>
                        <td className="px-2 py-4 border-r">
                          {formatBookingDates(booking.date_of_booking)}
                        </td>
                        <td className="px-2 py-4 border-r">{booking.event}</td>
                        <td className="px-2 py-4 flex justify-between items-center">
                          <button
                            className="bg-gray-700 text-white px-4 py-2 rounded mr-2"
                            onClick={() => handleDMClick(booking)}
                          >
                            DM
                          </button>
                          <button
                            className="text-white px-4 py-2 rounded bg-red-700 mr-2"
                            onClick={() => {setSelectedBooking(booking);onCancel(booking._id)}}
                          >
                            Cancel
                          </button>
                          {!mark &&
                            (booking.status !== "confirmed" ? (
                              <button
                                className="text-white px-4 py-2 rounded bg-green-600"
                                onClick={() => handleProceedClick(booking)}
                              >
                                Proceed
                              </button>
                            ) : (
                              <button
                                className="text-white px-4 py-2 rounded bg-green-600"
                                onClick={() => handlePayment(booking)}
                              >
                                Payment Requested
                              </button>
                            ))}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
      {isChatOpen && selectedBooking && (
        <ChatComponent
          receiverId={selectedBooking.clientId._id || ""}
          onClose={() => setIsChatOpen(false)}
          isOpen={isChatOpen}
          Fname={selectedBooking.clientId.Fname || ""}
          Lname={selectedBooking.clientId.Lname || ""}
          profile={selectedBooking.clientId.profile || ""}
        />
      )}
      {isBookingFormModalOpen && selectedBooking && (
        <BookingFormModal
          isOpen={isBookingFormModalOpen}
          onClose={() => setIsBookingFormModalOpen(false)}
          booking={selectedBooking}
          setChanges={setChanges}
        />
      )}
      {showConfirmationModal && (
        <ConfirmationModal
          message="Do you want to cancel the payment request?"
          onConfirm={handleConfirmation}
          onCancel={handleCancelConfirmation}
        />
      )}
    </>
  ) : null;
};

export default BookingRequestModal;
