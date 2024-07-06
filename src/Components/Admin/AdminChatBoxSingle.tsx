import React, {
  useState,
  useEffect,
  useRef,
  Dispatch,
  SetStateAction,
} from "react";
import Modal from "react-modal";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/slices/Reducers/types";
import {
  useAdminSendMessageMutation,
  useAdminGetMessagesMutation,
} from "../../redux/slices/Api/EndPoints/AdminEndpoints";
import { format, isToday, isYesterday } from "date-fns";
import Picker, { EmojiClickData } from "emoji-picker-react";
import FileBase64, { FileInfo } from "react-file-base64";
import { ClipLoader } from "react-spinners";

interface ChatComponentProps {
  receiverId: string;
  onClose: () => void;
  isOpen: boolean;
  Fname: string;
  Lname: string;
  profile: string;
  setChats?: Dispatch<SetStateAction<any[]>>;
  admin?: boolean;
}

const socket = io(import.meta.env.VITE_OFFICIAL);

const AdminChatComponent: React.FC<ChatComponentProps> = ({
  receiverId,
  onClose,
  isOpen,
  Fname,
  Lname,
  profile,
  admin,
}) => {
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [file, setFile] = useState<FileInfo | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const userInfo = useSelector((state: RootState) => state.client.userInfo);
  const adminInfo = useSelector(
    (state: RootState) => state.adminAuth.adminInfo
  );
  const [sendMessage] = useAdminSendMessageMutation();
  const [getMessage, { isLoading, error }] = useAdminGetMessagesMutation();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const onlineUsers = useSelector(
    (state: RootState) => state.userStatus.onlineUsers
  );
  const isReceiverOnline = onlineUsers.includes(receiverId);

  useEffect(() => {
    let senderId = adminInfo._id;

    if (isOpen) {
      const fetchMessages = async () => {
        const response: any = await getMessage({ senderId, receiverId });
        const response2: any = await getMessage({
          senderId: receiverId,
          receiverId: senderId,
        });
        if (response && response.data && response2 && response2.data) {
          const allMessages = [...response.data, ...response2.data].sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
          setMessages(allMessages);
        }
      };

      fetchMessages();
    }
  }, [isOpen, receiverId, getMessage, userInfo]);

  useEffect(() => {
    if (isOpen) {
      let senderId = adminInfo._id;

      socket.emit("handshake", { senderId, receiverId }, (roomId: string) => {
        console.log(`Joined room: ${roomId}`);
      });

      socket.on("chat_message", (msg: any) => {
        if (msg.senderId !== senderId) {
          setMessages((prevMessages) =>
            [...prevMessages, msg].sort(
              (a, b) =>
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime()
            )
          );
        }
      });
      socket.on('typing', (data: { senderId: string }) => {
        if (data.senderId === receiverId) {
          setIsTyping(true);
        }
      });
  
      socket.on('stopped_typing', (data: { senderId: string }) => {
        if (data.senderId === receiverId) {
          setIsTyping(false);
        }
      });

      return () => {
        socket.emit("leaveRoom", { senderId, receiverId });
        socket.off("chat_message");
        socket.off("typing");
        socket.off("stopped_typing");
      };
    }
  }, [receiverId, userInfo, isOpen]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    let senderId = admin ? adminInfo._id : userInfo.data.message._id;

    if (message.trim() || file) {
      const msgData = {
        senderId,
        receiverId,
        message: message.trim() || "",
        file: file ? file.base64 : null,
        fileType: file ? file.type : null,
        createdAt: new Date().toISOString(),
      };

      setIsSending(true);

      const response = await sendMessage(msgData);
      if ("data" in response) {
        socket.emit("chat_message", response.data);
      }

      setMessages((prevMessages) =>
        [...prevMessages, msgData].sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        )
      );
      setMessage("");
      setFile(null);

      setIsSending(false);
    }
  };
  const handleKeyPress = () => {
    let senderId = adminInfo._id;

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    socket.emit("typing", { senderId, receiverId });

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopped_typing", { senderId, receiverId });
    }, 3000);
  };

  const onEmojiClick = (emojiObject: EmojiClickData) => {
    setMessage((prevMessage) => prevMessage + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  const groupMessagesByDate = (messages: any[]) => {
    const groupedMessages: { [key: string]: any[] } = {};

    messages.forEach((msg) => {
      const date = format(new Date(msg.createdAt), "yyyy-MM-dd");
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
      return "Today";
    } else if (isYesterday(date)) {
      return "Yesterday";
    } else {
      return format(date, "d MMM yyyy");
    }
  };

  const groupedMessages = groupMessagesByDate(messages);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Chat Modal"
      className="chat-component-modal"
      overlayClassName="chat-component-modal-overlay"
    >
      <div className="chat-component-container">
        <div className="chat-component-header">
          <img
            src={profile}
            alt={`${Fname} ${Lname}`}
            className="profile-image"
          />
          <h2 className="semi-bold">
            {Fname} {Lname}{" "}
            {isReceiverOnline ? (
              <span className="online-indicator">●</span>
            ) : (
              <span className="offline-indicator">●</span>
            )}
          </h2>

          <button onClick={onClose}>
            <i className="fa fa-close"></i>
          </button>
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
                  <div
                    key={msgIndex}
                    className={
                      msg.senderId === adminInfo._id
                        ? "chat-component-my-message"
                        : "chat-component-other-message"
                    }
                  >
                    {msg.message && <p>{msg.message}</p>}
                    {msg.file && (
                      <div>
                        {msg.fileType.startsWith("image") ? (
                          <img src={msg.file} alt="file" />
                        ) : msg.fileType.startsWith("video") ? (
                          <video controls>
                            <source src={msg.file} type={msg.fileType} />
                          </video>
                        ) : msg.fileType.startsWith("audio") ? (
                          <audio controls>
                            <source src={msg.file} type={msg.fileType} />
                          </audio>
                        ) : (
                          <a href={msg.file} download>
                            Download File
                          </a>
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
              {file.type.startsWith("image") ? (
                <img src={file.base64} alt="preview" />
              ) : file.type.startsWith("video") ? (
                <video controls>
                  <source src={file.base64} type={file.type} />
                </video>
              ) : file.type.startsWith("audio") ? (
                <audio controls>
                  <source src={file.base64} type={file.type} />
                </audio>
              ) : (
                <p>{file.name}</p>
              )}
              <button onClick={() => setFile(null)} className="text-red-500">
                <i className="fa fa-close"></i>
              </button>
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
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="emoji-button"
          >
            <i className="fa fa-smile-o"></i>
          </button>
          {showEmojiPicker && (
            <div className="emoji-picker">
              <Picker onEmojiClick={onEmojiClick} />
            </div>
          )}
          <FileBase64 multiple={false} onDone={(file) => setFile(file)} />
        </div>
        <button
          onClick={handleSendMessage}
          disabled={isSending}
          className="send-button m-1 rounded p-1 w-20 bg-graydark text-white"
        >
          {isSending ? (
            <ClipLoader size={20} color="white" />
          ) : (
            <i className="fa fa-paper-plane"></i>
          )}
        </button>
      </div>
    </Modal>
  );
};

export default AdminChatComponent;
