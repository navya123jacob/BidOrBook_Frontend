import React, { useState, ChangeEvent, FormEvent, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import Modal from '../User/cropper/Modal';
import { useCreateauctionMutation } from '../../redux/slices/Api/EndPoints/auctionEndPoints';
import { RootState } from '../../redux/slices/Reducers/types';
import { useSelector } from 'react-redux';

interface AuctionModalProps {
  onClose: () => void;
  setAuctions: React.Dispatch<React.SetStateAction<any[]>>;
  auctions: any[];
}

const AuctionModal: React.FC<AuctionModalProps> = ({ onClose, setAuctions, auctions }) => {
  const userInfo = useSelector((state: RootState) => state.client.userInfo);
  const [createAuction, { isLoading }] = useCreateauctionMutation();
  const avatarUrl = useRef<string>('');
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [auctionData, setAuctionData] = useState<{ userid: string; name: string; description: string; endingdate: string; initialBid: string; image: string }>({
    userid: userInfo.data.message._id,
    name: '',
    description: '',
    endingdate: '',
    initialBid: '',
    image: '',
  });

  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<{ name?: string; description?: string; endingdate?: string; initialBid?: string; image?: string }>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setAuctionData({ ...auctionData, [name]: value });
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors: { name?: string; description?: string; endingdate?: string; initialBid?: string; image?: string } = {};
    const today = new Date();
    const sixMonthsFromToday = new Date();
    sixMonthsFromToday.setMonth(sixMonthsFromToday.getMonth() + 6);
    const selectedDate = new Date(auctionData.endingdate);

    if (!auctionData.name.trim()) newErrors.name = 'Name is required';
    if (!auctionData.description.trim()) newErrors.description = 'Description is required';
    if (!auctionData.endingdate) newErrors.endingdate = 'Ending date is required';
    else if (selectedDate <= today) newErrors.endingdate = 'Ending date must be in the future';
    else if (selectedDate > sixMonthsFromToday) newErrors.endingdate = 'Ending date must be within 6 months from today';
    if (!auctionData.initialBid) newErrors.initialBid = 'Initial bid is required';
    else if (Number(auctionData.initialBid) <= 100) newErrors.initialBid = 'Initial bid must be greater than 100';
    if (!file) newErrors.image = 'Image is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
        
      const formData = new FormData();
      formData.append('userId', auctionData.userid);
      formData.append('name', auctionData.name);
      formData.append('description', auctionData.description);
      formData.append('endingdate', auctionData.endingdate);
      formData.append('initial', auctionData.initialBid);
      if (file) formData.append('image', file);
      try {
        const response = await createAuction(formData).unwrap();
        setAuctions([...auctions, response.auction]);
        onClose();
      } catch (error) {
        console.error('Failed to create auction:', error);
      }
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
    const newFile = new File([blob], 'newauction.png', { type: 'image/png' });
    setFile(newFile);
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="relative bg-white bg-opacity-90 text-gray-800 p-6 rounded-lg w-96">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-2 right-2 p-1 rounded-full bg-gray-300 text-gray-800 hover:bg-gray-400 focus:outline-none"
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
        <h2 className="text-lg font-semibold mb-4">Create Auction</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={auctionData.name}
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
              value={auctionData.description}
              onChange={handleChange}
              rows={4}
              className={`block w-full mt-1 p-2 border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${errors.description ? 'border-red-500' : ''}`}
            ></textarea>
            {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="endingdate" className="block text-sm font-medium text-gray-700">Ending Date</label>
            <input
              type="date"
              id="endingdate"
              name="endingdate"
              value={auctionData.endingdate}
              onChange={handleChange}
              className={`block w-full mt-1 p-2 border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${errors.endingdate ? 'border-red-500' : ''}`}
            />
            {errors.endingdate && <p className="text-red-500 text-sm">{errors.endingdate}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="initialBid" className="block text-sm font-medium text-gray-700">Initial Bid</label>
            <input
              type="number"
              id="initialBid"
              name="initialBid"
              value={auctionData.initialBid}
              onChange={handleChange}
              className={`block w-full mt-1 p-2 border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${errors.initialBid ? 'border-red-500' : ''}`}
            />
            {errors.initialBid && <p className="text-red-500 text-sm">{errors.initialBid}</p>}
          </div>
          <div className="mt-1">
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className=" w-full px-5 py-3 text-black transition duration-500 ease-in-out transform border border-transparent rounded-lg bg-gray-2 focus:outline-none focus:border-transparent focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-300 flex items-center justify-center"
            >
              <FontAwesomeIcon icon={faPlus} className="text-black mr-2" />
              Upload
            </button>
            {errors.image && <p className="text-red-500 text-sm">{errors.image}</p>}
            {avatarUrl.current && <img src={avatarUrl.current} alt="" className="mt-2 w-24 h-24 rounded-full mx-auto" />}
          </div>
          <div className="flex justify-end">
            <button type="button" onClick={onClose} className="mr-2 px-4 mt-4 py-2 text-gray-2 font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-gray-2 bg-form-strokedark">Cancel</button>
            <button
              type="submit"
              className={`flex items-center justify-center mt-4 w-full px-10 py-4 text-base font-medium text-center text-white transition duration-500 ease-in-out transform rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                isLoading
                  ? 'bg-teal-900 hover:bg-form-strokedark'
                  : 'bg-graydark hover:bg-blue-900'
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

export default AuctionModal;
