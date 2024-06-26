import React, { Dispatch, SetStateAction } from 'react';
import Modal from 'react-modal';
import { User } from '../types/user';
import { RootState } from '../redux/slices/Reducers/types';
import { useSelector } from 'react-redux';

interface PopulatedChat {
  userId: User;
  messages: any[];
}

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  chats: PopulatedChat[];
  onChatClick: (chat: PopulatedChat) => void;
  setChats: Dispatch<SetStateAction<PopulatedChat[]>>;
}


const Chats: React.FC<ChatModalProps> = ({ isOpen, onClose, chats, onChatClick }) => {
   useSelector((state: RootState) => state.client.userInfo);

  // useEffect(() => {
  //   if (isOpen) {
  //     const senderId = userInfo?.data?.message?._id;

  //     chats.forEach(chat => {
  //       const receiverId = chat.userId._id;
  //       socket.emit('handshake', { senderId, receiverId }, (roomId: string) => {
  //         console.log(`Joined room: ${roomId}`);
  //       });
  //     });

  //     socket.on('chat_message', (newMessage) => {
  //       updateChats(newMessage);
  //     });

  //     return () => {
  //       socket.off('chat_message');
  //     };
  //   }
  // }, [isOpen, chats]);

  // const updateChats = (newMessage: any) => {
  //   const updatedChats = chats.map((chat) => {
  //     if (chat.userId._id === newMessage.receiverId || chat.userId._id === newMessage.senderId) {
  //       return {
  //         ...chat,
  //         messages: [...chat.messages, newMessage].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()),
  //       };
  //     }
  //     return chat;
  //   });

    
  //   setChats(updatedChats.sort((a, b) => {
  //     const lastMessageA = a.messages[a.messages.length - 1];
  //     const lastMessageB = b.messages[b.messages.length - 1];
  //     return new Date(lastMessageB?.createdAt).getTime() - new Date(lastMessageA?.createdAt).getTime();
  //   }));
  // };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onRequestClose={onClose}
        contentLabel="Chat Modal"
        className="chats-modal"
        overlayClassName="chats-overlay"
      >
        <div className="chats-modal-content">
          <h2>Chats</h2>
          <div className="chats-list">
            {chats.map((chat) => {
              const lastMessage = chat.messages[chat.messages.length - 1];
              return (
                <div key={chat.userId._id} onClick={() => onChatClick(chat)} className="chats-item">
                  <div className="chats-item-header">
                    <img src={chat.userId.profile || 'default-profile.png'} alt={`${chat.userId.Fname} ${chat.userId.Lname}`} className="chats-item-avatar" />
                    <div className="chats-item-info">
                      <h3>{`${chat.userId.Fname} ${chat.userId.Lname}`}</h3>
                      <p>{lastMessage?.message || "No messages yet"}</p>
                    </div>
                  </div>
                  {lastMessage && <span className="chats-item-time">{new Date(lastMessage.createdAt).toLocaleString()}</span>}
                </div>
              );
            })}
          </div>
          <button onClick={onClose} className="chats-modal-close-button">Close</button>
        </div>
      </Modal>
    </>
  );
};

export default Chats;
