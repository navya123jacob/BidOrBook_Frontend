import React, { useState, useEffect, SetStateAction, Dispatch } from 'react';
import { toast } from 'react-toastify';
import {
  differenceInMonths,
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
} from 'date-fns';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/slices/Reducers/types';
import { useDeleteAuctionMutation, useCancelBidMutation } from '../../redux/slices/Api/EndPoints/auctionEndPoints';
import ConfirmationModal from '../User/CancelConfirmModal';
import { IAuction } from '../../types/auction';
import BidsModal from '../BidModal';
import { io } from 'socket.io-client';
import { Link } from 'react-router-dom';
import {
  useCreateCheckoutSessionAuctionMutation
} from "../../redux/slices/Api/EndPoints/bookingEndpoints";
import { useWalletAuctionMutation } from '../../redux/slices/Api/EndPoints/auctionEndPoints';
import { useSpamAuctionMutation,useUnspamAuctionMutation } from '../../redux/slices/Api/EndPoints/auctionEndPoints';
import ReasonModal from '../User/ReasonModal';

interface AuctionDetailModalProps {
  auction: IAuction;
  onClose: () => void;
  onDelete: () => void;
  onOpenBiddingModal: () => void;
  SetselectedAuction: Dispatch<SetStateAction<IAuction | null>>;
  profbut?: boolean;
}

const AuctionDetailModal: React.FC<AuctionDetailModalProps> = ({
  auction,
  onClose,
  onDelete,
  onOpenBiddingModal,
  SetselectedAuction,
  profbut,
}) => {
  const [createCheckoutSession, { isLoading: isCreatingCheckoutSession }] = useCreateCheckoutSessionAuctionMutation();
  const [wallet, { isLoading: isWalletProcessing }] = useWalletAuctionMutation();
  const [timeLeft, setTimeLeft] = useState('');
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showBidsModal, setShowBidsModal] = useState(false);
  const [error, setError] = useState('');
  const [deleteAuction, { isLoading: isDeleting }] = useDeleteAuctionMutation();
  const userInfo = useSelector((state: RootState) => state.client.userInfo);
  const [cancelBid, setCancelBid] = useState(false);
  const [cancelBidfn] = useCancelBidMutation();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [walletError, setWalletError] = useState<string | null>(null);
  const [spamAuction] = useSpamAuctionMutation();
  const [unspamAuction] = useUnspamAuctionMutation();
  const [showSpamConfirm, setShowSpamConfirm] = useState(false);
  const [showUnspamConfirm, setShowUnspamConfirm] = useState(false);
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [reason, setReason] = useState<string>('');
  const [address, setAddress] = useState({
    addressline: '',
    district: '',
    state: '',
    country: '',
    pincode: '',
    phonenumber: '',
  });
  const [addressError, setAddressError] = useState<string | null>(null);
  // const socket = io("http://localhost:8888");
