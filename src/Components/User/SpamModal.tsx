import React from "react";

interface ModalProps {
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  children?: React.ReactNode;
}

const SpamModal: React.FC<ModalProps> = ({ onClose, onConfirm, title, description, children }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-black bg-opacity-75 absolute inset-0"></div>
      <div className="bg-white rounded p-6 z-10">
        <h2 className="text-2xl mb-4">{title}</h2>
        <p className="mb-4">{description}</p>
        {children}
        <div className="flex justify-end space-x-4">
          <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">
            Cancel
          </button>
          <button onClick={onConfirm} className="bg-red-600 text-white px-4 py-2 rounded">
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default SpamModal;
