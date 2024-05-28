import React, { useState, ChangeEvent, FormEvent, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import Modal from '../User/cropper/Modal';
import { useCreatepostMutation } from '../../redux/slices/Api/EndPoints/clientApiEndPoints';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/slices/Reducers/types';

interface PostData {
  name: string;
  description: string;
  image: string;
}

interface PostModalProps {
  onClose: () => void;
  setUsersWithPosts: React.Dispatch<React.SetStateAction<any[]>>;
  usersWithPosts: any[];
}

const PostModal: React.FC<PostModalProps> = ({ onClose, setUsersWithPosts, usersWithPosts }) => {
  const userInfo = useSelector((state: RootState) => state.client.userInfo);
  const [createPost, { isLoading }] = useCreatepostMutation();
  const avatarUrl = useRef<string>('');
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [postData, setPostData] = useState<PostData>({
    name: '',
    description: '',
    image: '',
  });

  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<{ name?: string; description?: string; image?: string }>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPostData({ ...postData, [name]: value });
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors: { name?: string; description?: string; image?: string } = {};
    if (!postData.name.trim()) newErrors.name = 'Name is required';
    if (!postData.description.trim()) newErrors.description = 'Description is required';
    if (!file) newErrors.image = 'Image is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const formData = new FormData();
      formData.append('name', postData.name);
      formData.append('description', postData.description);
      if (file) formData.append('image', file);
      formData.append('userid', userInfo.data.message._id);
      const response = await createPost(formData);
      if ('data' in response) {
        setUsersWithPosts([response.data.post, ...usersWithPosts]);
      }
      onClose();
    }
  };

  const updateAvatar = (imgSrc: string) => {
    avatarUrl.current = imgSrc;
    const byteCharacters = atob(imgSrc.split(',')[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'image/png' });
    const newFile = new File([blob], 'newpost.png', { type: 'image/png' });
    setFile(newFile);
  };

  return (
    
    
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="relative bg-white bg-opacity-95 text-gray-800 p-6 rounded-lg w-96">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-2 right-2 p-1 rounded-full bg-gray-300 text-gray-800 hover:bg-gray-400 focus:outline-none"
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
        <h2 className="text-lg font-semibold mb-4">Create Post</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={postData.name}
              onChange={handleChange}
              className={`block w-full mt-1 p-2 border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${errors.name ? 'border-red-500' : ''}`}
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              id="description"
              name="description"
              value={postData.description}
              onChange={handleChange}
              rows={4}
              className={`block w-full mt-1 p-2 border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${errors.description ? 'border-red-500' : ''}`}
            ></textarea>
            {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
          </div>
          <div className="mt-1">
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="block w-full px-5 py-3 text-white transition duration-500 ease-in-out transform border border-transparent rounded-lg bg-gray-600 focus:outline-none focus:border-transparent focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-300 flex items-center justify-center"
            >
              <FontAwesomeIcon icon={faPlus} className="text-black mr-2" />
              Upload
            </button>
            {errors.image && <p className="text-red-500 text-sm">{errors.image}</p>}
            {avatarUrl.current && <img src={avatarUrl.current} alt="" className="mt-2 w-24 h-24 rounded-full mx-auto" />}
          </div>
          <div className="flex justify-end">
            <button type="button" onClick={onClose} className="mr-2 px-4 mt-4 py-2 bg-gray-300 text-gray-800 font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400">Cancel</button>
            <button
              type="submit"
              className={`flex items-center justify-center mt-4 w-full px-10 py-4 text-base font-medium text-center text-white transition duration-500 ease-in-out transform rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                isLoading
                  ? 'bg-teal-900 hover:bg-gray-600'
                  : 'bg-gray-800 hover:bg-blue-900'
              }`}
            >
              {isLoading ? 'Creating....' : 'Create'}
            </button>
          </div>
        </form>
      </div>
      {modalOpen && (
        <Modal
          updateAvatar={updateAvatar}
          closeModal={() => setModalOpen(false)}
        />
      )}
    </div>
    
  );
};

export default PostModal;
