import React, { useState, useEffect, SetStateAction, Dispatch } from 'react';
import {
  differenceInMonths,
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds
} from 'date-fns';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/slices/Reducers/types';
import { useDeleteAuctionMutation, useCancelBidMutation } from '../../redux/slices/Api/EndPoints/auctionEndPoints';
import ConfirmationModal from '../User/CancelConfirmModal';
import { IAuction } from '../../types/auction';
import BidsModal from '../BidModal';
import { io } from 'socket.io-client';
interface AuctionDetailModalProps {
  auction: IAuction;
  onClose: () => void;
  onDelete: () => void;
  onOpenBiddingModal: () => void;
  SetselectedAuction: Dispatch<SetStateAction<IAuction | null>>;
}

const AuctionDetailModal: React.FC<AuctionDetailModalProps> = ({ auction, onClose, onDelete, onOpenBiddingModal, SetselectedAuction }) => {
  const [timeLeft, setTimeLeft] = useState('');
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showBidsModal, setShowBidsModal] = useState(false);
  const [error, setError] = useState('');
  const [deleteAuction, { isLoading: isDeleting }] = useDeleteAuctionMutation();
  const userInfo = useSelector((state: RootState) => state.client.userInfo);
  const [cancelBid, setCancelBid] = useState(false);
  const [cancelBidfn] = useCancelBidMutation();
  const socket = io('http://localhost:8888');

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

    socket.on('new_bid', (data) => {
      console.log('New bid received:', data); 
      SetselectedAuction((prevAuction) => {
        if (prevAuction) {
          const updatedBids = [...prevAuction.bids, { userId: data.userId, amount: data.amount }];
          updatedBids.sort((a, b) => b.amount - a.amount);
          return {
            ...prevAuction,
            bids: updatedBids
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

  const handleConfirmCancelBid = async () => {
    try {
      const response: any = await cancelBidfn({ auctionId: auction._id, userId: userInfo.data.message._id }).unwrap();
      SetselectedAuction(response);
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

  const handleBidding = () => {
    onOpenBiddingModal();
  };

  const handleShowBids = () => {
    setShowBidsModal(true);
  };

  const handleCloseBids = () => {
    setShowBidsModal(false);
  };

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
        <BidsModal auction={auction} onClose={handleCloseBids} />
      )}
      <div className="fixed inset-0 z-40 overflow-auto bg-smoke-light flex">
        <div className="relative p-8 bg-white w-full max-w-md m-auto flex-col flex rounded-lg bg-opacity-95">
          <span className="absolute top-0 right-0 p-4">
            <button onClick={onClose}><i className="fa fa-close"></i></button>
          </span>
          <div>
            <h2 className="text-2xl mb-4">{auction.name}</h2>
            <img src={auction.image} alt={auction.name} className="w-full mb-4" />
            <p>{auction.description}</p>
            <p className="mt-4">Initial Bid: ${auction.initial}</p>
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
                  {userBid ? (
                    <button
                      onClick={confirmCancelBid}
                      className={`bg-${isLeading ? 'green' : 'yellow'}-500 text-white px-4 py-2 rounded`}
                    >
                      {isLeading ? 'Leading' : 'Behind'}
                    </button>
                  ) : (
                    <button onClick={handleBidding} className="bg-blue-500 text-white px-4 py-2 rounded">
                      Bid
                    </button>
                  )}
                </>
              )}
            </div>
            <div className="mt-4">
              <button onClick={handleShowBids} className="bg-gray-500 text-white px-4 py-2 rounded">
                Show Bids
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuctionDetailModal;
