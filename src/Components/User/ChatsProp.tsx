import React, { createContext, useContext, ReactNode } from 'react';
import { useGetUserChatsQuery } from '../../redux/slices/Api/EndPoints/clientApiEndPoints'; 
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/slices/Reducers/types';

interface ChatContextType {
  refetch?: () => void;
  mychats: any[]; 
}

// Create context
const ChatContext = createContext<ChatContextType>({ mychats: [] });

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const userInfo = useSelector((state: RootState) => state.client.userInfo); 
  const { data: mychats, refetch } = useGetUserChatsQuery(userInfo?.data.message._id ?? '');

  return (
    <ChatContext.Provider value={{ refetch, mychats }}>
      {children}
    </ChatContext.Provider>
  );
};

// Custom hook to use the context
export const useChatContext = () => useContext(ChatContext);
