import React, { SetStateAction, Dispatch, useState } from "react";
import { Booking } from "../../../types/booking";
import ChatComponent from "../../ChatSingle";
import BookingFormModal from "../BookinFormModal";
import ConfirmationModal from "../../User/CancelConfirmModal";
import { useCancelPaymentReqMutation } from "../../../redux/slices/Api/EndPoints/bookingEndpoints";
import { useSpamUserMutation, useUnspamUserMutation } from "../../../redux/slices/Api/EndPoints/clientApiEndPoints";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/slices/Reducers/types";
import SpamModal from "../../User/SpamModal";

interface BookingRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: Booking[] | null;
  onCancel: (bookingId: string) => void;
  setChanges: Dispatch<SetStateAction<number>>;
  message: string;
  mark: boolean;
  selectedBooking: Booking | null;
  setSelectedBooking: Dispatch<SetStateAction<Booking | null>>;
}

// const formatDate = (date: string | Date): string => {
//   const dateObj = typeof date === "string" ? new Date(date) : date;
//   return dateObj.toLocaleDateString("en-GB");
// };

const formatBookingDates = (dates: Date[]): string => {
  if (!dates || dates.length === 0) return "";

  const formattedDates = dates
    .map((date) => new Date(date))
    .sort((a, b) => a.getTime() - b.getTime());

  let dateRanges = [];
  let currentRange: Date[] = [];

  formattedDates.forEach((date, index) => {
    const previousDate = formattedDates[index - 1];
    if (
      previousDate &&
      (date.getTime() - previousDate.getTime()) / (1000 * 60 * 60 * 24) === 1
    ) {
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
        }/${range[0].getFullYear()} to ${range[range.length - 1].getDate()}/${
          range[range.length - 1].getMonth() + 1
        }/${range[range.length - 1].getFullYear()}`;
      } else {
        return `${range[0].getDate()}/${
          range[0].getMonth() + 1
        }/${range[0].getFullYear()}`;
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
  setSelectedBooking,
}) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isBookingFormModalOpen, setIsBookingFormModalOpen] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [cancelPaymentReq] = useCancelPaymentReqMutation();
  const [isSpamModalOpen, setIsSpamModalOpen] = useState(false);
  const [isReasonModalOpen, setIsReasonModalOpen] = useState(false);
  const [isUnspamModalOpen, setIsUnspamModalOpen] = useState(false);
  const userInfo = useSelector((state: RootState) => state.client.userInfo);
  const [spamReason, setSpamReason] = useState("");
  const [spamUser] = useSpamUserMutation();
  const [unspamUser] = useUnspamUserMutation();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

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
        await cancelPaymentReq({ _id: selectedBooking._id });
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
  
  const handleSpamClick = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsSpamModalOpen(true);
  };

  const handleSpamConfirm = () => {
    setIsSpamModalOpen(false);
    setIsReasonModalOpen(true);
  };

  const handleSpamSubmit = async () => {
    if (selectedBooking) {
      await spamUser({ userId: userInfo.data.message._id, id: selectedBooking.clientId._id, reason: spamReason });
      setChanges((prevChanges) => prevChanges + 1);
      setIsReasonModalOpen(false);
      setSpamReason("");
    }
  };

  const handleUnspamClick = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsUnspamModalOpen(true);
  };

  const handleUnspamConfirm = async () => {
    if (selectedBooking) {
       await unspamUser({ userId: userInfo.data.message._id, id: selectedBooking.clientId._id });
      setChanges((prevChanges) => prevChanges + 1);
      setIsUnspamModalOpen(false);
    }
  };

  const normalizeSearchTerm = searchTerm.trim().toLowerCase().replace(/\s+/g, ' ');
  const searchTermParts = normalizeSearchTerm.split(' ');
  
  const filteredBookings = bookings?.filter((booking) => {
    const fullName = `${booking.clientId.Fname} ${booking.clientId.Lname}`.toLowerCase().replace(/\s+/g, ' ');
    
    let isMatch = true;
    let lastIndex = 0;
    
    searchTermParts.forEach(part => {
      const index = fullName.indexOf(part, lastIndex);
      if (index === -1) {
        isMatch = false;
      } else {
        lastIndex = index + part.length;
      }
    });
  
    return isMatch;
  });



  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBookings = filteredBookings?.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil((filteredBookings?.length || 0) / itemsPerPage);

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
            <input
              type="text"
              placeholder="Search by name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-4 p-2 w-full border border-gray-300 rounded"
            />
            {currentBookings && currentBookings.length === 0 ? (
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
                  {currentBookings &&
                    currentBookings.map((booking, index) => (
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
                            className="bg-graydark text-white px-4 py-2 rounded mr-2"
                            onClick={() => handleDMClick(booking)}
                          >
                            DM
                          </button>
                          <button
                            className="text-white px-4 py-2 rounded bg-red-700 mr-2"
                            onClick={() => {
                              setSelectedBooking(booking);
                              onCancel(booking._id);
                            }}
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
                          {booking?.clientId.spam &&
                          booking.clientId.spam.some(
                            (spam) => spam.userId === userInfo.data.message._id
                          ) ? (
                            <button
                            onClick={() =>handleUnspamClick( booking)}
                              className="text-white px-4 py-2 rounded bg-red-700 m-2"
                            >
                              Unspam
                            </button>
                          ) : (
                            <button
                            onClick={() =>handleSpamClick( booking)}
                              className="text-white px-4 py-2 rounded bg-red-700 m-2"
                            >
                              Spam
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            )}
            {totalPages >= 1 && (
              <div className="flex justify-center mt-4">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`mx-1 px-3 py-1 border ${currentPage === pageNumber ? "bg-blue-500 text-white" : "bg-white text-black"}`}
                  >
                    {pageNumber}
                  </button>
                ))}
              </div>
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
       {isSpamModalOpen && (
        <SpamModal
          onClose={() => setIsSpamModalOpen(false)}
          onConfirm={handleSpamConfirm}
          title="Confirm Spam"
          description="Are you sure you want to mark this user as spam?"
        />
      )}

      {isReasonModalOpen && (
        <SpamModal
          onClose={() => setIsReasonModalOpen(false)}
          onConfirm={handleSpamSubmit}
          title="Spam Reason"
          description="Please provide a reason for marking this user as spam."
        >
          <textarea
            value={spamReason}
            onChange={(e) => setSpamReason(e.target.value)}
            className="w-full p-2 mt-2"
            placeholder="Enter reason"
          />
        </SpamModal>
      )}

      {isUnspamModalOpen && (
        <SpamModal
          onClose={() => setIsUnspamModalOpen(false)}
          onConfirm={handleUnspamConfirm}
          title="Confirm Unspam"
          description="Are you sure you want to unmark this user as spam?"
        />
      )}
    </>
  ) : null;
};

export default BookingRequestModal;
