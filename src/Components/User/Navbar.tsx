import { useEffect, useState } from 'react';
import { Dialog } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/slices/Reducers/ClientReducer';
import { RootState } from '../../redux/slices/Reducers/types';
import { useGetUserChatsQuery, useLogoutMutation } from '../../redux/slices/Api/EndPoints/clientApiEndPoints';
import Chats from '../Chats';
import ChatComponent from '../ChatSingle';
import { io } from 'socket.io-client';
import { userOnline, userOffline } from '../../redux/slices/onlineUsersSlice';

const socket = io(import.meta.env.VITE_OFFICIAL);

export const Navbar = () => {
  const userInfo = useSelector((state: RootState) => state.client.userInfo);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [chats, setChats] = useState<any[]>([]);
  const { data: mychats, refetch } = useGetUserChatsQuery(userInfo?.data.message._id ?? '');
  const [newMessage, setNewMessage] = useState<any>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [singleChatOpen, setSingleChatOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const [logoutApi] = useLogoutMutation();

  const navigation = [
    { name: 'Home', to: '/' },
    { name: 'About', to: '/about' },
  ];

  if (userInfo) {
    if (userInfo.client) {
      navigation.push({ name: 'Profile', to: '/profile' });
    } else {
      navigation.push({ name: 'Profile', to: '/artpho/profile' });
      navigation.push({ name: 'Account', to: '/artpho/account' });
    }
  }

  useEffect(() => {
    if (userInfo) {
      socket.emit('user_connected', userInfo.data.message._id);

      const handleUserOnline = (userId: string) => {
        setOnlineUsers((prev) => {
          if (!prev.includes(userId)) {
            return [...prev, userId];
          }
          return prev;
        });
        dispatch(userOnline(userId));
      };

      const handleUserOffline = (userId: string) => {
        setOnlineUsers((prev) => prev.filter(id => id !== userId));
        dispatch(userOffline(userId));
      };

      const handleOnlineUsers = (users: string[]) => {
        setOnlineUsers(users);
        users.forEach(userId => dispatch(userOnline(userId)));
      };

      socket.on('user_online', handleUserOnline);
      socket.on('user_offline', handleUserOffline);
      socket.on('online_users', handleOnlineUsers);

      return () => {
        socket.off('user_online', handleUserOnline);
        socket.off('user_offline', handleUserOffline);
        socket.off('online_users', handleOnlineUsers);
      };
    }
  }, [userInfo]);

  useEffect(() => {
    if (mychats) {
      setChats(mychats);
    }
  }, [mychats]);

  useEffect(() => {
    if (userInfo) {
      const senderId = userInfo?.data?.message?._id;

      chats.forEach((chat) => {
        const receiverId = chat.userId._id;
        socket.emit("handshake", { senderId, receiverId }, (roomId: string) => {
          console.log(`Joined room: ${roomId}`);
        });
      });

      const handleMessage = async (message: any) => {
        setNewMessage(message);
      };

      socket.on("chat_message", handleMessage);

      return () => {
        socket.off("chat_message", handleMessage);
      };
    }
  }, [chats, userInfo]);

  useEffect(() => {
    const fetchNewChats = async () => {
      if (newMessage) {
        const isSenderPresent = chats.some(chat => chat.userId._id === newMessage.senderId);

        if (!isSenderPresent) {
          const refetchResult = await refetch();
          if (refetchResult?.data) {
            setChats(refetchResult.data);
          }
        } else {
          updateChats(newMessage);
        }
      }
    };

    fetchNewChats();
  }, [newMessage]);

  const updateChats = (newMessage: any) => {
    const updatedChats = chats.map((chat) => {
      if (chat.userId._id === newMessage.receiverId || chat.userId._id === newMessage.senderId) {
        return {
          ...chat,
          messages: [...chat.messages, newMessage].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()),
        };
      }
      return chat;
    });

    setChats(updatedChats.sort((a, b) => {
      const lastMessageA = a.messages[a.messages.length - 1];
      const lastMessageB = b.messages[b.messages.length - 1];
      return new Date(lastMessageB?.createdAt).getTime() - new Date(lastMessageA?.createdAt).getTime();
    }));
  };

  const handleLogout = async () => {
    if (userInfo?.data?.message?._id) {
      socket.emit('user_logout', userInfo.data.message._id);
    }

    dispatch(logout());
    await logoutApi(undefined).unwrap();
    
  };

  const handleChatClick = (chat: any) => {
    setSelectedChat(chat);
    setSingleChatOpen(true);

    const senderId = userInfo?.data?.message?._id;
    const receiverId = chat.userId._id;
    socket.emit("handshake", { senderId, receiverId }, (roomId: string) => {
      console.log(`Joined room: ${roomId}`);
    });
  };

  return (
    <>
      <nav className="flex items-center justify-between p-6 lg:px-8 text-white" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link to="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Bid or Book</span>
            <img className="h-8 w-auto" src="https://res.cloudinary.com/dvgwqkegd/image/upload/v1716207599/Logo2_t9jslm.png" alt="" />
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button type="button" className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700" onClick={() => setMobileMenuOpen(true)}>
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-12 text-white">
          {navigation.map((item) => (
            <Link key={item.name} to={item.to} className="text-sm font-semibold leading-6">
              {item.name}
            </Link>
          ))}
          {userInfo && <button className="text-sm font-semibold leading-6" onClick={() => setIsChatModalOpen(true)}>Chats</button>}
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end text-white">
          {userInfo && <button type="button" className="text-sm font-semibold leading-6" onClick={handleLogout}>
            Log Out <span aria-hidden="true">&rarr;</span>
          </button>}
        </div>
      </nav>

      <Dialog className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        <div className="fixed inset-0 z-50" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-black px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10 bg-opacity-80 text-black">
          <div className="flex items-center justify-between">
            <Link to="/" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <img className="h-8 w-auto" src="https://res.cloudinary.com/dvgwqkegd/image/upload/v1716207599/Logo2_t9jslm.png" alt="" />
            </Link>
            <button type="button" className="-m-2.5 rounded-md p-2.5 text-gray-700" onClick={() => setMobileMenuOpen(false)}>
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <Link key={item.name} to={item.to} className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-gray-600">
                    {item.name}
                  </Link>
                ))}
                {userInfo && <button className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-gray-600" onClick={() => setIsChatModalOpen(true)}>Chats</button>}
              </div>
              <div className="py-6">
                {userInfo && <button type="button" className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-white hover:bg-gray-600" onClick={handleLogout}>
                  Log out
                </button>}
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
      {!userInfo }
      {isChatModalOpen && (
        <Chats
          isOpen={isChatModalOpen}
          onClose={() => setIsChatModalOpen(false)}
          chats={chats}
          onChatClick={handleChatClick}
          setChats={setChats}
          onlineUsers={onlineUsers}
        />
      )}
      {singleChatOpen && chats.length > 0 && (
        <ChatComponent
          receiverId={selectedChat?.userId._id || ""}
          onClose={() => setSingleChatOpen(false)}
          isOpen={singleChatOpen}
          Fname={selectedChat?.userId.Fname || ""}
          Lname={selectedChat?.userId.Lname || ""}
          profile={selectedChat?.userId.profile || ""}
          chats={chats}
          refetch={refetch}
        />
      )}
    </>
  );
};
