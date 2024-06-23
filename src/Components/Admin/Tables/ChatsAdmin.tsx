import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { User } from '../../../types/user';
import { RootState } from '../../../redux/slices/Reducers/types';
import { useSelector } from 'react-redux';
import { useAdmingetUserChatsQuery } from '../../../redux/slices/Api/EndPoints/AdminEndpoints';
import AdminChatComponent from '../AdminChatBoxSingle';


interface PopulatedChat {
  userId: User;
  messages: any[];
}

const url=import.meta.env.backendurl
const socket = io('http://localhost:8888');

const ChatsAdmin: React.FC = () => {
  const adminInfo = useSelector((state: RootState) => state.adminAuth.adminInfo);
  const [selectedChat, setSelectedChat] = useState<PopulatedChat | null>(null);
  const [chats, setChats] = useState<PopulatedChat[]>([]);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const {
    data: mychats,
    error: chatError,
    isLoading: chatLoading,
  } = useAdmingetUserChatsQuery(adminInfo._id);
  useEffect(() => {
    if (mychats) {
      setChats(mychats);
    }
  }, [mychats]);

  useEffect(() => {
    const senderId = adminInfo._id;

    chats.forEach((chat) => {
      const receiverId = chat.userId._id;
      socket.emit("handshake", { senderId, receiverId }, (roomId: string) => {
        console.log(`Joined room: ${roomId}`);
      });
    });

    socket.on("chat_message", (newMessage:any) => {
      updateChats(newMessage);
    });

    return () => {
      socket.off("chat_message");
    };
  }, [chats]);

  const updateChats = (newMessage: any) => {
    const updatedChats = chats.map((chat) => {
      if (
        chat.userId._id === newMessage.receiverId ||
        chat.userId._id === newMessage.senderId
      ) {
        return {
          ...chat,
          messages: [...chat.messages, newMessage].sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          ),
        };
      }
      return chat;
    });

    setChats(
      updatedChats.sort((a, b) => {
        const lastMessageA = a.messages[a.messages.length - 1];
        const lastMessageB = b.messages[b.messages.length - 1];
        return (
          new Date(lastMessageB?.createdAt).getTime() -
          new Date(lastMessageA?.createdAt).getTime()
        );
      })
    );
  };
const handleChatClick = (chat: PopulatedChat) => {
    setSelectedChat(chat);
    setIsChatModalOpen(false);
  };

  return (
    <>
    <div className="bg-gray-200 flex flex-col items-center justify-center w-full lg:w-4/5 space-y-6 p-6 h-full">
      <h2 className="text-2xl font-bold mb-4 text-graydark">Chats</h2>
      <div className="chats-list w-full space-y-4 overflow-y-auto h-80"> 
        {chats.map((chat) => {
          const lastMessage = chat.messages[chat.messages.length - 1];
          return (
            <div
              key={chat.userId._id}
              onClick={() => handleChatClick(chat)}
              className="flex items-center p-4 bg-white rounded-lg shadow cursor-pointer text-black hover:bg-gray "
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
        {!chats.length && (
                <div className="text-center py-6 text-black ">
                  No Chats
                </div>
              )}
      </div>
    </div>
    {selectedChat && (
        <AdminChatComponent
          isOpen={!!selectedChat}
          onClose={() => setSelectedChat(null)}
          receiverId={selectedChat.userId._id}
          Fname={selectedChat.userId.Fname}
          Lname={selectedChat.userId.Lname}
          profile={selectedChat.userId.profile}
          admin={true}
        />
      )}
    </>
  );
};

export default ChatsAdmin;
