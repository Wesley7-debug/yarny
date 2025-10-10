// components/IncomingCall.jsx
import React from "react";

const IncomingCall = ({ caller, onAccept, onReject }) => {
  return (
    <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg text-center space-y-4">
        <h2 className="text-xl font-semibold">Incoming call from {caller}</h2>
        <div className="flex justify-center gap-4">
          <button
            onClick={onAccept}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Accept
          </button>
          <button
            onClick={onReject}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
};

export default IncomingCall;
