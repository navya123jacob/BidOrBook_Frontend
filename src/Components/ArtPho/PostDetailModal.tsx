import React, { Dispatch, useState, SetStateAction } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/slices/Reducers/types';
import { useSpamPostMutation, useUnspamPostMutation } from '../../redux/slices/Api/EndPoints/clientApiEndPoints';
import ConfirmationModal from '../User/CancelConfirmModal';
import ReasonModal from '../User/ReasonModal';
import { Post } from '../../types/user';

interface PostDetailModalProps {
  post: Post;
  onClose: () => void;
  onDelete?: () => void;
  setUsersWithPosts?: Dispatch<SetStateAction<Post[]>>;
  setSelectedPost?: Dispatch<SetStateAction<Post | null>>;
}

const PostDetailModal: React.FC<PostDetailModalProps> = ({ post, onClose, onDelete, setUsersWithPosts, setSelectedPost }) => {
  const userInfo = useSelector((state: RootState) => state.client.userInfo);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showSpamConfirm, setShowSpamConfirm] = useState(false);
  const [showUnspamConfirm, setShowUnspamConfirm] = useState(false);
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [reason, setReason] = useState<string>('');
  const [spamPost] = useSpamPostMutation();
  const [unspamPost] = useUnspamPostMutation();

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

  const handleSpamClick = () => {
    setShowReasonModal(true);
  };

  const handleConfirmSpam = async () => {
    setShowSpamConfirm(false);
    try {
      await spamPost({ userId: userInfo.data.message._id, id: post._id, reason }).unwrap();
      
      if (setUsersWithPosts && setSelectedPost) {
        setSelectedPost((p) => {
          
          if (p === null) return null;
          return {
            ...p,
            spam: [...(p.spam || []), { userId: userInfo.data.message._id, reason }]
          };
        });
        setUsersWithPosts(prevPosts =>
          prevPosts.map(p =>
            p._id === post._id
              ? { ...p, spam: [...(p.spam || []), { userId: userInfo.data.message._id, reason }] }
              : p
          )
        );
      }
    } catch (error) {
      console.error('Failed to mark post as spam:', error);
    }
  };

  const handleReasonSubmit = () => {
    
    setShowReasonModal(false);
    handleConfirmSpam();
  };

  const handleUnspamClick = () => {
    setShowUnspamConfirm(true);
  };

  const handleConfirmUnspam = async () => {
    setShowUnspamConfirm(false);
    if (!userInfo || !userInfo.data || !userInfo.data.message) return;
    try {
      await unspamPost({ userId: userInfo.data.message._id, id: post._id }).unwrap();
      if (setUsersWithPosts && setSelectedPost) {
        setSelectedPost((prevPost) => {
          if (!prevPost) return prevPost;

          const updatedSpam = prevPost.spam?.filter((s) => s.userId !== userInfo.data.message._id) || [];

          return { ...prevPost, spam: updatedSpam };
        });
        setUsersWithPosts(prevPosts =>
          prevPosts.map(p =>
            p._id === post._id
              ? { ...p, spam: p.spam?.filter(s => s.userId !== userInfo.data.message._id) || [] }
              : p
          )
        );
      }
    } catch (error) {
      console.error('Failed to unmark post as spam:', error);
    }
  };

  const userHasSpammed = post.spam?.some(s => s.userId === userInfo?.data?.message?._id);

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
          {!userInfo.client && (
            <button
              className="bg-red-500 text-white px-2 py-1 rounded"
              onClick={handleDeleteClick}
            >
              Delete
            </button>
          )}
          {userInfo.client && (
            <>
              {!userHasSpammed ? (
                <button
                  className="bg-yellow-500 text-white px-2 py-1 rounded"
                  onClick={handleSpamClick}
                >
                  Spam
                </button>
              ) : (
                <button
                  className="bg-green-500 text-white px-2 py-1 rounded"
                  onClick={handleUnspamClick}
                >
                  Unspam
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {showConfirmDelete && (
        <ConfirmationModal
          message="Are you sure you want to delete this post?"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}

      {showReasonModal && (
        <ReasonModal
          onSubmit={handleReasonSubmit}
          onCancel={() => setShowReasonModal(false)}
          setReason={setReason}
          reason={reason}
        />
      )}

      {showSpamConfirm && (
        <ConfirmationModal
          message="Are you sure you want to mark this post as spam?"
          onConfirm={handleConfirmSpam}
          onCancel={() => setShowSpamConfirm(false)}
        />
      )}

      {showUnspamConfirm && (
        <ConfirmationModal
          message="Are you sure you want to unmark this post as spam?"
          onConfirm={handleConfirmUnspam}
          onCancel={() => setShowUnspamConfirm(false)}
        />
      )}
      
    </div>
  );
};

export default PostDetailModal;
