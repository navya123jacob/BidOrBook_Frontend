import React, { useState } from 'react';
import { User } from '../../../types/user';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/slices/Reducers/types';
import ChatComponent from '../../ChatSingle';

interface UserDetailsModalProps {
  user: User | null;
  onClose: () => void;
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({ user, onClose }) => {
  const adminInfo = useSelector((state: RootState) => state.adminAuth.adminInfo);
  const[chatModalOpen,setIsChatModalOpen]=useState(false)
  const handleDm=async()=>{
    setIsChatModalOpen(true)
  }
  if (!user) return null;

  return (
    <>
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white text-black p-4 rounded-lg shadow-lg w-96 bg-opacity-90">
        <h2 className="text-xl font-bold mb-4">{user.Fname} {user.Lname}</h2>
        <p>Email: {user.email}</p>
        <p>Phone: {user.phone}</p>
        <p>Category: {user.category}</p>
        <p>Description: {user.description}</p>
        <button onClick={onClose} className="mt-4 bg-red-700 text-white p-2 rounded">Close</button>
        <button className="mt-4 bg-graydark m-5 text-white p-2 rounded" onClick={handleDm}>DM</button>
      </div>
    </div>
    {chatModalOpen && (
        <ChatComponent
          isOpen={chatModalOpen}
          onClose={() => setIsChatModalOpen(false)}
          receiverId={user._id}
          Fname={user.Fname}
          Lname={user.Lname}
          profile={user.profile}
          admin={true}
        />
      )}
      
    </>
  );
};

export default UserDetailsModal;
