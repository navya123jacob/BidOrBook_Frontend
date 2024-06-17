import React, { Dispatch, SetStateAction, useEffect } from 'react';
import { io } from 'socket.io-client';
import { User } from '../../types/user';
import { RootState } from '../../redux/slices/Reducers/types';
import { useSelector } from 'react-redux';

interface PopulatedChat {
  userId: User;
  messages: any[];
}

interface ChatModalProps {
  chats: PopulatedChat[];
  onChatClick: (chat: PopulatedChat) => void;
  setChats: Dispatch<SetStateAction<PopulatedChat[]>>;
}

const socket = io('http://localhost:8888');

const ChatsClient: React.FC<ChatModalProps> = ({ chats, onChatClick, setChats }) => {
  const userInfo = useSelector((state: RootState) => state.client.userInfo);

  useEffect(() => {
    
    socket.on('newMessage', (newMessage) => {
      setChats((prevChats) => {
        const updatedChats = [...prevChats];
        const chatIndex = updatedChats.findIndex((chat) => chat.userId._id === newMessage.userId);
        
        if (chatIndex !== -1) {
          
          updatedChats[chatIndex].messages.push(newMessage);
        } else {
          
          updatedChats.push({
            userId: newMessage.userId,
            messages: [newMessage]
          });
        }
        
        return updatedChats;
      });
    });

    return () => {
      socket.off('newMessage');
    };
  }, [setChats]);

  return (
    <div className="bg-gray-200 flex flex-col items-center justify-center w-full lg:w-1/2 space-y-6 p-6 h-full">
      <h2 className="text-2xl font-bold mb-4">Chats</h2>
      <div className="chats-list w-full space-y-4 overflow-y-auto h-80"> 
        {chats.map((chat) => {
          const lastMessage = chat.messages[chat.messages.length - 1];
          return (
            <div
              key={chat.userId._id}
              onClick={() => onChatClick(chat)}
              className="flex items-center p-4 bg-white rounded-lg shadow cursor-pointer hover:bg-gray-100"
            >
              <img
                src={chat.userId.profile || 'default-profile.png'}
                alt={`${chat.userId.Fname} ${chat.userId.Lname}`}
                className="w-12 h-12 rounded-full mr-4"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{`${chat.userId.Fname} ${chat.userId.Lname}`}</h3>
                <p className="text-gray-600">{lastMessage?.message || "No messages yet"}</p>
              </div>
              {lastMessage && (
                <span className="text-sm text-gray-500">{new Date(lastMessage.createdAt).toLocaleString()}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChatsClient;
