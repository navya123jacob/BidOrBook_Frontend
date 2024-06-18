import React, { useState } from 'react';
import { Booking } from '../../types/booking';
import { Link } from 'react-router-dom';

interface Props {
    message: string;
    marked: Booking[];
}

const BookingViewModal: React.FC<Props> = ({ message, marked }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const totalPages = Math.ceil(marked.length / itemsPerPage);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const startIdx = (currentPage - 1) * itemsPerPage;
    const currentBookings = marked.slice(startIdx, startIdx + itemsPerPage);

    const renderUserRow = (booking: any) => {
        const user = booking.artistId;

        return (
            <div key={user._id} className="flex items-center justify-between py-2 px-4 border-b">
                <div className="flex items-center">
                    <img
                        src={user.profile || 'src/assets/dummy_profile.jpg'}
                        alt={`${user.Fname} ${user.Lname}`}
                        className="w-10 h-10 rounded-full object-cover mr-4"
                    />
                    <span>{user.Fname} {user.Lname}</span>
                </div>
                <Link to={`/artprof/client?id=${user._id}`} className=" text-white px-3 py-1 rounded bg-graydark">Go to Profile</Link>
            </div>
        );
    };

    return (
        <div className="bg-gray-200 flex flex-col items-center justify-center w-full lg:w-1/2 space-y-6 p-6 h-full">
            <h2 className="text-2xl font-bold mb-4">{message}</h2>
            <div className="chats-list w-full space-y-4 overflow-y-auto h-80">
                {marked.length > 0 ? currentBookings.map(renderUserRow) : <p>No {message}</p>}
            </div>
            {marked.length > 0 && (
                <div className="flex justify-between items-center mt-4 w-full">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className=" bg-gray text-black px-4 py-2 rounded disabled:bg-gray-2"
                    >
                        Previous
                    </button>
                    <span className="text-gray-700 font-medium">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className=" text-black px-4 py-2 rounded disabled:bg-gray-2 bg-gray"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default BookingViewModal;
