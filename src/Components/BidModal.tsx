import React from 'react';
import { IAuction } from '../types/auction';

interface BidsModalProps {
  auction: IAuction;
  onClose: () => void;
}

const BidsModal: React.FC<BidsModalProps> = ({ auction, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-smoke-light flex">
      <div className="relative p-8 bg-white w-full max-w-md m-auto flex-col flex rounded-lg bg-opacity-95">
        <span className="absolute top-0 right-0 p-4">
          <button onClick={onClose}>X</button>
        </span>
        <h2 className="text-2xl mb-4">Bids</h2>
        <div className="mt-4 bg-gray-200 p-4 rounded">
          {auction.bids && auction.bids.length === 0 ? (
            <p>No bids yet.</p>
          ) : (
            <ul>
              {auction.bids && [...auction.bids].sort((a, b) => b.amount - a.amount).map((bid: any, index: number) => (
                <li key={index}>
                  {bid.userId === auction.userId ? <strong>Your bid</strong> : `User ${bid.userId}`}: ${bid.amount}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default BidsModal;
