import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/slices/Reducers/types';

const ProfileForm: React.FC = () => {
    const userInfo = useSelector((state: RootState) => state.client.userInfo);
    const [formData, setFormData] = useState({
        Fname: userInfo.data.message.Fname,
        Lname: userInfo.data.message.Lname,
        email: userInfo.data.message.email,
        phone: userInfo.data.message.phone.toString(), // convert to string for input value
        profileImage: null as File | null, // Union type specifying null or File
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFormData({ ...formData, profileImage: e.target.files[0] });
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Handle form submission
    };

    return (
        <div className="bg-gray-200 flex items-center justify-center w-full lg:w-1/2">
            <form className="space-y-6 " onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="Fname" className="block text-sm font-medium text-gray-700"> First Name </label>
                    <div className="mt-1">
                        <input id="Fname" name="Fname" type="text" value={formData.Fname} onChange={handleChange} className="block w-full px-5 py-3 text-base text-neutral-600 placeholder-gray-300 transition duration-500 ease-in-out transform border border-transparent rounded-lg bg-gray-50 focus:outline-none focus:border-transparent focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-300" />
                    </div>
                </div>

                <div>
                    <label htmlFor="Lname" className="block text-sm font-medium text-gray-700"> Last Name </label>
                    <div className="mt-1">
                        <input id="Lname" name="Lname" type="text" value={formData.Lname} onChange={handleChange} className="block w-full px-5 py-3 text-base text-neutral-600 placeholder-gray-300 transition duration-500 ease-in-out transform border border-transparent rounded-lg bg-gray-50 focus:outline-none focus:border-transparent focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-300" />
                    </div>
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700"> Email address </label>
                    <div className="mt-1">
                        <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} disabled className="block w-full px-5 py-3 text-base text-neutral-600 placeholder-gray-300 transition duration-500 ease-in-out transform border border-transparent rounded-lg bg-gray-50 focus:outline-none focus:border-transparent focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-300" />
                    </div>
                </div>

                <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700"> Phone </label>
                    <div className="mt-1">
                        <input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} className="block w-full px-5 py-3 text-base text-neutral-600 placeholder-gray-300 transition duration-500 ease-in-out transform border border-transparent rounded-lg bg-gray-50 focus:outline-none focus:border-transparent focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-300" />
                    </div>
                </div>

                <div>
                    <label htmlFor="profileImage" className="block text-sm font-medium text-gray-700"> Profile Image </label>
                    <div className="mt-1">
                        <input id="profileImage" name="profileImage" type="file" accept="image/*" onChange={handleImageChange} className="block w-full px-5 py-3 text-base text-neutral-600 placeholder-gray-300 transition duration-500 ease-in-out transform border border-transparent rounded-lg bg-gray-50 focus:outline-none focus:border-transparent focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-300" />
                    </div>
                    {formData.profileImage ? (
                        <img src={URL.createObjectURL(formData.profileImage)} alt="Profile" className="mt-2 w-24 h-24 rounded-full mx-auto" />
                    ) : userInfo?.data?.message?.profile ? (
                        <img src={userInfo.data.message.profile} alt="Profile" className="mt-2 w-24 h-24 rounded-full mx-auto" />
                    ) : null}
                </div>

                <div>
                    <button type="submit" className="flex items-center justify-center w-full px-10 py-4 text-base font-medium text-center text-white transition duration-500 ease-in-out transform bg-blue-600 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Sign in</button>
                </div>
            </form>
        </div>
    );
};

export default ProfileForm;
