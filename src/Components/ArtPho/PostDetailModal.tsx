import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/slices/Reducers/types';

interface PostDetailModalProps {
  post: {
    image: string;
    likes: number;
    comments: number;
    description: string;
    name: string;
    _id: string;
  };
  onClose: () => void;
  onDelete?: () => void;
}

const PostDetailModal: React.FC<PostDetailModalProps> = ({ post, onClose, onDelete }) => {
  const userInfo = useSelector((state: RootState) => state.client.userInfo);
  const [showLikes, setShowLikes] = useState(false);
  const [likesList, setLikesList] = useState<string[]>([]);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const handleLikesClick = () => {
    const mockLikesList = ['User1', 'User2', 'User3'];
    setLikesList(mockLikesList);
    setShowLikes(true);
  };

  const handleDeleteClick = () => {
    setShowConfirmDelete(true);
  };

  const handleConfirmDelete = () => {
    setShowConfirmDelete(false);
    onDelete?.();
  };

  const handleCancelDelete = () => {
    setShowConfirmDelete(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white bg-opacity-30 p-4 rounded-lg max-w-lg mx-auto text-gray-300 relative">
        <button
          className="absolute top-2 right-2 text-white text-lg"
          onClick={onClose}
        >
          &times;
        </button>

        <img src={post.image} alt="Post" className="w-full h-auto rounded-lg mb-4" />
        <h2 className="text-xl font-bold mb-2">{post.name}</h2>
        <p className="text-lg font-semibold mb-2">{post.description}</p>
        <div className="flex justify-between items-center">
          <span className="cursor-pointer" onClick={handleLikesClick}>
            {post.likes} Likes
          </span>
          {!userInfo.client && (<button
            className="bg-red-500 text-white px-2 py-1 rounded"
            onClick={handleDeleteClick}
          >
            Delete
          </button>)}
        </div>
      </div>

      {showLikes && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white bg-opacity-30 p-4 rounded-lg max-w-sm mx-auto text-gray-300 relative">
            <button
              className="absolute top-2 right-2 text-black bg-gray-200 rounded-full p-2"
              onClick={() => setShowLikes(false)}
            >
              X
            </button>
            <h3 className="text-lg font-bold mb-4">Liked by:</h3>
            <ul>
              {likesList.map((user, index) => (
                <li key={index} className="mb-2">{user}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white bg-opacity-90 p-4 rounded-lg max-w-sm mx-auto text-gray-900 relative">
            <h3 className="text-lg font-bold mb-4">Confirm Delete</h3>
            <p>Are you sure you want to delete this post?</p>
            <div className="flex justify-end mt-4">
              <button
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded mr-2"
                onClick={handleCancelDelete}
              >
                Cancel
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={handleConfirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostDetailModal;
