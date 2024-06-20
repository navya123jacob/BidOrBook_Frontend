import React, { useState, useEffect } from "react";
import { useGetBookingsByArtistAndClientQuery } from "../../../redux/slices/Api/EndPoints/bookingEndpoints";
import {  IBooking } from "../../../types/booking";
import UserDetailsModal from "../PopupModals/AdminUserDetails";
import { User } from "../../../types/user";
import ConfirmationModal from "../../User/CancelConfirmModal";
import { useCancelbookingMutation } from "../../../redux/slices/Api/EndPoints/bookingEndpoints";
const BookingsTable = () => {
    const { data: bookings = [], isLoading, refetch } = useGetBookingsByArtistAndClientQuery({});

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<IBooking | null>(null);
  const [cancelbooking]=useCancelbookingMutation()
  const bookingsPerPage = 10;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setFilterStatus(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setFilterCategory(e.target.value);
    setCurrentPage(1);
  };

  const filteredBookings = bookings.filter((booking: IBooking) => {
    const searchTermRegex = new RegExp(searchTerm.toLowerCase().split(' ').join('\\s*'));

const matchesSearchTerm =
  booking.clientId.Fname.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
  booking.clientId.Lname.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
  booking.artistId.Fname.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
  booking.artistId.Lname.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
  searchTermRegex.test(`${booking.clientId.Fname.toLowerCase()} ${booking.clientId.Lname.toLowerCase()}`) ||
  searchTermRegex.test(`${booking.artistId.Fname.toLowerCase()} ${booking.artistId.Lname.toLowerCase()}`);

    const matchesStatus = filterStatus ? booking.status === filterStatus : true;
    const matchesCategory = filterCategory
      ? booking.artistId.category === filterCategory
      : true;

    return matchesSearchTerm && matchesStatus && matchesCategory;
  });

  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = filteredBookings.slice(
    indexOfFirstBooking,
    indexOfLastBooking
  );
  const bookingCancel = async () => {
    if (selectedBooking) {
      const response = await cancelbooking({ bookingId: selectedBooking._id, userId: selectedBooking.artistId._id || '',clientId:selectedBooking.clientId._id||'',amount:selectedBooking.amount,status:selectedBooking.status });
      if ('data' in response) {
        refetch()
        setIsConfirmationModalOpen(false);
        setSelectedBooking(null);
      }
    }
  };

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <>
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full overflow-x-auto">
        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            placeholder="Search by name"
            value={searchTerm}
            onChange={handleSearchChange}
            className="p-2 border rounded text-black dark:text-white bg-white dark:bg-boxdark"
          />
          <select
            onChange={handleStatusFilterChange}
            className="p-2 border rounded text-black dark:text-white ml-4 focus:outline-none bg-white dark:bg-boxdark focus:ring-2 focus:ring-blue-500 focus:border-transparent "
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="marked">Marked</option>
            <option value="booked">Booked</option>
          </select>

          <select
            onChange={handleCategoryFilterChange}
            className="p-2 border rounded text-black dark:text-white ml-4 focus:outline-none bg-white dark:bg-boxdark focus:ring-2 focus:ring-blue-500 focus:border-transparent "
          >
            <option value="">All Categories</option>
            <option value="Photographer">Photographer</option>
            <option value="Artist">Artist</option>
          </select>
        </div>
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                Booking ID
              </th>
              <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                Client Name
              </th>
              <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                Artist Name
              </th>
              <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                Category
              </th>
              <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                Event
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                Status
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {currentBookings.map((booking: IBooking) => (
              <tr key={booking._id}>
                <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                  <h5 className="font-medium text-black dark:text-white">
                    {booking._id}
                  </h5>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <button
                    className="dark:bg-graydark dark:text-white bg-meta-2 text-black rounded p-2"
                    onClick={() => setSelectedUser(booking.clientId)}
                  >
                    {booking.clientId.Fname} {booking.clientId.Lname}
                  </button>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p
                    className="dark:bg-graydark dark:text-white bg-meta-2 text-black rounded p-2"
                    onClick={() => setSelectedUser(booking.artistId)}
                  >
                    {booking.artistId.Fname} {booking.artistId.Lname}
                  </p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className=" dark:text-white text-black ">
                    {booking.artistId.category}
                  </p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black dark:text-white">{booking.event}</p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p
                    className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${
                      booking.status === "pending"
                        ? "bg-yellow-100 text-yellow-600"
                        : booking.status === "confirmed"
                        ? "bg-green-100 text-green-600"
                        : booking.status === "marked"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {booking.status}
                  </p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark  ">
                  <button className="text-white bg-red-700 rounded p-2" onClick={()=>{setIsConfirmationModalOpen(true);setSelectedBooking(booking)}}>
                   Cancel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 border rounded"
          >
            Previous
          </button>
          <p>Page {currentPage}</p>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={indexOfLastBooking >= filteredBookings.length}
            className="p-2 border rounded"
          >
            Next
          </button>
        </div>
      </div>
      <UserDetailsModal
        user={selectedUser}
        onClose={() => setSelectedUser(null)}
      />
    </div>
    {isConfirmationModalOpen && (
        <ConfirmationModal
          message="Are you sure you want to cancel this booking?"
          onConfirm={bookingCancel}
          onCancel={() => setIsConfirmationModalOpen(false)}
        />
      )}
    </>
  );
};

export default BookingsTable;
