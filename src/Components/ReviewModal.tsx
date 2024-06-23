import React, { useState } from "react";
import ReactStars from "react-rating-stars-component";

interface ReviewModalProps {
  stars: number;
  review: string;
  onClose: () => void;
  onSubmit: (stars: number, review: string) => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ stars, review, onClose, onSubmit }) => {
  const [localStars, setLocalStars] = useState(stars);
  const [localReview, setLocalReview] = useState(review);

  const handleStarsChange = (newRating: number) => {
    setLocalStars(newRating);
  };

  const handleReviewChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalReview(e.target.value);
  };

  const handleSubmit = () => {
    onSubmit(localStars, localReview);
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg relative">
        <span className="absolute top-0 right-0 p-4 cursor-pointer" onClick={onClose}>
          &times;
        </span>
        <h2 className="text-xl mb-4">Review</h2>
        <label className="block mb-2">Stars:</label>
        <ReactStars
          count={5}
          value={localStars}
          onChange={handleStarsChange}
          size={30}
          isHalf={false}
          activeColor="#ffd700"
          emptyIcon={<i className="far fa-star"></i>}
          fullIcon={<i className="fa fa-star"></i>}
          classNames="mb-4"
        />
        <label className="block mb-2">Review:</label>
        <textarea
          value={localReview}
          onChange={handleReviewChange}
          className="w-full mb-4 p-2 border rounded"
        ></textarea>
        <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded">
          Submit
        </button>
      </div>
    </div>
  );
};

export default ReviewModal;
