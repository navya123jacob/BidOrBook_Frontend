import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/slices/Reducers/types';
import { useSendMessageMutation } from '../redux/slices/Api/EndPoints/clientApiEndPoints';

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

  useEffect(() => {
    if (isOpen) {
      const senderId = userInfo?.data?.message?._id;
      socket.emit('handshake', { senderId, receiverId }, (roomId: string, users: string[]) => {
        console.log(`Joined room: ${roomId}`);
      });

      socket.on('chat_message', (msg) => {
        setMessages((prevMessages) => [...prevMessages, msg]);
      });

      return () => {
        socket.emit('leaveRoom', { senderId, receiverId });
        socket.off('chat_message');
      };
    }
  }, [receiverId, userInfo, isOpen]);

  const handleSendMessage = async () => {
    if (message.trim()) {
      const msgData = {
        senderId: userInfo?.data?.message?._id,
        receiverId,
        text: message,
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
          {messages.map((msg, index) => (
            <div key={index} className={msg.senderId === userInfo?.data?.message?._id ? 'my-message' : 'other-message'}>
              <p>{msg.text}</p>
              <span>{new Date(msg.createdAt).toLocaleTimeString()}</span>
            </div>
          ))}
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
