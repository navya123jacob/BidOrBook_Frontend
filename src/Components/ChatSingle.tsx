import React, { useState, useEffect, useRef } from 'react';
import Modal from 'react-modal';
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/slices/Reducers/types';
import { useSendMessageMutation, useGetMessagesMutation } from '../redux/slices/Api/EndPoints/clientApiEndPoints';
import { format, isToday, isYesterday } from 'date-fns';
import Picker, { EmojiClickData } from 'emoji-picker-react';
import FileBase64, { FileInfo } from 'react-file-base64';
import { ClipLoader } from 'react-spinners';

interface ChatComponentProps {
  receiverId: string;
  onClose: () => void;
  isOpen: boolean;
  Fname: string;
  Lname: string;
  profile: string;
  chats?: any[];
  refetch?: () => void;
}

const socket = io(import.meta.env.VITE_OFFICIAL);

const ChatComponent: React.FC<ChatComponentProps> = ({ receiverId, onClose, isOpen, Fname, Lname, profile }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [file, setFile] = useState<FileInfo | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isSending, setIsSending] = useState(false);
  // const [fileSizeLimit] = useState(200 * 1024 * 1024);
  const userInfo = useSelector((state: RootState) => state.client.userInfo);
  const onlineUsers = useSelector((state: RootState) => state.userStatus.onlineUsers); 
  const [sendMessage] = useSendMessageMutation();
  const [getMessage, { isLoading, error }] = useGetMessagesMutation();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const isReceiverOnline = onlineUsers.includes(receiverId); 

  useEffect(() => {
    let senderId = userInfo.data.message._id;

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
      let senderId = userInfo.data.message._id;

      socket.emit('handshake', { senderId, receiverId }, (roomId: string) => {
        console.log(`Joined room: ${roomId}`);
      });

      socket.on('chat_message', (msg: any) => {
        if (msg.senderId !== senderId) {
          setMessages((prevMessages) => [...prevMessages, msg].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()));
        }
      });
      socket.on('typing', () => {
        setIsTyping(true);
      });
  
      socket.on('stopped_typing', () => {
        setIsTyping(false);
      });

      return () => {
        socket.emit('leaveRoom', { senderId, receiverId });
        socket.off('chat_message');
        socket.off('typing');
        socket.off('stopped_typing');
      };
    }
  }, [receiverId, userInfo, isOpen]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    let senderId = userInfo.data.message._id;

    if (message.trim() || file) {
      const msgData = {
        senderId,
        receiverId,
        message: message.trim() || '',
        file: file ? file.base64 : null,
        fileType: file ? file.type : null,
        createdAt: new Date().toISOString(),
      };

      setIsSending(true);

      let response = await sendMessage(msgData);
      if ('data' in response) {
        socket.emit('chat_message', response.data);
      }

      setMessages((prevMessages) => [...prevMessages, msgData].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()));
      setMessage('');
      setFile(null);

      setIsSending(false);
    }
  };
  const handleKeyPress = () => {
    let senderId = userInfo.data.message._id;
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    socket.emit('typing', { senderId, receiverId });
  
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('stopped_typing', { senderId, receiverId });
    }, 3000); 
  };
  

  const onEmojiClick = (emojiObject: EmojiClickData) => {
    setMessage(prevMessage => prevMessage + emojiObject.emoji);
    setShowEmojiPicker(false);
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
          <h2 className="semi-bold">
            {Fname} {Lname} {isReceiverOnline ?<span className="online-indicator"><span className="online-indicator">●</span></span>:<span className="offline-indicator"><span className="offline-indicator">●</span></span>} 
          </h2>
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
                  <div key={msgIndex} className={msg.senderId === userInfo?.data?.message?._id ? 'chat-component-my-message' : 'chat-component-other-message'}>
                    {msg.message && <p className="p-5">{msg.message}</p>}
                    {msg.file && (
                      <div>
                        {msg.fileType.startsWith('image') ? (
                          <img src={msg.file} alt="file" />
                        ) : msg.fileType.startsWith('video') ? (
                          <video controls>
                            <source src={msg.file} type={msg.fileType} />
                            Your browser does not support the video tag.
                          </video>
                        ) : msg.fileType.startsWith('audio') ? (
                          <audio controls>
                            <source src={msg.file} type={msg.fileType} />
                            Your browser does not support the audio tag.
                          </audio>
                        ) : (
                          <a href={msg.file} download>Download File</a>
                        )}
                      </div>
                    )}
                    <span>{new Date(msg.createdAt).toLocaleTimeString()}</span>
                  </div>
                ))}
              </div>
            ))
          )}
           {isTyping && (
    <div className="typing-indicator">
      <p>{Fname} is typing...</p>
    </div>
  )}
 
          <div ref={messagesEndRef} />
        </div>
        <div className="chat-component-input">
          {file && (
            <div className="file-preview">
              {file.type.startsWith('image') ? (
                <img src={file.base64} alt="preview" />
              ) : file.type.startsWith('video') ? (
                <video controls>
                  <source src={file.base64} type={file.type} />
                  Your browser does not support the video tag.
                </video>
              ) : file.type.startsWith('audio') ? (
                <audio controls>
                  <source src={file.base64} type={file.type} />
                  Your browser does not support the audio tag.
                </audio>
              ) : (
                <p>{file.name}</p>
              )}
              <button onClick={() => setFile(null)}>Remove</button>
            </div>
          )}
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message"
            disabled={isSending}
          />
          <button onClick={() => setShowEmojiPicker(true)} className="bg-transparent m-1" disabled={isSending}>😊</button>
          <Modal isOpen={showEmojiPicker} onRequestClose={() => setShowEmojiPicker(false)} contentLabel="Emoji Picker Modal" className="emoji-picker-modal bg-transparent" overlayClassName="emoji-picker-modal-overlay">
            <Picker onEmojiClick={onEmojiClick} />
          </Modal>
         
          
        </div>
        <FileBase64 multiple={false} onDone={(file: FileInfo) => setFile(file)} />
        <button className="m-2 bg-graydark text-white w-16 rounded p-2" onClick={handleSendMessage} disabled={isSending}>{isSending ? <ClipLoader size={20} color="#000" /> : 'Send'}</button>
      </div>
    </Modal>
  );
};

export default ChatComponent;
