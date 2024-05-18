import React, { useState } from 'react';

interface PostDetailModalProps {
  post: {
    image: string;
    likes: number;
    comments: number;
    description: string;
    name: string; // Add name property
  };
  onClose: () => void;
}

const PostDetailModal: React.FC<PostDetailModalProps> = ({ post, onClose }) => {
  const [showLikes, setShowLikes] = useState(false);
  const [likesList, setLikesList] = useState<string[]>([]); 

  const handleLikesClick = () => {
    
    const mockLikesList = ['User1', 'User2', 'User3'];
    setLikesList(mockLikesList);
    setShowLikes(true);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" >
      <div className="bg-white bg-opacity-30 p-4 rounded-lg max-w-lg mx-auto text-gray-300 relative">
        <button
          className="absolute top-2 right-2 text-white text-lg"
          onClick={onClose}
        >
          &times;
        </button>

        <img src={post.image} alt="Post" className="w-full h-auto rounded-lg mb-4" />
        <h2 className="text-xl font-bold mb-2">{post.name}</h2> {/* Display post name */}
        <p className="text-lg font-semibold mb-2">{post.description}</p>
        <div className="flex justify-between items-center">
          <span className="cursor-pointer" onClick={handleLikesClick}>
            {post.likes} Likes
          </span>
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
    </div>
  );
};

export default PostDetailModal;
