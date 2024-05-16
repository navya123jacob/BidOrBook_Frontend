import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/slices/Reducers/types';
import { useClientprofileMutation } from '../../redux/slices/Api/Client/clientApiEndPoints';
import { setCredentials } from '../../redux/slices/Reducers/ClientReducer';


const ProfileForm: React.FC = () => {
    const userInfo = useSelector((state: RootState) => state.client.userInfo);
    const [clientprofile, { isLoading }] = useClientprofileMutation();
    const dispatch = useDispatch()
    const [formData, setFormData] = useState({
        _id: userInfo.data.message._id,
        Fname: userInfo.data.message.Fname,
        Lname: userInfo.data.message.Lname,
        email: userInfo.data.message.email,
        phone: userInfo.data.message.phone,
        image: null as File | null,
    });

    const [errors, setErrors] = useState({
        Fname: '',
        Lname: '',
        phone: '',
        image: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFormData({ ...formData, image: e.target.files[0] });
        }
    };

    const validateForm = () => {
        let valid = true;
        const newErrors = { ...errors };

        const nameRegex = /^[a-zA-Z\s]+$/;
        const phoneRegex = /^\d{10}$/;

        if (formData.Fname.trim() === '') {
            newErrors.Fname = 'First Name is required';
            valid = false;
        } else if (!nameRegex.test(formData.Fname)) {
            newErrors.Fname = 'First Name should contain only letters and spaces';
            valid = false;
        } else {
            newErrors.Fname = '';
        }

        if (formData.Lname.trim() === '') {
            newErrors.Lname = 'Last Name is required';
            valid = false;
        } else if (!nameRegex.test(formData.Lname)) {
            newErrors.Lname = 'Last Name should contain only letters and spaces';
            valid = false;
        } else {
            newErrors.Lname = '';
        }

        if (formData.phone.toString().trim() === '') {
            newErrors.phone = 'Phone is required';
            valid = false;
        } else if (!phoneRegex.test(formData.phone.toString().trim())) {
            newErrors.phone = 'Phone should be 10 digits';
            valid = false;
        } else if (/^0+$/.test(formData.phone.toString().trim())) {
            newErrors.phone = 'Phone cannot be all zeros';
            valid = false;
        } else {
            newErrors.phone = '';
        }
        if (formData.image && !['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/avif'].includes(formData.image.type)) {
            newErrors.image = 'Profile Image must be in JPEG, PNG, or GIF format';
            valid = false;
        }else {
            newErrors.image = '';
        }

        setErrors(newErrors);
        return valid;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (validateForm()) {
            const formDataToSend = new FormData();
            formDataToSend.append('_id', formData._id);
            formDataToSend.append('Fname', formData.Fname);
            formDataToSend.append('Lname', formData.Lname);
            formDataToSend.append('phone', formData.phone);
            if(formData.image){
            formDataToSend.append('image', formData.image);}
            const response: any = await clientprofile(formDataToSend);
            console.log('userInfo',userInfo)
            console.log('response',response)
            if(response.data){
                let newuserInfo=JSON.parse(JSON.stringify(userInfo))
                newuserInfo.data.message={...response.data.user}
                dispatch(setCredentials({ ...newuserInfo }));
                console.log(newuserInfo,'new')
            }
            
        }
    };

    return (
        <>
        <div className="bg-gray-200 flex items-center justify-center w-full lg:w-1/2">
            <form className="space-y-6" onSubmit={handleSubmit} encType="multipart/form-data">
                <div>
                    <label htmlFor="Fname" className="block text-sm font-medium text-gray-700">
                        First Name
                    </label>
                    <div className="mt-1">
                        <input
                            id="Fname"
                            name="Fname"
                            type="text"
                            value={formData.Fname}
                            onChange={handleChange}
                            className={`block w-full px-5 py-3 text-base text-neutral-600 placeholder-gray-300 transition duration-500 ease-in-out transform border border-transparent rounded-lg bg-gray-50 focus:outline-none focus:border-transparent focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-300 ${errors.Fname ? 'border-red-500' : ''}`}
                        />
                        {errors.Fname && <span className="text-red-500">{errors.Fname}</span>}
                    </div>
                </div>

                <div>
                    <label htmlFor="Lname" className="block text-sm font-medium text-gray-700">
                        Last Name
                    </label>
                    <div className="mt-1">
                        <input
                            id="Lname"
                            name="Lname"
                            type="text"
                            value={formData.Lname}
                            onChange={handleChange}
                            className={`block w-full px-5 py-3 text-base text-neutral-600 placeholder-gray-300 transition duration-500 ease-in-out transform border border-transparent rounded-lg                     bg-gray-50 focus:outline-none focus:border-transparent focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-300 ${errors.Lname ? 'border-red-500' : ''}`}
                            />
                            {errors.Lname && <span className="text-red-500">{errors.Lname}</span>}
                        </div>
                    </div>
    
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700"> Email address </label>
                        <div className="mt-1">
                            <input id="email" name="email" type="email" value={formData.email} disabled className="block w-full px-5 py-3 text-base text-neutral-600 placeholder-gray-300 transition duration-500 ease-in-out transform border border-transparent rounded-lg bg-gray-50 focus:outline-none focus:border-transparent focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-300" />
                        </div>
                    </div>
    
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700"> Phone </label>
                        <div className="mt-1">
                            <input
                                id="phone"
                                name="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={handleChange}
                                className={`block w-full px-5 py-3 text-base text-neutral-600 placeholder-gray-300 transition duration-500 ease-in-out transform border border-transparent rounded-lg bg-gray-50 focus:outline-none focus:border-transparent focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-300 ${errors.phone ? 'border-red-500' : ''}`}
                            />
                            {errors.phone && <span className="text-red-500">{errors.phone}</span>}
                        </div>
                    </div>
    
                    <div>
                        <label htmlFor="image" className="block text-sm font-medium text-gray-700"> Profile Image </label>
                        <div className="mt-1">
                            <input
                                id="image"
                                name="image"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className={`block w-full px-5 py-3 text-base text-neutral-600 placeholder-gray-300 transition duration-500 ease-in-out transform border border-transparent rounded-lg bg-gray-50 focus:outline-none focus:border-transparent focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-300 ${errors.image ? 'border-red-500' : ''}`}
                            />
                            {errors.image && <span className="text-red-500">{errors.image}</span>}
                            {formData.image ? (
                                <img src={URL.createObjectURL(formData.image)} alt="Profile" className="mt-2 w-24 h-24 rounded-full mx-auto" />
                            ) : userInfo?.data?.message?.profile ? (
                                <img src={userInfo.data.message.profile} alt="Profile" className="mt-2 w-24 h-24 rounded-full mx-auto" />
                            ) : null}
                        </div>
                    </div>
    
                    <div>
                        <button
                            type="submit"
                            className="flex items-center justify-center w-full px-10 py-4 text-base font-medium text-center text-white transition duration-500 ease-in-out transform bg-blue-950 rounded-xl hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Update
                        </button>
                    </div>
                </form>
                
            </div>
            
            </>
        );
    };
    
    export default ProfileForm;
    
