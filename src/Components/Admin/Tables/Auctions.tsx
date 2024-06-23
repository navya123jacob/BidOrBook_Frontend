import React, { useState, useEffect } from "react";
import { AdIAuction } from "../../../types/auction";
import { User, Spam } from "../../../types/user";
import ConfirmationModal from "../../User/CancelConfirmModal";
import ChatComponent from "../../ChatSingle";
import { useAdmindeleteAuctionMutation,useGetAllAuctionsWithUserDetailsQuery } from "../../../redux/slices/Api/EndPoints/AdminEndpoints";
import AdminChatComponent from "../AdminChatBoxSingle";

const AuctionTable = () => {
  const {
    data: auctions = { auctions: [] },
    isLoading,
    refetch,
  } = useGetAllAuctionsWithUserDetailsQuery({});
  const [deleteAuction, { isLoading: isDeleting }] = useAdmindeleteAuctionMutation();
  
  const [selectedAuction, setSelectedAuction] = useState<AdIAuction | null>(
    null
  );
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedInnerUser, setSelectedInnerUser] = useState<User | null>(null);
  const [isInnerOpen, setIsInnerOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuctionModalOpen, setIsAuctionModalOpen] = useState(false);
  const [isBidsModalOpen, setIsBidsModalOpen] = useState(false);
  const [isSpamModalOpen, setIsSpamModalOpen] = useState(false);
  const [selectedSpamUser, setSelectedSpamUser] = useState<any | null>(null);
  const [isSpamUserModalOpen, setIsSpamUserModalOpen] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState("");
  const bookingsPerPage = 10;

 

  const handleOpenAuctionModal = (auction: AdIAuction) => {
    setSelectedAuction(auction);
    setIsAuctionModalOpen(true);
  };

  const handleCloseAuctionModal = () => {
    setIsAuctionModalOpen(false);
    setSelectedAuction(null);
  };

  const handleOpenBidsModal = (auction: AdIAuction) => {
    setSelectedAuction(auction);
    setIsBidsModalOpen(true);
  };

  const handleCloseBidsModal = () => {
    setIsBidsModalOpen(false);
    setSelectedAuction(null);
  };
  const handleOpenModal = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };
  const handleInnerUserModal = (user: any) => {
    setSelectedInnerUser(user);
    setIsInnerOpen(true);
  };
  const handleInnerCloseModal = () => {
    setIsInnerOpen(false);
    setSelectedInnerUser(null);
  };
  const handleOpenSpamModal = (auction: AdIAuction) => {
    setSelectedAuction(auction);
    setIsSpamModalOpen(true);
  };
  const handleCloseSpamModal = () => {
    setIsSpamModalOpen(false);
    setSelectedAuction(null);
  };
  const handleOpenSpamUserModal = (user: any) => {
    setSelectedSpamUser(user);
    setIsSpamUserModalOpen(true);
  };
  const handleCloseSpamUserModal = () => {
    setIsSpamUserModalOpen(false);
    setSelectedSpamUser(null);
  };
  const confirmDelete = (auction: AdIAuction) => {
    setSelectedAuction(auction);
    setShowConfirmationModal(true);
  };
  const cancelDelete = () => {
    setShowConfirmationModal(false);
  };

  const handleConfirmDelete = () => {
    handleDelete();
    setShowConfirmationModal(false);
  };
  const handleDelete = async () => {
    try {
      await deleteAuction({
        auctionId: selectedAuction?._id || "",
        userId: selectedAuction?.userId._id || "",
      }).unwrap();
      setShowConfirmationModal(false);
      refetch();
    } catch (error) {
      console.error("Error deleting auction:", error);
    }
  };
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setFilterStatus(e.target.value);
    setCurrentPage(1);
  };

  const filteredBookings = auctions.auctions.filter((auction: AdIAuction) => {
    const searchTermRegex = new RegExp(
      searchTerm.toLowerCase().split(" ").join("\\s*")
    );
    const matchesSearchTerm =
      auction.name.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
      searchTermRegex.test(
        `${auction.userId.Fname.toLowerCase()} ${auction.userId.Lname.toLowerCase()}`
      );
    const matchesStatus = filterStatus
      ? (filterStatus === "active" && auction.status === "active") ||
        (filterStatus === "inactive" && auction.status === "inactive")
      : true;
    return matchesSearchTerm && matchesStatus;
  });
  const indexOfLastAuction = currentPage * bookingsPerPage;
  const indexOfFirstAuction = indexOfLastAuction - bookingsPerPage;
  const currentAuction = filteredBookings.slice(
    indexOfFirstAuction,
    indexOfLastAuction
  );
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  if (isLoading) {
    return <p>Loading...</p>;
  }
  // if (!Array.isArray(auctionsData)) {
  //   return <div>Data is not an array</div>;
  // }

  return (
    <>
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="max-w-full overflow-x-auto">
          <div className="flex justify-between items-center mb-4">
            <input
              type="text"
              placeholder="Search by name"
              value={searchTerm}
              onChange={handleSearchChange}
              className="p-2 border rounded text-black dark:text-white bg-white dark:bg-boxdark"
            />
            <select
              onChange={handleStatusFilterChange}
              className="p-2 border rounded text-black dark:text-white ml-4 focus:outline-none bg-white dark:bg-boxdark focus:ring-2 focus:ring-blue-500 focus:border-transparent "
            >
              <option value="">All Status</option>
              <option value="active">active</option>
              <option value="inactive">inactive</option>
            </select>
          </div>
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                  Auction Name
                </th>
                <th className="min-w-[200px] py-4 px-4 font-medium text-black dark:text-white">
                  Owner Name
                </th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                  Starting Date
                </th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                  Ending Date
                </th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                  Chat
                </th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                  Bids
                </th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                  Spams
                </th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                  Status
                </th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {
                currentAuction.map((auction: AdIAuction, key: number) => (
                  <tr key={key}>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <button
                        className="dark:bg-graydark dark:text-white bg-meta-2 text-black rounded p-2"
                        onClick={() => handleOpenAuctionModal(auction)}
                      >
                        {auction.name}
                      </button>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <h5 className="font-medium text-black dark:text-white">
                        {auction.userId.Fname} {auction.userId.Lname}
                      </h5>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {new Date(auction.startingdate).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {new Date(auction.endingdate).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <button
                        className="dark:bg-graydark dark:text-white bg-meta-2 text-black rounded p-2"
                        onClick={() => handleOpenModal(auction.userId)}
                      >
                        DM
                      </button>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <button
                        className="dark:bg-graydark dark:text-white bg-meta-2 text-black rounded p-2"
                        onClick={() => handleOpenBidsModal(auction)}
                      >
                        {auction.bids.length} Bids
                      </button>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      {auction.spam?.length === 0 ? (
                        <p className="text-black dark:text-white">None</p>
                      ) : (
                        <button
                          className="dark:bg-graydark dark:text-white bg-meta-2 text-black rounded p-2"
                          onClick={() => handleOpenSpamModal(auction)}
                        >
                          {auction.spam?.length} Spams
                        </button>
                      )}
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <h5 className="font-medium text-black dark:text-white">
                        {auction.status}
                      </h5>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <div className="flex items-center space-x-3.5">
                        <button
                          onClick={() => confirmDelete(auction)}
                          className="bg-red-500 text-white px-4 py-2 rounded mr-2"
                          disabled={isDeleting}
                        >
                          {isDeleting &&
                          selectedAuction &&
                          auction._id == selectedAuction._id
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              
            </tbody>
          </table>
          {!currentAuction.length && (
                <div className="text-center py-6 text-black dark:text-white">
                  No Auctions
                </div>
              )}
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 border rounded"
            >
              Previous
            </button>
            <p>Page {currentPage}</p>
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={indexOfLastAuction >= filteredBookings.length}
              className="p-2 border rounded"
            >
              Next
            </button>
          </div>
        </div>

        {isAuctionModalOpen && selectedAuction && (
          <div className="fixed inset-0 flex items-center justify-center z-40">
            <div
              className="fixed inset-0 bg-black opacity-50"
              onClick={handleCloseAuctionModal}
            ></div>
            <div className="bg-white rounded-lg p-6 z-10">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">{selectedAuction.name}</h2>
                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={handleCloseAuctionModal}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </button>
              </div>
              <img
                src={selectedAuction.image}
                alt={selectedAuction.name}
                className="mb-4 w-80"
              />
              <p className="text-gray-700">{selectedAuction.description}</p>
              <p className="text-gray-700">
                Initial Payment:₹ {selectedAuction.initial}
              </p>
              <p className="text-gray-700">Status: {selectedAuction.status}</p>
              {selectedAuction.status === "inactive" &&
                selectedAuction.bids.length > 0 && (
                  <div>
                    <p className="text-gray-700">
                      Winner:{" "}
                      {
                        selectedAuction.bids[selectedAuction.bids.length - 1]
                          .userId.Fname
                      }{" "}
                      {
                        selectedAuction.bids[selectedAuction.bids.length - 1]
                          .userId.Lname
                      }
                    </p>
                    <p className="text-gray-700">
                      Payment Status:{" "}
                      {selectedAuction.payment ? "Paid" : "Not Paid"}
                    </p>
                    <p className="text-gray-700">
                      Payment Method: {selectedAuction.paymentmethod}
                    </p>
                    <p className="text-gray-700">
                Payment:₹ {selectedAuction.bids[selectedAuction.bids.length - 1].amount}
              </p>
                  </div>
                )}
              {selectedAuction.status === "inactive" &&
                selectedAuction.bids.length == 0 && (
                  <div>
                    <p className="text-gray-700">No one participate </p>
                  </div>
                )}
            </div>
          </div>
        )}

        {isBidsModalOpen && selectedAuction && (
          <div className="fixed inset-0 flex items-center justify-center z-40">
            <div
              className="fixed inset-0 bg-black opacity-50"
              onClick={handleCloseBidsModal}
            ></div>
            <div className="bg-white rounded-lg p-6 z-10">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-graydark">Bids</h2>
                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={handleCloseBidsModal}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </button>
              </div>
              <ul>
                {selectedAuction.bids.map((bid, index) => (
                  <li key={index} className="mb-2">
                    <div className="flex items-center space-x-3">
                      <img
                        src={bid.userId.profile}
                        alt="Profile"
                        className="w-8 h-8 rounded-full"
                      />
                      <p className="text-gray-700">
                        <strong>
                          {bid.userId.Fname} {bid.userId.Lname}:
                        </strong>{" "}
                        {bid.amount}
                      </p>
                      <button
                        className="bg-graydark text-white rounded p-2"
                        onClick={() => handleInnerUserModal(bid.userId)}
                      >
                        DM
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
      {isModalOpen && selectedUser && (
        <AdminChatComponent
          receiverId={selectedUser._id}
          onClose={handleCloseModal}
          isOpen={isModalOpen}
          Fname={selectedUser.Fname}
          Lname={selectedUser.Lname}
          profile={selectedUser.profile}
          admin={true}
        />
      )}
      {isInnerOpen && selectedInnerUser && (
        <AdminChatComponent
          receiverId={selectedInnerUser._id}
          onClose={handleInnerCloseModal}
          isOpen={isInnerOpen}
          Fname={selectedInnerUser.Fname}
          Lname={selectedInnerUser.Lname}
          profile={selectedInnerUser.profile}
          admin={true}
        />
      )}
      {isSpamModalOpen && selectedAuction && (
        <div className="fixed inset-0 flex items-center justify-center z-40">
          <div
            className="fixed inset-0 bg-black opacity-50"
            onClick={handleCloseSpamModal}
          ></div>
          <div className="bg-white rounded-lg p-6 z-10">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl text-graydark font-bold">Spam Reports</h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={handleCloseSpamModal}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>
            <ul>
              {selectedAuction.spam.map((spam, index) => (
                <li key={index} className="mb-2">
                  <p className="text-gray-700">
                    <strong>
                      {spam.userId.Fname} {spam.userId.Lname}:
                    </strong>{" "}
                    {spam.reason}
                  </p>
                  <button
                    className="rounded text-white bg-graydark p-2 mt-1"
                    onClick={() =>
                      handleOpenSpamUserModal({
                        _id: spam.userId._id,
                        Fname: spam.userId.Fname,
                        Lname: spam.userId.Lname,
                        profile: spam.userId.profile,
                      })
                    }
                  >
                    DM
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      {isSpamUserModalOpen && selectedSpamUser && (
        <AdminChatComponent
          receiverId={selectedSpamUser._id}
          onClose={handleCloseSpamUserModal}
          isOpen={isSpamUserModalOpen}
          Fname={selectedSpamUser.Fname}
          Lname={selectedSpamUser.Lname}
          profile={selectedSpamUser.profile}
          admin={true}
        />
      )}
      {showConfirmationModal && selectedAuction && (
        <ConfirmationModal
          message="Are you sure you want to delete this auction?"
          onConfirm={handleConfirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </>
  );
};

export default AuctionTable;
