import React from "react";
import CloseIcon from "./CloseIcon";
import ImageCropper from "./ImageCropper";

interface ModalProps {
  updateAvatar: (imgSrc: string) => void;
  closeModal: () => void;
}

const Modal: React.FC<ModalProps> = ({ updateAvatar, closeModal }) => {
  return (
    <div
      className="relative z-10 mt-20"
      aria-labelledby="crop-image-dialog"
      role="dialog"
      aria-modal="true"
    >
      
      <div className="fixed inset-0 bg-graydark bg-opacity-75 transition-all backdrop-blur-sm"></div>
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full justify-center px-2 py-12 text-center ">
          <div className="relative w-[95%] sm:w-[80%] min-h-[60vh] rounded-2xl bg-gray text-slate-100 text-left shadow-xl transition-all">
            <div className="px-5 py-4">
            <button
              onClick={ closeModal}
              className="mb-4 bg-gray-500 text-black px-4 py-2 rounded-lg"
            >
                <span className="sr-only">Close menu</span>
                <i className="fa fa-arrow-circle-left" style={{fontSize:"24px"}}></i>
              </button>
              <ImageCropper
                updateAvatar={updateAvatar}
                closeModal={closeModal}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
