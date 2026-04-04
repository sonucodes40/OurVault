import React from "react";

const Popup = ({ onClose, onConfirm }: any) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-xl shadow-xl w-80 text-center">

        <h2 className="text-xl font-bold mb-3">
          Opt-In Required
        </h2>

        <p className="mb-4 text-gray-600">
          Please opt-in to start using the app.
        </p>

        <button
          onClick={onConfirm}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          Opt-In Now
        </button>

        <button
          onClick={onClose}
          className="ml-3 text-gray-500"
        >
          Cancel
        </button>

      </div>
    </div>
  );
};

export default Popup;