import React, { useEffect, useState } from "react";
import { Navbar } from "../../Components/User/Navbar";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/slices/Reducers/types";
import ArtistProfileForm from "../../Components/ArtPho/ArtistProfileForm";
import ChatsClient from "../../Components/User/ChatsClient";
import ChatComponent from "../../Components/ChatSingle";
import { useGetUserChatsQuery } from "../../redux/slices/Api/EndPoints/clientApiEndPoints";
import { useAllAuctionsMutation, useAuctionByBidderMutation, useDeleteAuctionMutation } from "../../redux/slices/Api/EndPoints/auctionEndPoints";
import { User } from "../../types/user";
import { io } from "socket.io-client";
import {
  useBookingsreqMutation,
  useBookingsConfirmMutation,
  useMarkedMutation,
  useDoneMutation
} from "../../redux/slices/Api/EndPoints/bookingEndpoints";
import { Booking } from "../../types/booking";
import BookingViewModal from "../../Components/User/BookingViewModal";
import { IAuction } from "../../types/auction";
import AuctionList from "../../Components/User/AuctionsViewModal";
import AuctionDetailModal from "../../Components/ArtPho/AuctionDetail";
import BiddingModal from "../../Components/User/MakeBid";
import { useGetAdminDetailsQuery } from "../../redux/slices/Api/EndPoints/AdminEndpoints";

// const socket = io("http://localhost:8888");
// const official=import.meta.env.official
const socket = io('http://localhost:8888');
interface PopulatedChat {
  userId: User;
  messages: any[];
}

