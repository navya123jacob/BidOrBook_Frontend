import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { User } from '../../types/user';
import { useSingleUserMutation, useSpamUserMutation, useUnspamUserMutation } from '../../redux/slices/Api/EndPoints/clientApiEndPoints';
import { IAuction } from '../../types/auction';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/slices/Reducers/types';
import SpamModal from '../User/SpamModal';
import ChatComponent from '../ChatSingle';

interface UserDetailsModalProps {
  id: string; 
  onClose: () => void;
  SetselectedAuction: Dispatch<SetStateAction<IAuction | null>>;
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({ id, onClose }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [fetchUser] = useSingleUserMutation();
  const [isSpamModalOpen, setIsSpamModalOpen] = useState(false);
  const [isReasonModalOpen, setIsReasonModalOpen] = useState(false);
  const [isUnspamModalOpen, setIsUnspamModalOpen] = useState(false);
  const [spamReason, setSpamReason] = useState("");
  const [spamUser] = useSpamUserMutation();
  const [unspamUser] = useUnspamUserMutation();
  const userInfo = useSelector((state: RootState) => state.client.userInfo);
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetchUser(id).unwrap();
        console.log(response)
        setUser(response.user);  
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserData();
  }, [id, fetchUser]);

  const handleDMClick = () => {
   setIsChatOpen(true)
  };

  const handleSpamClick = () => {
    setIsSpamModalOpen(true);
  };

  const handleSpamConfirm = () => {
    setIsSpamModalOpen(false);
    setIsReasonModalOpen(true);
  };

  const handleSpamSubmit = async () => {
    if (id) {
      await spamUser({ userId: userInfo.data.message._id ,id, reason: spamReason });
      setUser((prevUser) => {
        if (!prevUser) return null;
        return {
          ...prevUser,
          spam: [...(prevUser.spam || []), { userId: userInfo.data.message._id, reason: spamReason }],
        };
      });
      setIsReasonModalOpen(false);
      setSpamReason("");
    }
  };

  const handleUnspamClick = () => {
    setIsUnspamModalOpen(true);
  };

  const handleUnspamConfirm = async () => {
    if (id) {
      await unspamUser({ userId: userInfo.data.message._id,id });
      setUser((prevUser) => {
        if (!prevUser) return null;
        return {
          ...prevUser,
          spam: prevUser.spam?.filter((spam) => spam.userId !== userInfo.data.message._id) || [],
        };
      });
     
      setIsUnspamModalOpen(false);
    }
  };
  return (
   <>
    <div className="fixed inset-0 z-50 overflow-auto bg-smoke-light flex">
      <div className="relative p-8 bg-white w-full max-w-md m-auto flex-col flex rounded-lg bg-opacity-95">
        <span className="absolute top-0 right-0 p-4">
          <button onClick={onClose}><i className="fas fa-times text-black"></i></button>
        </span>
        <h2 className="text-2xl mb-4">User Details</h2>
        <div className="mt-4 bg-gray-200 p-4 rounded">
          <p><strong>ID:</strong> {user?._id}</p>
          <p><strong>Name:</strong> {user?.Fname}</p>
          <p><strong>Email:</strong> {user?.email}</p>
         
        </div>
        <div className="mt-4 flex justify-between">
          <button  onClick={handleDMClick} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200">
            DM
          </button>
          {user?.spam && user.spam.some(spam => spam.userId === userInfo.data.message._id) ? (
                  <button
                    onClick={handleUnspamClick}
                    className="bg-red-600 mx-5 px-2 py-1 text-white font-semibold text-sm rounded block text-center sm:inline-block"
                  >
                    Unspam
                  </button>
                ) : (
                  <button
                    onClick={handleSpamClick}
                    className="bg-red-600 mx-5 px-2 py-1 text-white font-semibold text-sm rounded block text-center sm:inline-block"
                  >
                    Spam
                  </button>
                )}
        </div>
      </div>
    </div>
    {isChatOpen && id && (
        <ChatComponent
          receiverId={user?._id || ""}
          onClose={() => setIsChatOpen(false)}
          isOpen={isChatOpen}
          Fname={user?.Fname || ""}
          Lname={user?.Lname || ""}
          profile={user?.profile || ""}
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
  );
};

export default UserDetailsModal;
