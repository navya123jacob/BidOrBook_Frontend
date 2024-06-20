import React, { useState, useEffect } from "react";
import { useGetPostsWithSpamQuery, useBlockPostMutation,useUnblockPostMutation } from "../../../redux/slices/Api/EndPoints/clientApiEndPoints";
import { IPost } from "../../../types/user";
import ChatComponent from "../../ChatSingle";
import ConfirmationModal from "../../User/CancelConfirmModal";


const PostTable = () => {
  const { data: posts = [], isLoading } = useGetPostsWithSpamQuery({});
  const [postsData, setPostsData] = useState<IPost[]>(posts);
  const [blockPost] = useBlockPostMutation(); 
  const [unblockPost] = useUnblockPostMutation()
  const [selectedPost, setSelectedPost] = useState<IPost | null>(null);
  const [selectedSpamUser, setSelectedSpamUser] = useState<any | null>(null);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isSpamModalOpen, setIsSpamModalOpen] = useState(false);
  const [isSpamUserModalOpen, setIsSpamUserModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [confirmationAction, setConfirmationAction] = useState<(() => void) | null>(null);

  useEffect(() => {
    setPostsData(posts);
  }, [posts]);

  const handleOpenPostModal = (post: IPost) => {
    setSelectedPost(post);
    setIsPostModalOpen(true);
  };

  const handleClosePostModal = () => {
    setIsPostModalOpen(false);
    setSelectedPost(null);
  };

  const handleOpenSpamModal = (post: IPost) => {
    setSelectedPost(post);
    setIsSpamModalOpen(true);
  };

  const handleCloseSpamModal = () => {
    setIsSpamModalOpen(false);
    setSelectedPost(null);
  };

  const handleOpenSpamUserModal = (user: any) => {
    setSelectedSpamUser(user);
    setIsSpamUserModalOpen(true);
  };

  const handleCloseSpamUserModal = () => {
    setIsSpamUserModalOpen(false);
    setSelectedSpamUser(null);
  };

  const handleBlockPost = async (id: string) => {
    await blockPost(id);
    setPostsData(postsData.map(post => 
      post._id === id ? { ...post, is_blocked: !post.is_blocked } : post
    ));
  };
  const handleUnBlockPost = async (id: string) => {
    await unblockPost(id);
    setPostsData(postsData.map(post => 
      post._id === id ? { ...post, is_blocked: !post.is_blocked } : post
    ));
  };

  const handleOpenConfirmationModal = (message: string, action: () => void) => {
    setConfirmationMessage(message);
    setConfirmationAction(() => action);
    setIsConfirmationModalOpen(true);
  };

  const handleCloseConfirmationModal = () => {
    setIsConfirmationModalOpen(false);
    setConfirmationAction(null);
    setConfirmationMessage("");
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                Image
              </th>
              <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                Post Name
              </th>
              <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white">
                Owner Name
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
            {postsData.map((post: IPost, key: number) => (
              <tr key={key}>
                <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                  <img src={post.image} alt={post.name} className="h-20 w-20 object-cover" />
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black dark:text-white">{post.name}</p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <h5 className="font-medium text-black dark:text-white">
                    {post.userid.Fname} {post.userid.Lname}
                  </h5>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p
                    className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${
                      post.is_blocked
                        ? "bg-danger text-danger"
                        : "bg-success text-success"
                    }`}
                  >
                    {post.is_blocked ? "Inactive" : "Active"}
                  </p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  {post.spam?.length === 0 ? (
                    <p className="text-black dark:text-white">None</p>
                  ) : (
                    <button
                      className="dark:bg-graydark dark:text-white bg-meta-2 text-black rounded p-2"
                      onClick={() => handleOpenSpamModal(post)}
                    >
                      {post.spam?.length} Spams
                    </button>
                  )}
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <div className="flex items-center space-x-3.5">
                    <button
                      className="hover:text-primary"
                      onClick={() => handleOpenPostModal(post)}
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
                      className="hover:text-primary dark:bg-graydark dark:text-white bg-meta-2 text-black rounded p-2"
                      onClick={() => 
                        handleOpenConfirmationModal(
                          post.is_blocked ? "Are you sure you want to unblock this post?" : "Are you sure you want to block this post?",
                          () => {if(post.is_blocked==false){handleBlockPost(post._id)}
                            else{handleUnBlockPost(post._id)}}
                        )
                      }
                    >
                      {post.is_blocked ? "Unblock" : "Block"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isPostModalOpen && selectedPost && (
        <div className="fixed inset-0 flex items-center justify-center z-40">
          <div
            className="fixed inset-0 bg-black opacity-50"
            onClick={handleClosePostModal}
          ></div>
          <div className="bg-white rounded-lg p-6 z-10">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{selectedPost.name}</h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={handleClosePostModal}
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
            <img src={selectedPost.image} className="w-full h-70 mb-4" />
            <p className="text-gray-700">{selectedPost.description}</p>
            <button
              className="mt-4 bg-graydark text-white rounded p-2"
              onClick={() =>
                handleOpenSpamUserModal({
                  _id: selectedPost.userid._id,
                  Fname: selectedPost.userid.Fname,
                  Lname: selectedPost.userid.Lname,
                  profile:selectedPost.userid.profile
                })
              }
            >
              DM {selectedPost.userid.Fname} {selectedPost.userid.Lname}
            </button>
          </div>
        </div>
      )}

      {isSpamModalOpen && selectedPost && (
        <div className="fixed inset-0 flex items-center justify-center z-40">
          <div
            className="fixed inset-0 bg-black opacity-50"
            onClick={handleCloseSpamModal}
          ></div>
          <div className="bg-white rounded-lg p-6 z-10">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Spam Reports</h2>
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
              {selectedPost.spam.map((spam, index) => (
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
                        profile:spam.userId.profile
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
        <ChatComponent
          receiverId={selectedSpamUser._id}
          onClose={handleCloseSpamUserModal}
          isOpen={isSpamUserModalOpen}
          Fname={selectedSpamUser.Fname}
          Lname={selectedSpamUser.Lname}
          profile={selectedSpamUser.profile}
          admin={true}
        />
      )}

      {isConfirmationModalOpen && confirmationMessage && confirmationAction && (
        <ConfirmationModal
          message={confirmationMessage}
          onConfirm={() => {
            confirmationAction();
            handleCloseConfirmationModal();
          }}
          onCancel={handleCloseConfirmationModal}
        />
      )}
    </div>
  );
};

export default PostTable;