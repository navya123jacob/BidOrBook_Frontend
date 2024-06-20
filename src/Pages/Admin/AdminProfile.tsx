import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/slices/Reducers/types';
import Breadcrumb from './AdminBreadcrumbs';
import DefaultLayout from '../../Components/Admin/DefaultLayout';
import Modal from '../../Components/Admin/AdminCropper';
import { useUpdateAdminMutation } from '../../redux/slices/Api/EndPoints/AdminEndpoints';
import { setAdminCredentials } from '../../redux/slices/Reducers/AdminReducer';

const AdminProfile = () => {
  const adminInfo = useSelector((state: RootState) => state.adminAuth.adminInfo);
  const [updateAdmin, { isLoading }] = useUpdateAdminMutation();
  const dispatch = useDispatch();

  const [profileModalOpen, setProfileModalOpen] = useState<boolean>(false);
  const [bgModalOpen, setBgModalOpen] = useState<boolean>(false);
  const [editing, setEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    _id: adminInfo._id,
    Fname: adminInfo.Fname,
    Lname: adminInfo.Lname,
    profile: adminInfo.profile,
    bg: adminInfo.bg,
  });

  const profileUrl = useRef<string>(adminInfo.profile);
  const bgUrl = useRef<string>(adminInfo.bg);

  const updateProfileImage = (imgSrc: string) => {
    profileUrl.current = imgSrc;
    const file = convertBase64ToFile(imgSrc, "profile.png");
    setFormData({ ...formData, profile: file });
  };

  const updateBgImage = (imgSrc: string) => {
    bgUrl.current = imgSrc;
    const file = convertBase64ToFile(imgSrc, "bg.png");
    setFormData({ ...formData, bg: file });
  };

  const convertBase64ToFile = (base64: string, fileName: string): File => {
    const byteString = atob(base64.split(',')[1]);
    const mimeString = base64.split(',')[0].split(':')[1].split(';')[0];
    const byteArray = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
      byteArray[i] = byteString.charCodeAt(i);
    }
    return new File([byteArray], fileName, { type: mimeString });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append('_id', formData._id);
    formDataToSend.append('Fname', formData.Fname);
    formDataToSend.append('Lname', formData.Lname);
    if (formData.profile instanceof File) {
      formDataToSend.append('profile', formData.profile);
    }
    if (formData.bg instanceof File) {
      formDataToSend.append('bg', formData.bg);
    }
    const response: any = await updateAdmin(formDataToSend);

    if (response.data) {
      dispatch(setAdminCredentials(response.data.admin));
      setEditing(false);
    }
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Profile" />
      {!editing ? (
        <div className="overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="relative z-20 h-35 md:h-65">
            <img
              src={adminInfo.bg}
              alt="profile cover"
              className="h-full w-full rounded-tl-sm rounded-tr-sm object-cover object-center"
            />
            <div className="absolute bottom-1 right-1 z-10 xsm:bottom-4 xsm:right-4">
              <button
                onClick={() => setEditing(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
              >
                Edit
              </button>
            </div>
          </div>
          <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
            <div className="relative z-30 mx-auto -mt-22 h-30 w-full max-w-30 rounded-full bg-white/20 p-1 backdrop-blur sm:h-44 sm:max-w-44 sm:p-3">
              <div className="relative drop-shadow-2 ">
                <img src={adminInfo.profile} className="rounded-full" alt="profile" />
              </div>
            </div>
            <div className="mt-2.5 flex items-center justify-center">
              <h3 className="mr-2.5 text-2xl font-semibold text-black dark:text-white">
                {adminInfo.Fname} {adminInfo.Lname}
              </h3>
            </div>
            <p className="text-sm">{adminInfo.email}</p>
          </div>
        </div>
      ) : (!bgModalOpen  && !profileModalOpen && (
        <div className="overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <button
              onClick={() => {setEditing(false),setBgModalOpen(false)}}
              className="mb-4 bg-gray-500 text-white px-4 py-2 rounded-lg"
            >
              <i className="fa fa-arrow-circle-left" style={{fontSize:"24px"}}></i>
            </button>
          <div className="relative flex justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mt-10 mb-10">
            
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <div>
                <label htmlFor="Fname" className="block text-sm font-medium text-black">First Name</label>
                <input
                  id="Fname"
                  name="Fname"
                  type="text"
                  value={formData.Fname}
                  onChange={handleChange}
                  className="block w-full text-black px-4 py-2 mt-1 border rounded-md"
                />
              </div>
              <div>
                <label htmlFor="Lname" className="block text-sm font-medium text-black">Last Name</label>
                <input
                  id="Lname"
                  name="Lname"
                  type="text"
                  value={formData.Lname}
                  onChange={handleChange}
                  className="block w-full px-4 py-2 mt-1 border text-black rounded-md"
                />
              </div>
              <div>
                <label htmlFor="profile" className="block text-sm font-medium text-gray-700">Profile Image</label>
                <button
                  type="button"
                  onClick={() => setProfileModalOpen(true)}
                  className="block w-full px-5 py-3 text-black  bg-gray-200 mt-1 rounded-lg"
                >
                  Change Profile Picture
                </button>
                {profileUrl.current && (
                  <img src={profileUrl.current} alt="Profile" className="mt-2 w-24 h-24 rounded-full mx-auto" />
                )}
              </div>
              <div>
                <label htmlFor="bg" className="block text-sm font-medium text-gray-700">Background Image</label>
                <button
                  type="button"
                  onClick={() => setBgModalOpen(true)}
                  className="block w-full px-5 py-3 text-black bg-gray-200 mt-1 rounded-lg"
                >
                  Change Background Image
                </button>
                {bgUrl.current && (
                  <img src={bgUrl.current} alt="Background" className="mt-2 w-full h-24 rounded-lg mx-auto" />
                )}
              </div>
              <div className="mt-4">
                <button
                  type="submit"
                  className={`w-full px-4 py-2 text-white bg-blue-600 rounded-md ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                  disabled={isLoading}
                >
                  {isLoading ? "Updating..." : "Update"}
                </button>
              </div>
            </form>
          </div>
          </div>
        </div>)
      )}

      {profileModalOpen && (
        <Modal
          updateAvatar={updateProfileImage}
          closeModal={() => setProfileModalOpen(false)}
        />
      )}

      {bgModalOpen && (
        <Modal
          updateAvatar={updateBgImage}
          closeModal={() => setBgModalOpen(false)}
        />
      )}
    </DefaultLayout>
  );
};

export default AdminProfile;
