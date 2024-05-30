import React, { useContext, useState,useEffect } from 'react';
import SocketContext from '../Contexts/Socket/Context';

const Chat: React.FC = () => {
    const { SocketState, SocketDispatch } = useContext(SocketContext);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<{ uid: string, text: string }[]>([]);

    useEffect(() => {
        if (SocketState.socket) {
            SocketState.socket.on('chat_message', (message: { uid: string, text: string }) => {
                setMessages((prevMessages) => [...prevMessages, message]);
            });

            return () => {
                SocketState.socket?.off('chat_message');
            };
        }
    }, [SocketState.socket]);

    const sendMessage = () => {
        const uid = SocketState.uid;
        if (uid && SocketState.socket) {
            SocketState.socket.emit('chat_message', { uid, text: message });
            setMessage('');
        }
    };

    return (
        <div>
            <div>
                {messages.map((msg, index) => (
                    <div key={index}>
                        <strong>{msg.uid}</strong>: {msg.text}
                    </div>
                ))}
            </div>
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' ? sendMessage() : null}
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default Chat;
