import React, { useState, FormEvent, Dispatch, SetStateAction, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/slices/Reducers/types';
import { usePlacebidMutation } from '../../redux/slices/Api/EndPoints/auctionEndPoints';
import { IAuction } from '../../types/auction';
import { io } from 'socket.io-client';

interface BiddingModalProps {
  initialBid: number;
  bids: { userId: string; amount: number }[];
  onClose: () => void;
  onBid: (amount: number) => void;
  auctionId: string;
  SetselectedAuction: Dispatch<SetStateAction<IAuction | null>>;
}

const BiddingModal: React.FC<BiddingModalProps> = ({ initialBid, bids, onClose, onBid, auctionId, SetselectedAuction }) => {
  const [bidAmount, setBidAmount] = useState<number>(bids.length > 0 ? bids[bids.length - 1].amount + 1 : initialBid + 1);
  const [error, setError] = useState<string>('');
  const userInfo = useSelector((state: RootState) => state.client.userInfo);
  const [placeBid, { isLoading }] = usePlacebidMutation();
  const socket = io('http://localhost:8888');

  useEffect(() => {
    socket.connect();
    socket.emit('join_auction', { auctionId });
    socket.on('new_bid', (data) => {
      console.log('New bid received:', data);
      SetselectedAuction((prevAuction) => {
        if (prevAuction) {
          const updatedBids = [...prevAuction.bids, { userId: data.userId, amount: data.amount }];
          updatedBids.sort((a, b) => b.amount - a.amount);
          setBidAmount(updatedBids[0].amount + 1); // Update the bid amount based on the new highest bid
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
    };
  }, [auctionId, SetselectedAuction]);

  const handleBidSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const highestBid = bids.length > 0 ? bids[bids.length - 1].amount : initialBid;

    if (bidAmount > highestBid) {
      try {
        const response = await placeBid({ auctionId, userId: userInfo.data.message._id, amount: bidAmount }).unwrap();
        if ('auction' in response) {
          SetselectedAuction(response.auction);
          onBid(bidAmount);
          setBidAmount(response.auction.bids[0].amount + 1);
          setError('');
          onClose();
        }
      } catch (error) {
        setError('Failed to place bid. Please try again.');
      }
    } else {
      setError('Bid amount must be greater than the current highest bid.');
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="relative bg-white text-gray-800 p-6 rounded-lg w-96">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-2 right-2 p-1 rounded-full"
        >
         <i className="fa fa-close"></i>
        </button>
        
        <h2 className="text-lg font-semibold mb-4">Place a Bid</h2>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <form onSubmit={handleBidSubmit}>
          <div className="mb-4">
            <label htmlFor="bid" className="block text-sm font-medium text-gray-700">Your Bid</label>
            <input
              type="number"
              id="bid"
              name="bid"
              value={bidAmount}
              min={bids.length > 0 ? bids[bids.length - 1].amount + 1 : initialBid + 1}
              onChange={(e) => setBidAmount(Number(e.target.value))}
              className="block w-full mt-1 p-2 border-gray-300 rounded-md"
            />
          </div>
          <button
            type="submit"
            className="block w-full px-5 py-3 text-white bg-blue-500 hover:bg-blue-600 transition duration-500 ease-in-out"
            disabled={isLoading}
          >
            {isLoading ? 'Placing Bid...' : 'Place Bid'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BiddingModal;
