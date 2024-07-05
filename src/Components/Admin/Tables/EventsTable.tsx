import React, { useState } from 'react';
import { useGetEventsQuery, useDeleteEventMutation, useCreateEventMutation } from '../../../redux/slices/Api/EndPoints/AdminEndpoints';
import ConfirmationModal from '../../User/CancelConfirmModal'; 
import { IEvent } from '../../../types/Event';

const EventsTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'Photographer' | 'Artist'>('Photographer'); 
  const { data: events = [], isLoading, refetch } = useGetEventsQuery(filterType); 
  const [selectedEvent, setSelectedEvent] = useState<IEvent | null>(null); 
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false); 
  const [newEvent, setNewEvent] = useState<Partial<IEvent>>({ name: '', type: filterType });
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);

  const [deleteEvent] = useDeleteEventMutation();
  const [createEvent] = useCreateEventMutation();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterType(e.target.value as 'Photographer' | 'Artist');
    refetch(); 
  };

  const handleDeleteEvent = async () => {
    try {
      const response = await deleteEvent(selectedEvent?._id || ''); 
      if ('data' in response) {
        refetch(); 
        setIsConfirmationModalOpen(false); 
        setSelectedEvent(null); 
      }
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const handleCreateEvent = async () => {
    try {
      const response = await createEvent(newEvent);
      if ('data' in response) {
        refetch();
        setIsAddEventModalOpen(false);
        setNewEvent({ name: '', type: filterType });
      }
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  const openDeleteConfirmationModal = (event: IEvent) => {
    setSelectedEvent(event);
    setIsConfirmationModalOpen(true);
  };

  const openAddEventModal = () => {
    setIsAddEventModalOpen(true);
  };

  const handleNewEventChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setNewEvent({
      ...newEvent,
      [e.target.name]: e.target.value,
    });
  };

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
              name="filterType"
              onChange={handleFilterChange}
              value={filterType}
              className="p-2 border rounded text-black dark:text-white ml-4 focus:outline-none bg-white dark:bg-boxdark focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Photographer">Photographer</option>
              <option value="Artist">Artist</option>
            </select>
            <button
              className="text-white bg-blue-700 rounded p-2"
              onClick={openAddEventModal}
            >
              Add Event
            </button>
          </div>
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="py-4 px-4 font-medium text-black dark:text-white">Event Name</th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">Event Type</th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event: IEvent) => (
                <tr key={event._id}>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">{event.name}</td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">{event.type}</td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <button
                      className="text-white bg-red-700 rounded p-2"
                      onClick={() => openDeleteConfirmationModal(event)}
                    >
                      Delete Event
                    </button>
                  </td>
                </tr>
              ))}
              {events.length === 0 && (
                <tr>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark" colSpan={3}>
                    No events found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {isLoading && <p>Loading...</p>}
        </div>
      </div>
      {isConfirmationModalOpen && (
        <ConfirmationModal
          message="Are you sure you want to delete this event?"
          onConfirm={handleDeleteEvent}
          onCancel={() => setIsConfirmationModalOpen(false)}
        />
      )}
      {isAddEventModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white text-black p-4 rounded shadow-lg">
            <h2 className="text-lg font-bold mb-4">Add New Event</h2>
            <input
              type="text"
              name="name"
              placeholder="Event Name"
              value={newEvent.name || ''}
              onChange={handleNewEventChange}
              className="w-full p-2 border rounded mb-4"
            />
            <select
              name="type"
              value={newEvent.type || ''}
              onChange={handleNewEventChange}
              className="w-full p-2 border rounded mb-4"
            >
              <option value="Photographer">Photographer</option>
              <option value="Artist">Artist</option>
            </select>
            <button
              className="text-white bg-blue-700 rounded p-2 mr-2"
              onClick={handleCreateEvent}
            >
              Add Event
            </button>
            <button
              className="text-white bg-red-700 rounded p-2"
              onClick={() => setIsAddEventModalOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default EventsTable;
