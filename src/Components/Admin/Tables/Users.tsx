import React, { useState, useEffect } from "react";
import {
  useGetUsersAdminQuery,
  useBlockUserMutation,
} from "../../../redux/slices/Api/EndPoints/AdminEndpoints";
import { IUser } from "../../../types/user";
import AdminChatComponent from "../AdminChatBoxSingle";

const UserTable = () => {
  const { data: users = [], isLoading } = useGetUsersAdminQuery({});
  const [blockUser] = useBlockUserMutation();
  const [userData, setUserData] = useState<IUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [selectedInnerUser, setSelectedInnerUser] = useState<IUser | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);
  const [isInnerOpen, setIsInnerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  useEffect(() => {
    if (users.length > 0) {
      const formattedUsers = users.map((user: IUser) => ({
        ...user,
        name: `${user.Fname} ${user.Lname}`,
      }));
      setUserData(formattedUsers);
    }
  }, [users]);

  const handleBlockUser = async (userId: string) => {
    const response = await blockUser(userId);
    console.log(response);
    setUserData((prevData) =>
      prevData.map((user) =>
        user._id === userId ? { ...user, is_blocked: !user.is_blocked } : user
      )
    );
  };

  const handleOpenModal = (user: IUser) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };
  const handleUserModal = (user: IUser) => {
    setSelectedUser(user);
    setIsUserOpen(true);
  };
  const handleInnerUserModal = (user: any) => {
    setSelectedInnerUser(user);
    console.log(selectedInnerUser)
    setIsInnerOpen(true);
    console.log(isInnerOpen)
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };
  const handleInnerCloseModal = () => {
    setIsInnerOpen(false);
    setSelectedInnerUser(null);
  };
  const handleUserCloseModal = () => {
    setIsUserOpen(false);
    setSelectedUser(null);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const filteredUsers = userData.filter((user) =>
    `${user.Fname} ${user.Lname}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full overflow-x-auto">
        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            placeholder="Search by name"
            value={searchTerm}
            onChange={handleSearchChange}
            className="p-2 border rounded text-black"
          />
        </div>
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                Name
              </th>
              <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                Email
              </th>
              <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                Chat
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                Status
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                Spams
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user, key) => (
              <tr key={key}>
                <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                  <h5 className="font-medium text-black dark:text-white">
                    {user.Fname} {user.Lname}
                  </h5>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black dark:text-white">{user.email}</p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <button
                    className="dark:bg-graydark dark:text-white bg-meta-2 text-black rounded p-2"
                    onClick={() => handleOpenModal(user)}
                  >
                    DM
                  </button>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p
                    className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${
                      user.is_blocked
                        ? "bg-danger text-danger"
                        : "bg-success text-success"
                    }`}
                  >
                    {user.is_blocked ? "Blocked" : "Active"}
                  </p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  {user.spam?.length === 0 ? (
                    <p className="text-black dark:text-white">None</p>
                  ) : (
                    <button
                      className="dark:bg-graydark dark:text-white bg-meta-2 text-black rounded p-2"
                      onClick={() => handleUserModal(user)}
                    > 
                      {user.spam?.length} Spams
                    </button>
                  )}
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <div className="flex items-center space-x-3.5">
                    <button
                      className="hover:text-primary"
                      onClick={() => handleOpenModal(user)}
                    >
                      <svg
                        className="fill-current"
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M8.99981 14.8219C3.43106 14.8219 0.674805 9.50624 0.562305 9.28124C0.47793 9.11249 0.47793 8.88749 0.562305 8.71874C0.674805 8.49374 3.43106 3.20624 8.99981 3.20624C14.5686 3.20624 17.3248 8.49374 17.4373 8.71874C17.5217 8.88749 17.5217 9.11249 17.4373 9.28124C17.3248 9.50624 14.5686 14.8219 8.99981 14.8219ZM1.85605 8.99999C2.4748 10.0406 4.89356 13.5562 8.99981 13.5562C13.1061 13.5562 15.5248 10.0406 16.1436 8.99999C15.5248 7.95936 13.1061 4.44374 8.99981 4.44374C4.89356 4.44374 2.4748 7.95936 1.85605 8.99999Z"
                          fill=""
                        />
                        <path
                          d="M9 11.3906C7.67812 11.3906 6.60938 10.3219 6.60938 9C6.60938 7.67813 7.67812 6.60938 9 6.60938C10.3219 6.60938 11.3906 7.67813 11.3906 9C11.3906 10.3219 10.3219 11.3906 9 11.3906ZM9 7.875C8.38125 7.875 7.875 8.38125 7.875 9C7.875 9.61875 8.38125 10.125 9 10.125C9.61875 10.125 10.125 9.61875 10.125 9C10.125 8.38125 9.61875 7.875 9 7.875Z"
                          fill=""
                        />
                      </svg>
                    </button>
                    <button
                      className="hover:text-primary"
                      onClick={() => handleBlockUser(user._id)}
                    >
                      {user.is_blocked ? "Unblock" : "Block"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            
          </tbody>
        </table>
        {!currentUsers.length && (
                <div className="text-center py-6 text-black dark:text-white">
                  No Users
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
            disabled={indexOfLastUser >= filteredUsers.length}
            className="p-2 border rounded"
          >
            Next
          </button>
        </div>
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
      {isUserOpen && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center z-40">
          <div
            className="fixed inset-0 bg-black opacity-50"
            onClick={handleUserCloseModal}
          ></div>
          <div className="bg-white rounded-lg p-6 z-10">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {selectedUser.Fname} {selectedUser.Lname}
              </h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={handleUserCloseModal}
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
              src={selectedUser.profile}
              className="w-24 h-24 rounded-full mx-auto mb-4"
            />
            <p className="text-gray-700">Email: {selectedUser.email}</p>
            <p className="text-gray-700">
              District: {selectedUser.location.district}
            </p>
            <p className="text-gray-700">
              State: {selectedUser.location.state}
            </p>
            <p className="text-gray-700">
              Country: {selectedUser.location.country}
            </p>
            <div className="mt-4">
              {selectedUser && selectedUser.spam?.length > 0 ? (
                <div>
                  <h3 className="text-lg font-bold mb-2">Spam Reports:</h3>
                  <ul>
                    {selectedUser.spam?.map((spam, index) => (
                      <li key={index} className="mb-2">
                        <p className="text-gray-700">
                          <strong>
                            {spam.userId.Fname} {spam.userId.Lname}:
                          </strong>{" "}
                          {spam.reason}
                        </p>
                        <button onClick={() => handleInnerUserModal(spam.userId)} className="rounded text-white bg-graydark p-2 mt-1">
                          DM
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-gray-700">No spam reports.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTable;
