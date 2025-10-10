// components/CallControls.jsx
import React from "react";

const CallControls = ({ onCall, onEnd, disabled }) => {
  return (
    <div className="flex justify-center space-x-4">
      <button
        onClick={onCall}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        disabled={disabled}
      >
        Call
      </button>
      <button
        onClick={onEnd}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        End
      </button>
    </div>
  );
};

export default CallControls;
