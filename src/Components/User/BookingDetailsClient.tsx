import React, { SetStateAction, Dispatch, useState } from "react";
import { Booking } from "../../types/booking";
import { User } from "../../types/user";
import { useSelector } from "react-redux";
import {
  useCreateCheckoutSessionMutation, useWalletMutation
} from "../../redux/slices/Api/EndPoints/bookingEndpoints";
import { useGetWalletValueQuery } from "../../redux/slices/Api/EndPoints/clientApiEndPoints";
import { RootState } from "../../redux/slices/Reducers/types";

interface BookingDetailModalProps {
  booking: Booking;
  onClose: () => void;
  onCancel: () => void;
  artist: User | null;
  setChanges: Dispatch<SetStateAction<number>>;
  setSingle: React.Dispatch<React.SetStateAction<Booking | null>>;
}

const BookingDetailModal: React.FC<BookingDetailModalProps> = ({
  booking,
  onClose,
  onCancel,
  artist,
  setChanges,
  setSingle
}) => {
  const [createCheckoutSession, { isLoading: isCreatingCheckoutSession }] = useCreateCheckoutSessionMutation();
  const [wallet, { isLoading: isWalletProcessing }] = useWalletMutation();
  const userInfo = useSelector((state: RootState) => state.client.userInfo);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [walletError, setWalletError] = useState<string | null>(null);
  const { data: walletData = { wallet: 0 },refetch } = useGetWalletValueQuery(userInfo.data.message._id);
  const handlePayClick = async () => {
    try {
      const response = await createCheckoutSession({
        bookingId: booking._id,
        amount: booking.amount,
        artistId: booking.artistId,
        clientId: booking.clientId,
      }).unwrap();

      if (response?.url) {
        const decodedUrl = decodeURIComponent(response.url);
        console.log(decodedUrl);
        window.location.href = decodedUrl;
      }
    } catch (error) {
      console.error("Error creating Stripe checkout session:", error);
    }
  };

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

  const handleWalletPayment = async () => {
    refetch()
    if (walletData.wallet < booking.amount) {
      
      setWalletError("Insufficient wallet balance.");
    } else {
      try {
        await wallet({
          bookingId: booking._id,
          amount: booking.amount,
          clientId: booking.clientId,
          
        }).unwrap();
        setChanges((prevChanges) => prevChanges + 1);
        setSingle((prevBooking) => 
          prevBooking ? { ...prevBooking, status: 'booked' } : null
        );
        setIsPaymentModalOpen(false);
        onClose();
      } catch (error) {
        console.error("Error processing wallet payment:", error);
        setWalletError("Failed to process wallet payment");
      }
    }
  };

  return (
    <>
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
                  <td>Date of Booking:</td>
                  <td>{formatBookingDates(booking.date_of_booking)}</td>
                </tr>
                <tr>
                  <td>Event:</td>
                  <td>{booking.event}</td>
                </tr>
                <tr>
                  <td>Location:</td>
                  <td>
                    {booking.location.district},{booking.location.state},
                    {booking.location.country}
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
                      : booking.status === "done"
                      ? "Booking Finished"
                      : "Booked"}
                  </td>
                </tr>
                {booking.amount !== 0 && (<>
                  <tr>
                    <td>Payment Amount:</td>
                    <td className="flex items-center">₹ {booking.amount}</td>
                  </tr>
                  <tr>
                    <td>Payment Method:</td>
                    <td className="flex items-center"> {booking.payment_method}</td>
                  </tr></>
                )}
              </tbody>
            </table>
          </div>
          {booking.status!='booked' && booking.status!='done' && <button
            className="bg-red-900 hover:bg-red-700 text-white font-bold py-2 px-4 my-5 rounded cancel-button"
            onClick={onCancel}
          >
            Cancel
          </button>}

          {booking.status === "confirmed" && (
            <button
              className="bg-teal-900 hover:bg-teal-700 m-5 text-white font-bold py-2 px-4 my-5 rounded cancel-button"
              onClick={() => setIsPaymentModalOpen(true)}
              disabled={isCreatingCheckoutSession}
            >
              {isCreatingCheckoutSession ? "Processing..." : "PAY"}
            </button>
          )}
        </div>
      </div>

      {isPaymentModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white bg-opacity-80 p-4 rounded-lg max-w-lg mx-auto text-gray-900 relative">
            <div className="modal-header flex justify-between bg-modal-header rounded-t-lg p-4">
              <h2 className="modal-title text-black">Select Payment Method</h2>
              <button
                className="modal-close"
                onClick={() => setIsPaymentModalOpen(false)}
              >
                <i className="fas fa-times text-black"></i>
              </button>
            </div>
            <div className="modal-body bg-modal-body">
              <button
                className="bg-blue-900 hover:bg-blue-700 m-5 text-white font-bold py-2 px-4 my-5 rounded"
                onClick={handlePayClick}
                disabled={isCreatingCheckoutSession}
              >
                {isCreatingCheckoutSession ? "Processing..." : "Pay with Stripe"}
              </button>
              <button
                className="bg-green-900 hover:bg-green-700 m-5 text-white font-bold py-2 px-4 my-5 rounded"
                onClick={handleWalletPayment}
                disabled={isWalletProcessing}
              >
                {isWalletProcessing ? "Processing..." : "Pay with Wallet"}
              </button>
              {walletError && <p className="text-red-500">{walletError}</p>}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BookingDetailModal;
