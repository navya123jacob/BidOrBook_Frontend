import React, { Dispatch, SetStateAction, useState } from 'react';
import Modal from 'react-modal';
import { User } from '../types/user';

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
  onlineUsers: string[]; 
}

const Chats: React.FC<ChatModalProps> = ({ isOpen, onClose, chats, onChatClick, onlineUsers }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredChats = chats.filter(chat => 
    chat.userId.Fname.toLowerCase().includes(searchTerm.toLowerCase()) || 
    chat.userId.Lname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Chat Modal"
      className="chats-modal"
      overlayClassName="chats-overlay"
    >
      <div className="chats-modal-content">
        <h2>Chats</h2>
        <input 
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="chats-search"
        />
        <div className="chats-list">
          {filteredChats.map((chat) => {
            const lastMessage = chat.messages[chat.messages.length - 1];
            const isOnline = onlineUsers.includes(chat.userId._id);
            return (
              <div key={chat.userId._id} onClick={() => onChatClick(chat)} className="chats-item">
                <div className="chats-item-header">
                  <img src={chat.userId.profile || 'default-profile.png'} alt={`${chat.userId.Fname} ${chat.userId.Lname}`} className="chats-item-avatar" />
                  <div className="chats-item-info">
                    <h3>
                      {`${chat.userId.Fname} ${chat.userId.Lname}`}
                      {isOnline && <span className="online-indicator">●</span>}
                    </h3>
                    <p>
                      {lastMessage?.message || 
                      (lastMessage?.file ? (
                        lastMessage.fileType.startsWith('video/') ? (
                          <span>Video</span>
                        ) : lastMessage.fileType.startsWith('audio/') ? (
                          <span>Audio</span>
                        ) : (
                          <a href={lastMessage.file} download>Download File</a>
                        )
                      ) : "No messages yet")}
                    </p>
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
  );
};

export default Chats;
