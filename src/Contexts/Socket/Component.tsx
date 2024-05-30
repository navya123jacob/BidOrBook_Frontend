import React, { PropsWithChildren, useEffect, useReducer, useState } from 'react';
import { useSocket } from '../../hooks/useSocket';
import { defaultSocketContextState, SocketReducer, SocketContextProvider } from './Context';

export interface ISocketContextComponentProps extends PropsWithChildren {}

const SocketContextComponent: React.FunctionComponent<ISocketContextComponentProps> = (props) => {
    const { children } = props;

    const socket = useSocket('ws://localhost:8888', {
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        autoConnect: false
    });

    const [SocketState, SocketDispatch] = useReducer(SocketReducer, defaultSocketContextState);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        socket.connect();
        SocketDispatch({ type: 'update_socket', payload: socket });
        StartListeners();
        SendHandshake();
        // eslint-disable-next-line
    }, []);

    const StartListeners = () => {
        socket.on('user_connected', (users: string[]) => {
            SocketDispatch({ type: 'update_users', payload: users });
        });

        socket.on('user_disconnected', (uid: string) => {
            SocketDispatch({ type: 'remove_user', payload: uid });
        });

        socket.io.on('reconnect', (attempt) => {
            SendHandshake();
        });

        socket.io.on('reconnect_attempt', (attempt) => {
            console.info('Reconnection Attempt: ' + attempt);
        });

        socket.io.on('reconnect_error', (error) => {
            console.info('Reconnection error: ' + error);
        });

        socket.io.on('reconnect_failed', () => {
            alert('Unable to connect to the chat service. Check your internet connection or try again later.');
        });

        socket.on('chat_message', (message: { uid: string, text: string }) => {
            console.info('Chat message received');
            // Handle incoming messages
        });
    };

    const SendHandshake = async () => {
        socket.emit('handshake', async (uid: string, users: string[]) => {
            SocketDispatch({ type: 'update_users', payload: users });
            SocketDispatch({ type: 'update_uid', payload: uid });
        });

        setLoading(false);
    };

    if (loading) return <p>... loading Socket IO ....</p>;

    return <SocketContextProvider value={{ SocketState, SocketDispatch }}>{children}</SocketContextProvider>;
};

export default SocketContextComponent;
