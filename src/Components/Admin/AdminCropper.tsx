import React from "react";
import CloseIcon from "../User/cropper/CloseIcon";
import ImageCropper from "../User/cropper/ImageCropper";

interface ModalProps {
  updateAvatar: (imgSrc: string) => void;
  closeModal: () => void;
}

const AdminModal: React.FC<ModalProps> = ({ updateAvatar, closeModal }) => {
  return (
    <div className="overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
         
         <button
              onClick={ closeModal}
              className="mb-4 bg-gray-500 text-white px-4 py-2 rounded-lg"
            >
              <i className="fa fa-arrow-circle-left" style={{fontSize:"24px"}}></i>
            </button>
        <div className="flex min-h-full justify-center px-2 py-12 text-center ">
          <div className="relative w-[95%] sm:w-[80%] min-h-[60vh] rounded-2xl bg-gray opacity-60 text-slate-100 text-left shadow-xl transition-all">
            <div className="px-5 py-4">
              <button
                type="button"
                className="rounded-md p-1 inline-flex items-center justify-center text-gray-400 hover:bg-gray-700 focus:outline-none absolute top-2 right-2"
                onClick={closeModal}
              >
                <span className="sr-only">Close menu</span>
                <CloseIcon />
              </button>
              <ImageCropper
                updateAvatar={updateAvatar}
                closeModal={closeModal}
              />
            </div>
          </div>
        
      </div>
    </div>
  );
};

export default AdminModal;
