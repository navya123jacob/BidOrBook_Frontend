import React, { useState } from "react";
import ReactStars from "react-rating-stars-component";
import { IReview } from "../types/user";
interface ViewReviewsModalProps {
  reviews: IReview[];
  onClose: () => void;
}

const ViewReviewsModal: React.FC<ViewReviewsModalProps> = ({
  reviews,
  
  onClose,
}) => {
    
  const [viewMode, setViewMode] = useState<"reviews" | "starDistribution">(
    "reviews"
  );
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const starCounts = [5, 4, 3, 2, 1].map((star) => ({
    stars: star,
    count: reviews.filter((review) => review.stars === star).length,
  }));

  const totalPages = Math.ceil(reviews.length / itemsPerPage);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const paginatedReviews = reviews.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="custom-modal-review-background">
      <div className="custom-modal-review-content">
        <div className=" flex justify-between">
        <h2 className="text-xl mb-4 font-bold">Reviews</h2>
        <button onClick={onClose} >
        
        <i className="fas fa-times text-black"></i>
        </button></div>
        <div className="custom-review-options">
          <select
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value as "reviews" | "starDistribution")}
            className="custom-dropdown"
          >
            <option value="reviews">Reviews</option>
            <option value="starDistribution">Ratings</option>
          </select>
        </div>
        {viewMode === "reviews" ? (
          <div className="custom-review-section">
            {reviews.length === 0 ? (
              <p>No reviews or ratings</p>
            ) : (
              <ul>
                {paginatedReviews.map((review, index) => (
                  <li key={index} className="custom-review-item">
                    <p>
                      <strong>User ID:</strong>{" "}
                     
                      {review.userId.Fname} {review.userId.Lname}
                    </p>
                    <ReactStars
                      count={5}
                      value={review.stars}
                      size={20}
                      isHalf={true}
                      edit={false}
                      activeColor="#ffd700"
                    />
                    <p>{review.review}</p>
                  </li>
                ))}
              </ul>
            )}
            <div className="custom-pagination">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="custom-pagination-button"
              >
                Previous
              </button>
              <span>{currentPage} / {totalPages}</span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="custom-pagination-button"
              >
                Next
              </button>
            </div>
          </div>
        ) : (
          <div className="custom-star-distribution-section">
            <ul>
              {starCounts.map((starCount, index) => (
                <li key={index} className="custom-star-distribution-item">
                  <ReactStars
                    count={5}
                    value={starCount.stars}
                    size={20}
                    isHalf={false}
                    edit={false}
                    activeColor="#ffd700"
                  />
                  <span>{starCount.count} people</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewReviewsModal;
