import React, { useState, useEffect, useRef } from 'react';
import Modal from 'react-modal';
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/slices/Reducers/types';
import { useSendMessageMutation, useGetMessagesMutation } from '../redux/slices/Api/EndPoints/clientApiEndPoints';

interface ChatComponentProps {
  receiverId: string;
  onClose: () => void;
  isOpen: boolean;
}

const socket = io('http://localhost:8888');

const ChatComponent: React.FC<ChatComponentProps> = ({ receiverId, onClose, isOpen }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const userInfo = useSelector((state: RootState) => state.client.userInfo);
  const [sendMessage] = useSendMessageMutation();
  const [getMessage, { isLoading, error }] = useGetMessagesMutation();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      const fetchMessages = async () => {
        const response: any = await getMessage({ senderId: userInfo?.data?.message?._id, receiverId });
        const response2: any = await getMessage({ senderId: receiverId, receiverId: userInfo?.data?.message?._id });
        if (response && response.data && response2 && response2.data) {
          const allMessages = [...response.data, ...response2.data].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
          setMessages(allMessages);
        }
      };

      fetchMessages();
    }
  }, [isOpen, receiverId, getMessage, userInfo]);

  useEffect(() => {
    if (isOpen) {
      const senderId = userInfo?.data?.message?._id;
      socket.emit('handshake', { senderId, receiverId }, (roomId: string, users: string[]) => {
        console.log(`Joined room: ${roomId}`);
      });

      socket.on('chat_message', (msg) => {
        setMessages((prevMessages) => [...prevMessages, msg].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()));
      });

      return () => {
        socket.emit('leaveRoom', { senderId, receiverId });
        socket.off('chat_message');
      };
    }
  }, [receiverId, userInfo, isOpen]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (message.trim()) {
      const msgData = {
        senderId: userInfo?.data?.message?._id,
        receiverId,
        message: message,
        createdAt: new Date(),
      };

      socket.emit('chat_message', msgData);
      await sendMessage(msgData);
       setMessage('');
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} contentLabel="Chat Modal" className="chat-modal" overlayClassName="chat-modal-overlay">
      <div className="chat-container">
        <div className="chat-header">
          <h2>Chat with {receiverId}</h2>
          <button onClick={onClose}>Close</button>
        </div>
        <div className="chat-messages">
          {isLoading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>Error loading messages</p>
          ) : (
            messages.map((msg, index) => (
              <div key={index} className={msg.senderId === userInfo?.data?.message?._id ? 'my-message' : 'other-message'}>
                <p>{msg.message}</p>
                <span>{new Date(msg.createdAt).toLocaleTimeString()}</span>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="chat-input">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message"
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </div>
    </Modal>
  );
};

export default ChatComponent;
