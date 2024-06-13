import React, { useEffect, useState } from 'react';
import { User } from '../../types/user';
import { useSingleUserMutation } from '../../redux/slices/Api/EndPoints/clientApiEndPoints';

interface UserDetailsModalProps {
  id: string; 
  onClose: () => void;
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({ id, onClose }) => {
  const [user, setUser] = useState<User | null>(null);
  const [fetchUser] = useSingleUserMutation();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetchUser(id).unwrap();
        console.log(response)
        setUser(response.user);  
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserData();
  }, [id, fetchUser]);
  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-smoke-light flex">
      <div className="relative p-8 bg-white w-full max-w-md m-auto flex-col flex rounded-lg bg-opacity-95">
        <span className="absolute top-0 right-0 p-4">
          <button onClick={onClose}>X</button>
        </span>
        <h2 className="text-2xl mb-4">User Details</h2>
        <div className="mt-4 bg-gray-200 p-4 rounded">
          <p><strong>ID:</strong> {user?._id}</p>
          <p><strong>Name:</strong> {user?.Fname}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          {/* Add other user details as needed */}
        </div>
        <div className="mt-4 flex justify-between">
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200">
            DM
          </button>
          <button onClick={onClose} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-200">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;
