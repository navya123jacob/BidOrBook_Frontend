import React, { Dispatch, SetStateAction, useState } from 'react';

interface ReasonModalProps {
  onSubmit: (reason: string) => void;
  onCancel: () => void;
  setReason:Dispatch<SetStateAction<string>>;
  reason:string

}

const ReasonModal: React.FC<ReasonModalProps> = ({ onSubmit, onCancel,setReason,reason }) => {
  
  const handleSubmit = () => {
    onSubmit(reason);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg max-w-lg mx-auto text-gray-800 relative opacity-85">
        <h2 className="text-xl font-bold mb-4">Reason for marking as spam</h2>
        <textarea
          className="w-full p-2 border rounded mb-4"
          rows={4}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
        <div className="flex justify-end space-x-2">
          <button
            className=" text-white px-4 py-2 rounded  bg-red-800"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="bg-graydark text-white px-4 py-2 rounded"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReasonModal;
