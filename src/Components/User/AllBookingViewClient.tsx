import React from 'react';
import { useSelector } from 'react-redux';
import {
  useBookingsreqMutation,
  useBookingsConfirmMutation,
  useMarkedMutation,
  useDoneMutation,
} from '../../redux/slices/Api/EndPoints/bookingEndpoints';
import { RootState } from '../../redux/slices/Reducers/types';
import { Booking } from '../../types/booking';

interface AllBookingsModalProps {
  onClose: () => void;
  onViewBooking: (booking: Booking) => void;
  artistId: string;
  changes: number;
}

const AllBookingsModal: React.FC<AllBookingsModalProps> = ({
  onClose,
  onViewBooking,
  artistId,
  changes
}) => {
  const userInfo = useSelector((state: RootState) => state.client.userInfo);
  const clientId = userInfo?.data?.message?._id;

  const [bookingsReq] = useBookingsreqMutation();
  const [bookingsConfirm] = useBookingsConfirmMutation();
  const [marked] = useMarkedMutation();
  const [done] = useDoneMutation();

  const [requestedBookings, setRequestedBookings] = React.useState<Booking[]>([]);
  const [confirmedBookings, setConfirmedBookings] = React.useState<Booking[]>([]);
  const [markedBookings, setMarkedBookings] = React.useState<Booking[]>([]);
  const [doneBookings, setDoneBookings] = React.useState<Booking[]>([]);
  const [filter, setFilter] = React.useState('all');
  const [currentPage, setCurrentPage] = React.useState(1);
  const bookingsPerPage = 5;

  React.useEffect(() => {
    const fetchBookings = async () => {
      if (clientId && artistId) {
        try {
          const responseReq = await bookingsReq({ clientId, artistId });
          const responseConfirm = await bookingsConfirm({ clientId, artistId });
          const responseMarked = await marked({ clientId, artistId });
          const responseDone = await done({ clientId, artistId });

          if ('data' in responseReq) setRequestedBookings(responseReq.data.bookings);
          if ('data' in responseConfirm) setConfirmedBookings(responseConfirm.data.bookings);
          if ('data' in responseMarked) setMarkedBookings(responseMarked.data.bookings);
          if ('data' in responseDone) setDoneBookings(responseDone.data.bookings);
        } catch (error) {
          console.error('Error fetching bookings:', error);
        }
      }
    };
    fetchBookings();
  }, [clientId, artistId, bookingsReq, bookingsConfirm, marked,changes]);

  const formatBookingDates = (dates: Date[]) => {
    if (!dates || dates.length === 0) return '';

    const formattedDates = dates
      .map((date) => new Date(date))
      .sort((a: any, b: any) => a - b);

    let dateRanges = [];
    let currentRange: Date[] = [];

    formattedDates.forEach((date: any, index: number) => {
      const previousDate: any = formattedDates[index - 1];
      if (previousDate && (date - previousDate) / (1000 * 60 * 60 * 24) === 1) {
        currentRange.push(date);
      } else {
        if (currentRange.length > 0) {
          dateRanges.push(currentRange);
        }
        currentRange = [date];
      }
    });

    if (currentRange.length > 0) {
      dateRanges.push(currentRange);
    }

    return dateRanges
      .map((range) => {
        if (range.length > 1) {
          return `${range[0].getDate()}/${
            range[0].getMonth() + 1
          }/${range[0].getFullYear()} to ${
            range[range.length - 1].getDate()
          }/${range[range.length - 1].getMonth() + 1}/${range[range.length - 1].getFullYear()}`;
        } else {
          return `${range[0].getDate()}/${
            range[0].getMonth() + 1
          }/${range[0].getFullYear()}`;
        }
      })
      .join(', ');
  };

  const filteredBookings =
    filter === 'all'
      ? [...requestedBookings, ...confirmedBookings, ...markedBookings,...doneBookings]
      : filter === 'requested'
      ? requestedBookings
      : filter === 'confirmed'
      ? confirmedBookings
      : filter === 'done'
      ? doneBookings
      : markedBookings;

  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = filteredBookings.slice(indexOfFirstBooking, indexOfLastBooking);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white bg-opacity-90 p-4 rounded-lg max-w-lg w-full">
        <h2 className="text-xl font-bold mb-4">All Bookings</h2>
        <div className="mb-4">
          <label className="mr-2">Filter:</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="p-2 border rounded bg-opacity-90"
          >
            <option value="all">All</option>
            <option value="requested">Requested</option>
            <option value="confirmed">Booked</option>
            <option value="marked">Marked</option>
            <option value="done">Done</option>
          </select>
        </div>
        {currentBookings.length > 0 ? (
          
          currentBookings.map((booking) => (
            <div key={booking._id} className="flex justify-between items-center p-2 border-b">
              <span>{formatBookingDates(booking.date_of_booking)}</span>
              <span>{booking.status}</span>
              <button onClick={() => onViewBooking(booking)} className="bg-graydark text-white p-1 rounded">View</button>
            </div>
          ))
        ) : (
          <div className="p-4 text-center text-graydark">No bookings available</div>
        )}
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 bg-gray rounded"
          >
            Previous
          </button>
          <span>{currentPage}</span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={indexOfLastBooking >= filteredBookings.length}
            className="p-2 bg-gray rounded"
          >
            Next
          </button>
        </div>
        <button onClick={onClose} className="mt-4 bg-red-500 text-white p-2 rounded">
          Close
        </button>
      </div>
    </div>
  );
};

export default AllBookingsModal;