const ArtistProfilePage: React.FC = () => {
  const { data: admin,  } = useGetAdminDetailsQuery();
  const [bookingsreq] = useBookingsreqMutation();
  const [bookingsConfirm] = useBookingsConfirmMutation();
  const [marked] = useMarkedMutation();
  const [done] = useDoneMutation();
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  
  const [selectedChat, setSelectedChat] = useState<PopulatedChat | null>(null);
  const [chats, setChats] = useState<PopulatedChat[]>([]);
  const [activeSection, setActiveSection] = useState("profile");
  const [bookingReqData, setBookingReqData] = useState<Booking[]>([]);
  const [bookingConfirmData, setBookingConfirmData] = useState<Booking[]>([]);
  const [markedData, setMarkedData] = useState<Booking[]>([]);
  const [doneData, setDoneData] = useState<Booking[]>([]);
  const [currentbids,setCurrentbids]=useState<IAuction[]>([])
  const [isAuctionDetModalOpen, setIsAuctionDetModalOpen] =useState(false);
  const [isBiddingModalOpen, setIsBiddingModalOpen] = useState(false);
  const [AdminChatOpen,setAdminChatOpen]= useState(false);
  const [selectedAuction, setSelectedAuction] = useState<IAuction | null>(null);
  const userInfo = useSelector((state: RootState) => state.client.userInfo);
  const [allAuctions] = useAllAuctionsMutation();
  const [bids, setBids] = useState<{ userId: string; amount: number }[]>([]);
  // const { data: walletData = { wallet: 0 } } = useGetWalletValueQuery(userInfo.data.message._id);
  const [changes, setChanges] = useState(0);
  const[AuctionByBidder] =useAuctionByBidderMutation()
  const [deleteAuction] = useDeleteAuctionMutation();
  const {
    data: mychats,
   
  } = useGetUserChatsQuery(userInfo.data.message._id);
  
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        
        const response = await bookingsreq({
          artistId: userInfo.data.message._id
        });
        if ("data" in response) {
          setBookingReqData(response.data?.bookings);
        }

        const response2 = await bookingsConfirm({
          artistId: userInfo.data.message._id
        });
        if ("data" in response2) {
          setBookingConfirmData(response2.data?.bookings);
        }
       

        const response3 = await marked({ artistId: userInfo.data.message._id });
        
        if ("data" in response3) {
          setMarkedData(response3.data?.bookings);
        }
        const response4 = await done({ artistId: userInfo.data.message._id });
        
        if ("data" in response4) {
          setDoneData(response4.data?.bookings);
        }
      } catch (err) {
        console.error("Error fetching bookings:", err);
      }
      
    };

    fetchBookings();
  }, [bookingsreq, bookingsConfirm, marked,changes]);
  useEffect(() => {
    if (mychats) {
      setChats(mychats);
    }
  }, [mychats]);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const senderId = userInfo?.data?.message?._id;

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
  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const response = await allAuctions({ userId: userInfo.data.message._id ?? "", notId: "" });

        if ('data' in response) {
          const auctions = response.data.auctions;
          const pendingBids: IAuction[] = [];
          const paidBids: IAuction[] = [];
  
          auctions.forEach((auction: IAuction) => {
            if (auction.payment === 'paid' && auction.bids.length > 0 && auction.bids[auction.bids.length - 1].userId === userInfo.data.message._id) {
              paidBids.push(auction);
            } else {
              pendingBids.push(auction);
            }
          });
  
          setCurrentbids(pendingBids);
          // setPurchased(paidBids);
        }
      } catch (err) {
        console.error('Error fetching auctions:', err);
      }
    };

    fetchAuctions();
  }, [AuctionByBidder, userInfo.data.message._id]);

  const handleSectionClick = (section: string) => {
    setActiveSection(section);
  };

  const handleChatClick = (chat: PopulatedChat) => {
    setSelectedChat(chat);
    
  };
  const handleSelectAuction = (auction: IAuction) => {
    setSelectedAuction(auction);
  };
  const handleDeleteAuction = async (auctionId: string) => {
    await deleteAuction({ auctionId, userId: userInfo.data.message._id });
    if(selectedAuction?.payment=='paid'){
    // setPurchased((prevAuctions) =>
    //   prevAuctions.filter((auction) => auction._id !== auctionId)
    // );
  }
    else{
      setCurrentbids((prevAuctions) =>
        prevAuctions.filter((auction) => auction._id !== auctionId)
      );
    }
    setIsAuctionDetModalOpen(false);
  };
  const handleBid = (amount: number) => {
    setBids([{ userId: userInfo.data.message._id, amount }, ...bids]);
    setIsBiddingModalOpen(false);
  };

  return (
    <>
      <header className="absolute inset-x-0 top-0 z-50">
        <Navbar />
      </header>
      <main className="profile-page h-screen ">
        <section className="relative block h-500-px">
          <div
            className="absolute top-0 w-full h-full bg-center bg-cover"
            style={{
              backgroundImage: "url('/ClientProfile1.jpeg')",
            }}
          >
            <span
              id="blackOverlay"
              className="w-full h-full absolute opacity-50 bg-black"
            ></span>
          </div>
          <div
            className="absolute top-0 w-full h-full bg-center bg-cover"
            style={{
              backgroundImage: "url('/ClientProfile1.jpeg')",
            }}
          >
            <span
              id="blackOverlay"
              className="w-full h-full absolute opacity-50 bg-black"
            ></span>
          </div>
        </section>
        <section
          className="relative py-16 bg-blueGray-200 bg-center bg-cover flex-grow"
          style={{ backgroundImage: "url(/ClientProfile2.jpeg)" }}
        >
          <div className="container mx-auto px-4">
            <div
              className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg -mt-64"
              style={{ opacity: "0.85" }}
            >
              <div className="px-6">
                <div className="flex flex-wrap justify-center ">
                  <div className="w-full lg:w-3/12  mb-5 px-4 lg:order-2 flex justify-center py-7">
                    <div className="relative">
                      {!userInfo.data.message.profile ? (
                        <img
                          alt="..."
                          src="/dummy_profile.jpg"
                          className="shadow-xl rounded-full h-auto align-middle border-none -m-16 -ml-20 lg:-ml-16 max-w-150-px object-cover"
                        />
                      ) : (
                        <img
                          src={userInfo.data.message.profile}
                          alt="Profile"
                          className="shadow-xl rounded-full h-auto align-middle border-none -m-16 -ml-20 lg:-ml-16 max-w-150-px object-cover"
                        />
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-center flex flex-col justify-center items-center mt-16">
                  <h3 className="text-4xl font-semibold leading-normal  text-blueGray-700 mb-2">
                    {userInfo?.data?.message?.Fname}
                  </h3>
                  <button className="text-white bg-graydark rounded p-2" onClick={()=>setAdminChatOpen(true)}>DM ADMIN</button>
                  {/* <p className="text-black bg-gray rounded p-2  m-2" >Wallet :₹ {walletData.wallet} </p> */}
                </div>

                <div className="mt-10 py-10 border-t border-blueGray-200 text-center">
                  <div className="flex flex-wrap justify-evenly">
                    <div
                      className={`rounded-r-xl overflow-x-auto bg-gray-200 ${
                        screenWidth <= 1020
                          ? "flex flex-row w-full"
                          : "flex flex-col w-1/4"
                      }`}
                    >
                      <ul
                        className={`flex ${
                          window.innerWidth <= 1020 ? "flex-row" : "flex-col"
                        } py-4`}
                      >
                        <li>
                          <button
                            type="button"
                            className={`flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 ${
                              activeSection === "profile"
                                ? "text-gray-800 font-bold"
                                : "text-gray-500"
                            }`}
                            onClick={() => handleSectionClick("profile")}
                          >
                            <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400">
                              <i className="bx bx-home"></i>
                            </span>
                            <span className="text-sm font-medium">Profile</span>
                          </button>
                        </li>
                        
                        
                        <li>
                          <button
                            type="button"
                            className={`flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 ${
                              activeSection === "marked"
                                ? "text-gray-800 font-bold"
                                : "text-gray-500"
                            }`}
                            onClick={() => handleSectionClick("marked")}
                          >
                            <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400">
                              <i className="bx bx-shopping-bag"></i>
                            </span>
                            <span className="text-sm font-medium">Marked Bookings</span>
                          </button>
                        </li>
                        <li>
                          <button
                            type="button"
                            className={`flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 ${
                              activeSection === "requested"
                                ? "text-gray-800 font-bold"
                                : "text-gray-500"
                            }`}
                            onClick={() => handleSectionClick("requested")}
                          >
                            <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400">
                              <i className="bx bx-shopping-bag"></i>
                            </span>
                            <span className="text-sm font-medium">Requested bookings</span>
                          </button>
                        </li>
                        <li>
                          <button
                            type="button"
                            className={`flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 ${
                              activeSection === "booked"
                                ? "text-gray-800 font-bold"
                                : "text-gray-500"
                            }`}
                            onClick={() => handleSectionClick("booked")}
                          >
                            <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400">
                              <i className="bx bx-user"></i>
                            </span>
                            <span className="text-sm font-medium">Booked</span>
                          </button>
                        </li>
                        <li>
                          <button
                            type="button"
                            className={`flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 ${
                              activeSection === "booked"
                                ? "text-gray-800 font-bold"
                                : "text-gray-500"
                            }`}
                            onClick={() => handleSectionClick("done")}
                          >
                            <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400">
                              <i className="bx bx-user"></i>
                            </span>
                            <span className="text-sm font-medium">Bookings Done</span>
                          </button>
                        </li>
                        <li>
                          <button
                            type="button"
                            className={`flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 ${
                              activeSection === "bids"
                                ? "text-gray-800 font-bold"
                                : "text-gray-500"
                            }`}
                            onClick={() => handleSectionClick("bids")}
                          >
                            <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400">
                              <i className="bx bx-drink"></i>
                            </span>
                            <span className="text-sm font-medium">
                              Auctions
                            </span>
                          </button>
                        </li>
                        
                        
                        <li>
                          <button
                            type="button"
                            className={`flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 ${
                              activeSection === "chats"
                                ? "text-gray-800 font-bold"
                                : "text-gray-500"
                            }`}
                            onClick={() => {
                              handleSectionClick("chats");
                              
                            }}
                          >
                            <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400">
                              <i className="bx bx-bell"></i>
                            </span>
                            <span className="text-sm font-medium">Chats</span>
                            <span className="ml-auto mr-6 text-sm bg-red-100 rounded-full px-3 py-px text-red-500">
                              {chats.length}
                            </span>
                          </button>
                        </li>
                        <li>
                          <button
                            type="button"
                            className={`flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 ${
                              activeSection === "logout"
                                ? "text-gray-800 font-bold"
                                : "text-gray-500"
                            }`}
                            onClick={() => handleSectionClick("logout")}
                          >
                            <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400">
                              <i className="bx bx-log-out"></i>
                            </span>
                            <span className="text-sm font-medium">Logout</span>
                          </button>
                        </li>
                      </ul>
                    </div>

                    {activeSection === "profile" && <ArtistProfileForm />}
                    {activeSection === "chats" && (
                      <ChatsClient
                        chats={chats}
                        onChatClick={handleChatClick}
                        setChats={setChats}
                      />
                    )}
                    {activeSection === "marked" && (
                      <BookingViewModal
                       message='Marked Users'
                       marked={markedData}
                       setChanges={setChanges}
                      />
                    )}
                    {activeSection === "requested" && (
                      <BookingViewModal
                       message='Requested Bookings'
                       marked={bookingReqData}
                       setChanges={setChanges}
                      />
                    )}
                    {activeSection === "booked" && (
                      <BookingViewModal
                       message='Booked'
                       marked={bookingConfirmData}
                       setChanges={setChanges}
                      
                      />
                    )}
                    {activeSection === "done" && (
                      <BookingViewModal
                       message='Bookings Done'
                       marked={doneData}
                       setChanges={setChanges}
                      
                      />
                    )}
                    {activeSection === "bids" && (
                      <AuctionList
                       auctions={currentbids}
                       onSelectAuction={handleSelectAuction}
                       setIsAuctionDetModalOpen={setIsAuctionDetModalOpen}
                      />
                    )}
                    
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {selectedChat && chats.length>0 && (
        <ChatComponent
          isOpen={!!selectedChat}
          onClose={() => setSelectedChat(null)}
          receiverId={selectedChat.userId._id}
          Fname={selectedChat.userId.Fname}
          Lname={selectedChat.userId.Lname}
          profile={selectedChat.userId.profile}
          chats={chats}
        />
      )}
      {AdminChatOpen && (
        <ChatComponent
          isOpen={AdminChatOpen}
          onClose={() => setAdminChatOpen(false)}
          receiverId={admin?._id||''}
          Fname={admin?.Fname ||''}
          Lname={admin?.Lname ||''}
          profile={admin?.profile||''}
        />
      )}
      {isAuctionDetModalOpen && selectedAuction && (
        <AuctionDetailModal
          auction={selectedAuction}
          onClose={() => setIsAuctionDetModalOpen(false)}
          onDelete={() => handleDeleteAuction(selectedAuction._id)}
          onOpenBiddingModal={() => setIsBiddingModalOpen(true)}
          SetselectedAuction={setSelectedAuction}
          
          
        />
      )}
      {isBiddingModalOpen && (
        <BiddingModal
          initialBid={selectedAuction?.initial || 0}
          bids={selectedAuction?.bids||[]}
          onClose={() => setIsBiddingModalOpen(false)}
          onBid={handleBid}
          auctionId={selectedAuction?._id || ""}
          SetselectedAuction={setSelectedAuction}
        />
      )}
    </>
  );
};

export default ArtistProfilePage;
