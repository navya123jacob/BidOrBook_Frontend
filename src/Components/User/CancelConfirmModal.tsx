import React from 'react';

interface ConfirmationModalProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white bg-opacity-80 p-6 rounded-lg max-w-lg mx-auto text-gray-900 relative">
        <div className="modal-header flex justify-between items-center mb-4">
          <h2 className="modal-title text-xl font-semibold">Confirmation</h2>
          <button className="modal-close text-gray-500 hover:text-gray-700" onClick={onCancel}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="modal-body mb-6">
          <p>{message}</p>
        </div>
        <div className="modal-footer flex justify-end space-x-4">
          <button
            className="modal-button confirm bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            onClick={onConfirm}
          >
            Confirm
          </button>
          <button
            className="modal-button cancel bg-red-800 text-white px-4 py-2 rounded hover:bg-red-600"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
