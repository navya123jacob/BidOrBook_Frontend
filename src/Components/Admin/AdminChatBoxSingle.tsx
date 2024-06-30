import React, { useState, useEffect, useRef, Dispatch, SetStateAction } from 'react';
import Modal from 'react-modal';
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/slices/Reducers/types';
import { useAdminSendMessageMutation, useAdminGetMessagesMutation  } from '../../redux/slices/Api/EndPoints/AdminEndpoints';
import { format, isToday, isYesterday } from 'date-fns';

interface ChatComponentProps {
  receiverId: string;
  onClose: () => void;
  isOpen: boolean;
  Fname: string;
  Lname: string;
  profile: string;
  setChats?: Dispatch<SetStateAction<any[]>>;
  admin?:boolean
}

// const socket = io("http://localhost:8888");
const official=import.meta.env.official
const socket = io(official);

const AdminChatComponent: React.FC<ChatComponentProps> = ({ receiverId, onClose, isOpen, Fname, Lname, profile, setChats,admin }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const userInfo = useSelector((state: RootState) => state.client.userInfo);
  const adminInfo = useSelector((state: RootState) => state.adminAuth.adminInfo);
  const [sendMessage] = useAdminSendMessageMutation();
  const [getMessage, { isLoading, error }] = useAdminGetMessagesMutation();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  console.log(userInfo)
  console.log(adminInfo)
  useEffect(() => {
    let senderId=adminInfo._id;
    
    if (isOpen) {
      const fetchMessages = async () => {
        const response: any = await getMessage({ senderId, receiverId });
        const response2: any = await getMessage({ senderId: receiverId, receiverId: senderId });
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
        let senderId=adminInfo._id;
      socket.emit('handshake', { senderId, receiverId }, (roomId: string) => {
        
        console.log(`Joined room: ${roomId}`);
      });

      socket.on('chat_message', (msg:any) => {
       
        if (msg.senderId !== senderId) {
          setMessages((prevMessages) => [...prevMessages, msg].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()));
          // if (setChats) {
          //   updateChats(msg);
          // }
        }
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
    let senderId;
    if(admin){
      senderId=adminInfo._id
    }
    else{
    senderId = userInfo.data.message._id}
    if (message.trim()) {
      const msgData = {
        senderId,
        receiverId,
        message: message,
        createdAt: new Date().toISOString(), 
      };

      socket.emit('chat_message', msgData);
      await sendMessage(msgData);
      
      setMessages((prevMessages) => [...prevMessages, msgData].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()));
      if (setChats) {
        updateChats(msgData);
      }
      
      setMessage('');
    }
  };

  const updateChats = (newMessage: any) => {
    setChats?.((prevChats) => {
      const updatedChats = [...prevChats];
      const chatIndex = updatedChats.findIndex((chat) => chat.userId._id === receiverId);

      if (chatIndex !== -1) {
        updatedChats[chatIndex] = {
          ...updatedChats[chatIndex],
          messages: [...updatedChats[chatIndex].messages, newMessage].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()),
        };
      } else {
        updatedChats.push({
          userId: {
            _id: receiverId,
            Fname,
            Lname,
            profile,
          },
          messages: [newMessage],
        });
      }

      return updatedChats.sort((a, b) => {
        const lastMessageA = a.messages[a.messages.length - 1];
        const lastMessageB = b.messages[b.messages.length - 1];
        return new Date(lastMessageB?.createdAt).getTime() - new Date(lastMessageA?.createdAt).getTime();
      });
    });
  };

  const groupMessagesByDate = (messages: any[]) => {
    const groupedMessages: { [key: string]: any[] } = {};

    messages.forEach((msg) => {
      const date = format(new Date(msg.createdAt), 'yyyy-MM-dd');
      if (!groupedMessages[date]) {
        groupedMessages[date] = [];
      }
      groupedMessages[date].push(msg);
    });

    return groupedMessages;
  };

  const renderDateLabel = (dateString: string) => {
    const date = new Date(dateString);
    if (isToday(date)) {
      return 'Today';
    } else if (isYesterday(date)) {
      return 'Yesterday';
    } else {
      return format(date, 'd MMM yyyy');
    }
  };

  const groupedMessages = groupMessagesByDate(messages);

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} contentLabel="Chat Modal" className="chat-component-modal" overlayClassName="chat-component-modal-overlay">
      <div className="chat-component-container">
        <div className="chat-component-header">
          <img src={profile} alt={`${Fname} ${Lname}`} className="profile-image" />
          <h2 className="semi-bold">{Fname} {Lname}</h2>
          <button onClick={onClose}><i className="fa fa-close"></i></button>
        </div>
        <div className="chat-component-messages">
          {isLoading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>Error loading messages</p>
          ) : (
            Object.keys(groupedMessages).map((date, index) => (
              <div key={index}>
                <div className="date-label">{renderDateLabel(date)}</div>
                {groupedMessages[date].map((msg, msgIndex) => (
                  <div key={msgIndex} className={msg.senderId === adminInfo._id  ? 'chat-component-my-message' : 'chat-component-other-message'}>
                    <p>{msg.message}</p>
                    <span>{new Date(msg.createdAt).toLocaleTimeString()}</span>
                  </div>
                ))}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="chat-component-input">
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

export default AdminChatComponent;