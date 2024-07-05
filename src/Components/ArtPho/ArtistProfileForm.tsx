import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/slices/Reducers/types";
import { useClientprofileMutation, useForgotpasswordMutation } from "../../redux/slices/Api/EndPoints/clientApiEndPoints";
import { setCredentials } from "../../redux/slices/Reducers/ClientReducer";
import Modal from "../User/cropper/Modal";
import Otp from "../User/Otp";
import { useGetEventsQuery } from "../../redux/slices/Api/EndPoints/AdminEndpoints";
import { IEvent } from "../../types/Event";

const ArtistProfileForm: React.FC = () => {
  const userInfo = useSelector((state: RootState) => state.client.userInfo);
  const { data: events = [] } = useGetEventsQuery(userInfo.data.message.category); 
  const [clientprofile, { isLoading }] = useClientprofileMutation();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState<boolean>(false);
  const dispatch = useDispatch();
  const avatarUrl = useRef<string>(userInfo.data.message.profile);
  const [forgotpassword] = useForgotpasswordMutation();
  const [otp, setOtp] = useState(false);
  
  const [formData, setFormData] = useState({
    _id: userInfo.data.message._id,
    Fname: userInfo.data.message.Fname,
    Lname: userInfo.data.message.Lname,
    email: userInfo.data.message.email,
    phone: userInfo.data.message.phone,
    description: userInfo.data.message.description || "",
    state: userInfo.data.message.location.state || "",
    district: userInfo.data.message.location.district || "",
    country: userInfo.data.message.location.country || "",
    minPayPerHour: userInfo.data.message.minPayPerHour || 0,
    image: null as File | null,
    typesOfEvents: userInfo.data.message.typesOfEvents || [], 
  });

  const [errors, setErrors] = useState({
    Fname: "",
    Lname: "",
    phone: "",
    description: "",
    state: "",
    district: "",
    country: "",
    minPayPerHour: "",
    image: "",
  });
  const handleEventChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const eventName = event.target.name;
    setFormData((prev) => {
      const updatedTypesOfEvents = event.target.checked
        ? [...prev.typesOfEvents, eventName]
        : prev.typesOfEvents.filter((evt:string) => evt !== eventName);
      return {
        ...prev,
        typesOfEvents: updatedTypesOfEvents,
      };
    });
  };
  

  const updateAvatar = (imgSrc: string) => {
    avatarUrl.current = imgSrc;
    const byteCharacters = atob(imgSrc.split(",")[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "image/png" });
    const file = new File([blob], "avatar.png", { type: "image/png" });

    setFormData({ ...formData, image: file });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { ...errors };

    const nameRegex = /^[a-zA-Z\s]+$/;
    const phoneRegex = /^\d{10}$/;

    if (formData.Fname.trim() === "") {
      newErrors.Fname = "First Name is required";
      valid = false;
    } else if (!nameRegex.test(formData.Fname)) {
      newErrors.Fname = "First Name should contain only letters and spaces";
      valid = false;
    } else {
      newErrors.Fname = "";
    }

    if (formData.Lname.trim() === "") {
      newErrors.Lname = "Last Name is required";
      valid = false;
    } else if (!nameRegex.test(formData.Lname)) {
      newErrors.Lname = "Last Name should contain only letters and spaces";
      valid = false;
    } else {
      newErrors.Lname = "";
    }

    if (String(formData.phone).trim() === "") {
        newErrors.phone = "Phone is required";
        valid = false;
      } else if (!phoneRegex.test(String(formData.phone).trim())) {
        newErrors.phone = "Phone should be 10 digits";
        valid = false;
      } else if (/^0+$/.test(String(formData.phone).trim())) {
        newErrors.phone = "Phone cannot be all zeros";
        valid = false;
      } else {
        newErrors.phone = "";
      }

    if (formData.description && formData.description.trim() === "") {
      newErrors.description = "Description is required";
      valid = false;
    } else {
      newErrors.description = "";
    }

    if (formData.state.trim() === "") {
      newErrors.state = "State is required";
      valid = false;
    } else {
      newErrors.state = "";
    }

    if (formData.district.trim() === "") {
      newErrors.district = "District is required";
      valid = false;
    } else {
      newErrors.district = "";
    }

    if (formData.country.trim() === "") {
      newErrors.country = "Country is required";
      valid = false;
    } else {
      newErrors.country = "";
    }

    if (formData.minPayPerHour <= 200 ) {
        newErrors.minPayPerHour = "Minimum Pay Per Hour should be greater than 200";
        valid = false;
      } else {
        newErrors.minPayPerHour = "";
      }

    if (
      formData.image &&
      ![
        "image/jpeg",
        "image/png",
        "image/jpg",
        "image/webp",
        "image/avif",
      ].includes(formData.image.type)
    ) {
      newErrors.image = "Profile Image must be in JPEG, PNG, or GIF format";
      valid = false;
    } else {
      newErrors.image = "";
    }

    setErrors(newErrors);
    return valid;
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
        console.log( formData.typesOfEvents)
      const formDataToSend = new FormData();
      formDataToSend.append("_id", formData._id);
      formDataToSend.append("Fname", formData.Fname);
      formDataToSend.append("Lname", formData.Lname);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("state", formData.state);
      formDataToSend.append("district", formData.district);
      formDataToSend.append("country", formData.country);
      formDataToSend.append("minPayPerHour", formData.minPayPerHour);
      formData.typesOfEvents.forEach((eventType:string) => formDataToSend.append("typesOfEvents[]", eventType));
      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }
      const response: any = await clientprofile(formDataToSend);
      if (response.data) {
        let newuserInfo = JSON.parse(JSON.stringify(userInfo));
        newuserInfo.data.message = { ...response.data.user };
        dispatch(setCredentials({ ...newuserInfo }));
      }
    }
  };

  const handlePasswordChange = async () => {
    setPasswordModalOpen(false);
    const response: any = await forgotpassword({ email: formData.email });
    if ('data' in response) {
      setOtp(true);
    }
  };

  return (
    <>
      <div className="bg-gray-200 flex items-center justify-center w-full lg:w-1/2">
        {!otp ? (
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
                  className={`block w-full px-5 py-3 text-base text-neutral-600 placeholder-gray-300 transition duration-500 ease-in-out transform border border-transparent rounded-lg bg-gray-50 focus:outline-none focus:border-transparent focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-300 ${errors.Fname ? "border-red-500" : ""}`}
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
                  className={`block w-full px-5 py-3 text-base text-neutral-600 placeholder-gray-300 transition duration-500 ease-in-out transform border border-transparent rounded-lg bg-gray-50 focus:outline-none focus:border-transparent focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-300 ${errors.Lname ? "border-red-500" : ""}`}
                />
                {errors.Lname && <span className="text-red-500">{errors.Lname}</span>}
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  disabled
                  className="block w-full px-5 py-3 text-base text-neutral-600 placeholder-gray-300 transition duration-500 ease-in-out transform border border-transparent rounded-lg bg-gray-50 focus:outline-none focus:border-transparent focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-300"
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <div className="mt-1">
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`block w-full px-5 py-3 text-base text-neutral-600 placeholder-gray-300 transition duration-500 ease-in-out transform border border-transparent rounded-lg bg-gray-50 focus:outline-none focus:border-transparent focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-300 ${errors.phone ? "border-red-500" : ""}`}
                />
                {errors.phone && <span className="text-red-500">{errors.phone}</span>}
              </div>
            </div>

            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                State
              </label>
              <div className="mt-1">
                <input
                  id="state"
                  name="state"
                  type="text"
                  value={formData.state}
                  onChange={handleChange}
                  className={`block w-full px-5 py-3 text-base text-neutral-600 placeholder-gray-300 transition duration-500 ease-in-out transform border border-transparent rounded-lg bg-gray-50 focus:outline-none focus:border-transparent focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-300 ${errors.state ? "border-red-500" : ""}`}
                />
                {errors.state && <span className="text-red-500">{errors.state}</span>}
              </div>
            </div>

            <div>
              <label htmlFor="district" className="block text-sm font-medium text-gray-700">
                District
              </label>
              <div className="mt-1">
                <input
                  id="district"
                  name="district"
                  type="text"
                  value={formData.district}
                  onChange={handleChange}
                  className={`block w-full px-5 py-3 text-base text-neutral-600 placeholder-gray-300 transition duration-500 ease-in-out transform border border-transparent rounded-lg bg-gray-50 focus:outline-none focus:border-transparent focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-300 ${errors.district ? "border-red-500" : ""}`}
                />
                {errors.district && <span className="text-red-500">{errors.district}</span>}
              </div>
            </div>

            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                Country
              </label>
              <div className="mt-1">
                <input
                  id="country"
                  name="country"
                  type="text"
                  value={formData.country}
                  onChange={handleChange}
                  className={`block w-full px-5 py-3 text-base text-neutral-600 placeholder-gray-300 transition duration-500 ease-in-out transform border border-transparent rounded-lg bg-gray-50 focus:outline-none focus:border-transparent focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-300 ${errors.country ? "border-red-500" : ""}`}
                />
                {errors.country && <span className="text-red-500">{errors.country}</span>}
              </div>
            </div>

            <div>
              <label htmlFor="minPayPerHour" className="block text-sm font-medium text-gray-700">
                Minimum Pay Per Hour
              </label>
              <div className="mt-1">
                <input
                  id="minPayPerHour"
                  name="minPayPerHour"
                  type="number"
                  value={formData.minPayPerHour}
                  onChange={(e)=>{setFormData({ ...formData, "minPayPerHour": parseInt(e.target.value) });}}
                  className={`block w-full px-5 py-3 text-base text-neutral-600 placeholder-gray-300 transition duration-500 ease-in-out transform border border-transparent rounded-lg bg-gray-50 focus:outline-none focus:border-transparent focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-300 ${errors.minPayPerHour ? "border-red-500" : ""}`}
                />
                {errors.minPayPerHour && <span className="text-red-500">{errors.minPayPerHour}</span>}
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Bio
              </label>
              <div className="mt-1">
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className={`block w-full px-5 py-3 text-base text-neutral-600 placeholder-gray-300 transition duration-500 ease-in-out transform border border-transparent rounded-lg bg-gray-50 focus:outline-none focus:border-transparent focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-300 ${errors.description ? "border-red-500" : ""}`}
                ></textarea>
                {errors.description && <span className="text-red-500">{errors.description}</span>}
              </div>
            </div>
            <div>
        <label className="block text-sm font-medium text-gray-700">Events</label>
        <div className="grid grid-cols-3 gap-4 mt-1">
        {events.map((event: IEvent) => (
      <div key={event._id} className="flex items-center">
        <input
          type="checkbox"
          id={event._id}
          name={event.name}
          checked={formData.typesOfEvents.includes(event.name)}
          onChange={handleEventChange}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor={event._id} className="ml-2 text-sm text-gray-700">
          {event.name}
        </label>
      </div>
    ))}
        </div>
      </div>

            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                Profile Image
              </label>
              <div className="mt-1">
                <button
                  type="button"
                  onClick={() => setModalOpen(true)}
                  className="block w-full px-5 py-3 text-black placeholder-gray-100 transition duration-500 ease-in-out transform border border-transparent rounded-lg bg-gray-500 focus:outline-none focus:border-transparent focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-300 bg-gray"
                >
                  Change Profile Picture
                </button>
                {errors.image && <span className="text-red-500">{errors.image}</span>}
                <img src={avatarUrl.current} alt="Profile" className="mt-2 w-24 h-24 rounded-full mx-auto" />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <button
                  type="button"
                  onClick={() => setPasswordModalOpen(true)}
                  className="block w-full px-5 py-3  text-neutral-600 placeholder-gray-100 transition duration-500 ease-in-out transform border border-transparent rounded-lg focus:outline-none focus:border-transparent focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-300 bg-gray"
                >
                  Change Password
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className={`flex items-center justify-center w-full px-10 py-4 text-base font-medium text-center text-white transition duration-500 ease-in-out transform rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isLoading ? "bg-teal-900 hover:bg-graydark" : "bg-graydark hover:bg-blue-900"}`}
              >
                {isLoading ? "Updating...." : "Update"}
              </button>
            </div>
          </form>
        ) : (
          <Otp setOtp={setOtp} forgot={true} profile={true} />
        )}
        {modalOpen && (
          <Modal
            updateAvatar={updateAvatar}
            closeModal={() => setModalOpen(false)}
          />
        )}
        {passwordModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white text-black p-6 rounded-lg shadow-lg">
              <p>Are you sure you want to change your password?</p>
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setPasswordModalOpen(false)}
                  className="px-4 py-2 bg-red-800 text-white rounded-lg mr-2"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePasswordChange}
                  className="px-4 py-2 bg-green-800 text-white rounded-lg"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ArtistProfileForm