// const official=import.meta.env.official
const socket = io(import.meta.env.VITE_OFFICIAL);

  const handlePayClick = async () => {
    if (!validateAddress()) return;

    try {
      if (auction.bids.length < 1) {
        return;
      }
      const response = await createCheckoutSession({
        auctionId: auction._id,
        amount: auction?.bids[auction.bids.length - 1].amount,
        artistId: auction.userId,
        clientId: userInfo.data.message._id,
        address,
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

  const handleWalletPayment = async () => {
    if (!validateAddress()) return;

    if (userInfo.data.message.wallet < auction?.bids[auction.bids.length - 1].amount) {
      setWalletError("Insufficient wallet balance.");
    } else {
      try {
        const response = await wallet({
          auctionId: auction._id,
          amount: auction?.bids[auction.bids.length - 1].amount,
          clientId: userInfo.data.message._id,
          address,
        }).unwrap();
        toast.success("Payment successful!");
        
        SetselectedAuction(response.updatedAuction);
        setIsPaymentModalOpen(false);
        onClose();
      } catch (error) {
        console.error("Error processing wallet payment:", error);
        setWalletError("Failed to process wallet payment");
      }
    }
  };

  const validateAddress = () => {
    const { addressline, district, state, country, pincode, phonenumber } = address;
    const pincodeRegex = /^\d{6}$/;
    const phoneRegex = /^[1-9]\d{9}$/;

    if (!addressline.trim() || !district.trim() || !state.trim() || !country.trim()) {
      setAddressError("All address fields are required and must not be empty.");
      return false;
    }
    if (!pincodeRegex.test(pincode)) {
      setAddressError("Pincode must be a 6-digit number.");
      return false;
    }
    if (!phoneRegex.test(phonenumber)) {
      setAddressError("Phone number must be a 10-digit number");
      return false;
    }

    setAddressError(null);
    return true;
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress(prevState => ({ ...prevState, [name]: value }));
  };

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const endDate = auction ? new Date(auction.endingdate) : new Date();
      const difference = endDate.getTime() - now.getTime();

      if (difference > 0) {
        const months = differenceInMonths(endDate, now);
        const days = differenceInDays(endDate, now) % 30;
        const hours = differenceInHours(endDate, now) % 24;
        const minutes = differenceInMinutes(endDate, now) % 60;
        const seconds = differenceInSeconds(endDate, now) % 60;

        setTimeLeft(`${months} months ${days} days ${hours} hours ${minutes} minutes ${seconds} seconds`);
      } else {
        setTimeLeft('Auction ended');
      }
    };

    const timer = setInterval(calculateTimeLeft, 1000);
    calculateTimeLeft();

    return () => clearInterval(timer);
  }, [auction]);

  useEffect(() => {
    socket.connect();
    socket.emit('join_auction', { auctionId: auction._id });

    socket.on('new_bid', (data:any) => {
      console.log('New bid received:', data);
      SetselectedAuction((prevAuction) => {
        if (prevAuction) {
          const updatedBids = [...(prevAuction.bids || []), { userId: data.userId, amount: data.amount }];
          updatedBids.sort((a, b) => b.amount - a.amount);
          return {
            ...prevAuction,
            bids: updatedBids,
          };
        }
        return prevAuction;
      });
    });

    socket.on('cancel_bid', (data:any) => {
      console.log('Bid cancelled:', data);
      SetselectedAuction((prevAuction) => {
        if (prevAuction) {
          const updatedBids = (prevAuction.bids || []).filter((bid) => bid.userId !== data.userId);
          return {
            ...prevAuction,
            bids: updatedBids,
          };
        }
        return prevAuction;
      });
    });

    return () => {
      socket.off('new_bid');
      socket.disconnect();
    };
  }, [auction._id, SetselectedAuction]);

  const handleDelete = async () => {
    try {
      await deleteAuction({ auctionId: auction._id, userId: userInfo.data.message._id }).unwrap();
      onDelete();
      onClose();
    } catch (error) {
      console.error('Error deleting auction:', error);
    }
  };

  const confirmDelete = () => {
    setShowConfirmationModal(true);
  };

  const cancelDelete = () => {
    setShowConfirmationModal(false);
  };

  const handleConfirmDelete = () => {
    handleDelete();
    setShowConfirmationModal(false);
  };

  const confirmCancelBid = () => {
    setCancelBid(true);
  };

  const cancelCancelBid = () => {
    setCancelBid(false);
  };
  const handleSpamClick = () => {
    setShowReasonModal(true);
  };
  const handleConfirmSpam = async () => {
    setShowSpamConfirm(false);
    try {
       await spamAuction({ userId: userInfo.data.message._id, auctionId: auction._id, reason }).unwrap();
      
        let spam=auction?.spam.concat({userId: userInfo.data.message._id,reason})||[]
        SetselectedAuction({...auction,spam})
      
    } catch (error) {
      console.error('Failed to mark post as spam:', error);
    }
  };
  const handleReasonSubmit = () => {
    
    setShowReasonModal(false);
    handleConfirmSpam();
  };
  const handleUnspamClick = () => {
    setShowUnspamConfirm(true);
  };
  const handleConfirmUnspam = async () => {
    setShowUnspamConfirm(false);
    if (!userInfo || !userInfo.data || !userInfo.data.message) return;
    try {
      let response=await unspamAuction({ userId: userInfo.data.message._id, auctionId: auction._id })
      if('data' in response && auction?.spam){
       let spam=auction.spam.filter((e)=>{return e.userId!=userInfo.data.message._id})
       SetselectedAuction({...auction,spam})
      }
      
    } catch (error) {
      console.error('Failed to unmark post as spam:', error);
    }
  };

  const handleConfirmCancelBid = async () => {
    try {
      const response: any = await cancelBidfn({ auctionId: auction._id, userId: userInfo.data.message._id }).unwrap();
      SetselectedAuction(response);
      socket.emit('cancel_bid', { auctionId: auction._id, userId: userInfo.data.message._id });
      setCancelBid(false);
    } catch (error) {
      console.error('Error cancelling bid:', error);
      setError('Failed to cancel bid. Please try again.');
    }
  };

  if (!auction) {
    return null;
  }

  const userBid = auction.bids ? auction.bids.find((bid: any) => bid.userId === userInfo.data.message._id) : null;
  const highestBid = auction.bids && auction.bids.length > 0 ? Math.max(...auction.bids.map((bid: any) => bid.amount)) : 0;
  const isLeading = userBid && userBid.amount >= highestBid;
  const isHighestBidder = auction.bids && auction.bids.length > 0 && auction.bids[auction.bids.length - 1].userId === userInfo.data.message._id;

  const handleBidding = () => {
    onOpenBiddingModal();
  };

  const handleShowBids = () => {
    setShowBidsModal(true);
  };

  const handleCloseBids = () => {
    setShowBidsModal(false);
  };
  const userHasSpammed = auction.spam?.some(s => s.userId === userInfo?.data?.message?._id);
  return (
    <>
      {showConfirmationModal && (
        <ConfirmationModal
          message="Are you sure you want to delete this auction?"
          onConfirm={handleConfirmDelete}
          onCancel={cancelDelete}
        />
      )}
      {cancelBid && (
        <ConfirmationModal
          message="Are you sure you want to cancel your bid?"
          onConfirm={handleConfirmCancelBid}
          onCancel={cancelCancelBid}
        />
      )}
      {showBidsModal && (
        <BidsModal auction={auction} onClose={handleCloseBids} SetselectedAuction={SetselectedAuction} />
      )}
      <div className="fixed inset-0 z-40 overflow-auto bg-smoke-light flex">
        <div className="relative p-8 bg-white w-full max-w-md m-auto flex-col flex rounded-lg bg-opacity-95">
          <span className="absolute top-0 right-0 p-4">
            <button onClick={onClose}>
              <i className="fa fa-close"></i>
            </button>
          </span>
          {profbut && (
            <Link to={`/artpho/auction?id=${auction.userId}`}>
              <button className=" text-white px-4 py-2 my-4 rounded  bg-form-strokedark">
                Go to Profile
              </button>
            </Link>
          )}
          {userInfo.client && (
            <>
              {!userHasSpammed ? (
                <button
                  className="bg-yellow-500 text-white px-4 py-1 my-4 rounded w-30"
                  onClick={handleSpamClick}
                >
                  Spam
                </button>
              ) : (
                <button
                  className="bg-green-500 text-white px-2 py-1 rounded w-30"
                  onClick={handleUnspamClick}
                >
                  Unspam
                </button>
              )}
            </>
          )}
          <div>
            <h2 className="text-2xl mb-4">{auction.name}</h2>
            <img src={auction.image} alt={auction.name} className="w-full mb-4" />
            <p>{auction.description}</p>
            <p className="mt-4">Initial Bid: ₹{auction.initial}</p>
            <p className="mt-4">Time Left: {timeLeft}</p>
            {error && <p className="text-red-500 mt-4">{error}</p>}
            <div className="mt-4">
              {userInfo.data.message._id === auction.userId ? (
                <button
                  onClick={confirmDelete}
                  className="bg-red-500 text-white px-4 py-2 rounded mr-2"
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              ) : (
                <>
                  {auction.status === 'inactive' ? (
                    isHighestBidder ? (
                      auction.payment=='pending'?(
                      <button className="bg-blue-500 text-white px-4 py-2 rounded"
                      onClick={() => setIsPaymentModalOpen(true)}
                     disabled={isCreatingCheckoutSession}>
                       {isCreatingCheckoutSession ? "Processing..." : "PAY NOW!"}
                      </button>): (
                      <button className=" text-white px-4 py-2 rounded  bg-green-700" disabled>
                        YOU WON!
                      </button>
                    )
                    ) : (
                      <button className="bg-graydark text-white px-4 py-2 rounded" disabled>
                        SORRY,FINISHED
                      </button>
                    )
                  ) : (
                    userBid ? (
                      <button
                        onClick={confirmCancelBid}
                        className={`bg-${isLeading ? 'green' : 'yellow'}-500 text-white px-4 py-2 rounded`}
                      >
                        {isLeading ? 'Leading' : 'Trailing'}
                      </button>
                    ) : (
                      <button onClick={handleBidding} className="bg-blue-500 text-white px-4 py-2 rounded">
                        Bid
                      </button>
                    )
                  )}
                </>
              )}
            </div>
            <div className="mt-4">
              <button onClick={handleShowBids} className="  text-white px-4 py-2 rounded bg-meta-4">
                Show Bids
              </button>
            </div>
          </div>
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
              <form>
                <div className="mb-4">
                  <label htmlFor="addressline" className="block text-sm font-medium text-gray-700">Address Line</label>
                  <input
                    type="text"
                    name="addressline"
                    id="addressline"
                    value={address.addressline}
                    onChange={handleAddressChange}
                    className="mt-1 p-2 border border-gray-300 rounded w-full"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="district" className="block text-sm font-medium text-gray-700">District</label>
                  <input
                    type="text"
                    name="district"
                    id="district"
                    value={address.district}
                    onChange={handleAddressChange}
                    className="mt-1 p-2 border border-gray-300 rounded w-full"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700">State</label>
                  <input
                    type="text"
                    name="state"
                    id="state"
                    value={address.state}
                    onChange={handleAddressChange}
                    className="mt-1 p-2 border border-gray-300 rounded w-full"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
                  <input
                    type="text"
                    name="country"
                    id="country"
                    value={address.country}
                    onChange={handleAddressChange}
                    className="mt-1 p-2 border border-gray-300 rounded w-full"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="pincode" className="block text-sm font-medium text-gray-700">Pincode</label>
                  <input
                    type="text"
                    name="pincode"
                    id="pincode"
                    value={address.pincode}
                    onChange={handleAddressChange}
                    className="mt-1 p-2 border border-gray-300 rounded w-full"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="phonenumber" className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <input
                    type="text"
                    name="phonenumber"
                    id="phonenumber"
                    value={address.phonenumber}
                    onChange={handleAddressChange}
                    className="mt-1 p-2 border border-gray-300 rounded w-full"
                  />
                </div>
                {addressError && <p className="text-red-500 mb-4">{addressError}</p>}
              </form>
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
      {showReasonModal && (
        <ReasonModal
          onSubmit={handleReasonSubmit}
          onCancel={() => setShowReasonModal(false)}
          setReason={setReason}
          reason={reason}
        />
      )}

      {showSpamConfirm && (
        <ConfirmationModal
          message="Are you sure you want to mark this post as spam?"
          onConfirm={handleConfirmSpam}
          onCancel={() => setShowSpamConfirm(false)}
        />
      )}

      {showUnspamConfirm && (
        <ConfirmationModal
          message="Are you sure you want to unmark this post as spam?"
          onConfirm={handleConfirmUnspam}
          onCancel={() => setShowUnspamConfirm(false)}
        />
      )}
    </>
  );
};

export default AuctionDetailModal;
