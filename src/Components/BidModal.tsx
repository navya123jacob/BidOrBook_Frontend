import React, { Dispatch, SetStateAction, useState } from 'react';
import { IAuction } from '../types/auction';
import { RootState } from '../redux/slices/Reducers/types';
import { useSelector } from 'react-redux';
import UserDetailsModal from './ArtPho/BidUserDetail';
import { useSingleUserMutation } from '../redux/slices/Api/EndPoints/clientApiEndPoints';


interface BidsModalProps {
  auction: IAuction;
  onClose: () => void;
  SetselectedAuction: Dispatch<SetStateAction<IAuction | null>>;
}

const BidsModal: React.FC<BidsModalProps> = ({ auction, onClose,SetselectedAuction }) => {
  const userInfo = useSelector((state: RootState) => state.client.userInfo);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [isUserDetailsModalOpen, setUserDetailsModalOpen] = useState<boolean>(false);
  const [fetchUser] = useSingleUserMutation();
  

  const handleViewClick = async (userId: string) => {
    setSelectedUser(userId);
   
      setUserDetailsModalOpen(true);
   
  };

  const handleCloseUserDetailsModal = () => {
    setSelectedUser('');
    setUserDetailsModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-smoke-light flex">
      <div className="relative p-8 bg-white w-full max-w-md m-auto flex-col flex rounded-lg bg-opacity-95">
        <span className="absolute top-0 right-0 p-4">
          <button onClick={onClose}><i className="fas fa-times text-black"></i></button>
        </span>
        <h2 className="text-2xl mb-4">Bids</h2>
        <div className="mt-4 bg-gray-200 p-4 rounded">
          {auction.bids && auction.bids.length === 0 ? (
            <p>No bids yet.</p>
          ) : (
            <ul>
              {auction.bids && [...auction.bids].sort((a, b) => b.amount - a.amount).map((bid: any, index: number) => (
                <li key={index} className="flex justify-between items-center">
                  {bid.userId === auction.userId ? <strong>Your bid</strong> : `User ${bid.userId}`}: ₹{bid.amount}
                  {!userInfo.client && (
                    <button onClick={() => handleViewClick(bid.userId)} className="bg-graydark m-2 text-white p-2 rounded">
                      View
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      {isUserDetailsModalOpen  && (
        <UserDetailsModal
          id={selectedUser}
          onClose={handleCloseUserDetailsModal}
          SetselectedAuction={SetselectedAuction}
        />
      )}
    </div>
  );
};

export default BidsModal;
