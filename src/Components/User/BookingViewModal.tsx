import React from 'react';
import { Booking } from '../../types/booking';
import { Link } from 'react-router-dom';

interface Props {
    message: string;
    marked: Booking[];
}

const BookingViewModal: React.FC<Props> = ({ message, marked }) => {
    const renderUserRow = (booking: Booking) => {
        const user = booking.clientId; 

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
                <Link to={`/artprof/client?id=${user._id}`} className="bg-blue-500 text-white px-3 py-1 rounded">Go to Profile</Link>
            </div>
        );
    };

    return (
        <div className="bg-gray-200 flex flex-col items-center justify-center w-full lg:w-1/2 space-y-6 p-6 h-full">
            <h2 className="text-2xl font-bold mb-4">{message}</h2>
            <div className="chats-list w-full space-y-4 overflow-y-auto h-80">
                {marked.length > 0 ? marked.map(renderUserRow) : <p>No marked users.</p>}
            </div>
        </div>
    );
};

export default BookingViewModal;
