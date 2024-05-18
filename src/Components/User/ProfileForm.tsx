import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/slices/Reducers/types";
import { useClientprofileMutation } from "../../redux/slices/Api/Client/clientApiEndPoints";
import { setCredentials } from "../../redux/slices/Reducers/ClientReducer";
import Modal from "./cropper/Modal";

const ProfileForm: React.FC = () => {
  const userInfo = useSelector((state: RootState) => state.client.userInfo);
  const [clientprofile, { isLoading }] = useClientprofileMutation();
  console.log(isLoading);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const dispatch = useDispatch();
  const avatarUrl = useRef<string>(userInfo.data.message.profile);

  const [formData, setFormData] = useState({
    _id: userInfo.data.message._id,
    Fname: userInfo.data.message.Fname,
    Lname: userInfo.data.message.Lname,
    email: userInfo.data.message.email,
    phone: userInfo.data.message.phone,
    description: userInfo.data.message.description || "",
    image: null as File | null,
  });

  const [errors, setErrors] = useState({
    Fname: "",
    Lname: "",
    phone: "",
    description: "",
    image: "",
  });
  const updateAvatar = (imgSrc: string) => {
    avatarUrl.current = imgSrc;
    console.log(avatarUrl.current);
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

    if (formData.phone.toString().trim() === "") {
      newErrors.phone = "Phone is required";
      valid = false;
    } else if (!phoneRegex.test(formData.phone.toString().trim())) {
      newErrors.phone = "Phone should be 10 digits";
      valid = false;
    } else if (/^0+$/.test(formData.phone.toString().trim())) {
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
    console.log(formData.image);

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      const formDataToSend = new FormData();
      formDataToSend.append("_id", formData._id);
      formDataToSend.append("Fname", formData.Fname);
      formDataToSend.append("Lname", formData.Lname);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("description", formData.description);
      console.log('form data',formData)
      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }
      const response: any = await clientprofile(formDataToSend);
      console.log("response", response);
      if (response.data) {
        let newuserInfo = JSON.parse(JSON.stringify(userInfo));
        newuserInfo.data.message = { ...response.data.user };
        dispatch(setCredentials({ ...newuserInfo }));
        console.log(newuserInfo, "new");
      }
    }
  };

  return (
    <>
      <div className="bg-gray-200 flex items-center justify-center w-full lg:w-1/2">
        <form
          className="space-y-6"
          onSubmit={handleSubmit}
          encType="multipart/form-data"
        >
          <div>
            <label
              htmlFor="Fname"
              className="block text-sm font-medium text-gray-700"
            >
              First Name
            </label>
            <div className="mt-1">
              <input
                id="Fname"
                name="Fname"
                type="text"
                value={formData.Fname}
                onChange={handleChange}
                className={`block w-full px-5 py-3 text-base text-neutral-600 placeholder-gray-300 transition duration-500 ease-in-out transform border border-transparent rounded-lg bg-gray-50 focus:outline-none focus:border-transparent focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-300 ${
                  errors.Fname ? "border-red-500" : ""
                }`}
              />
              {errors.Fname && (
                <span className="text-red-500">{errors.Fname}</span>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="Lname"
              className="block text-sm font-medium text-gray-700"
            >
              Last Name
            </label>
            <div className="mt-1">
              <input
                id="Lname"
                name="Lname"
                type="text"
                value={formData.Lname}
                onChange={handleChange}
                className={`block w-full px-5 py-3 text-base text-neutral-600 placeholder-gray-300 transition duration-500 ease-in-out transform border border-transparent rounded-lg                     bg-gray-50 focus:outline-none focus:border-transparent focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-300 ${
                  errors.Lname ? "border-red-500" : ""
                }`}
              />
              {errors.Lname && (
                <span className="text-red-500">{errors.Lname}</span>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              {" "}
              Email address{" "}
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
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700"
            >
              {" "}
              Phone{" "}
            </label>
            <div className="mt-1">
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className={`block w-full px-5 py-3 text-base text-neutral-600 placeholder-gray-300 transition duration-500 ease-in-out transform border border-transparent rounded-lg bg-gray-50 focus:outline-none focus:border-transparent focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-300 ${
                  errors.phone ? "border-red-500" : ""
                }`}
              />
              {errors.phone && (
                <span className="text-red-500">{errors.phone}</span>
              )}
            </div>
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              {" "}
              Bio{" "}
            </label>
            <div className="mt-1">
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className={`block w-full px-5 py-3 text-base text-neutral-600 placeholder-gray-300 transition duration-500 ease-in-out transform border border-transparent rounded-lg bg-gray-50 focus:outline-none focus:border-transparent focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-300 ${
                  errors.description ? "border-red-500" : ""
                }`}
              ></textarea>
              {errors.description && (
                <span className="text-red-500">{errors.description}</span>
              )}
            </div>
          </div>


          <div>
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-700"
            >
              {" "}
              Profile Image{" "}
            </label>
            <div className="mt-1">
              <button
                onClick={() => {
                  setModalOpen(true);
                }}
                className="block w-full px-5 py-3 text-white text-neutral-600 placeholder-gray-100 transition duration-500 ease-in-out transform border border-transparent rounded-lg bg-gray-500 focus:outline-none focus:border-transparent focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-300"
              >
                Change Profile Picture
              </button>
              {errors.image && (
                <span className="text-red-500">{errors.image}</span>
              )}

              <img
                src={avatarUrl.current}
                alt="Profile"
                className="mt-2 w-24 h-24 rounded-full mx-auto"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className={`flex items-center justify-center w-full px-10 py-4 text-base font-medium text-center text-white transition duration-500 ease-in-out transform rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                isLoading
                  ? "bg-teal-900 hover:bg-gray-600"
                  : "bg-gray-800 hover:bg-blue-900"
              }`}
            >
              {isLoading ? "Updating...." : "Update"}
            </button>
          </div>
        </form>
        {modalOpen && (
          <Modal
            updateAvatar={updateAvatar}
            closeModal={() => setModalOpen(false)}
          />
        )}
      </div>
    </>
  );
};

export default ProfileForm;
