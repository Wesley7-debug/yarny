import React from "react";
import { PhoneOff, Video, VideoOff, Mic, MicOff } from "lucide-react";
import useCallStore from "../../store/useCallStore";

const CallControls = () => {
  const { toggleMute, toggleCamera, endCall, isMuted, isCameraOff, callType } =
    useCallStore();

  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-white/60 backdrop-blur-md border border-purple-200 shadow-xl rounded-2xl px-4 py-3 flex items-center gap-6 z-[9999]">
      {/* Mute */}
      <button
        onClick={toggleMute}
        className="w-10 h-10 rounded-full flex items-center justify-center bg-purple-700 text-white hover:bg-purple-800 transition-all active:scale-95 shadow"
        title="Mute"
      >
        {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
      </button>

      {/* End Call */}
      <button
        onClick={endCall}
        className="w-10 h-10 rounded-full flex items-center justify-center bg-red-600 text-white hover:bg-red-700 transition-all active:scale-95 shadow-xl"
        title="End Call"
      >
        <PhoneOff size={26} />
      </button>

      {/* Camera Toggle */}
      {callType === "video" && (
        <button
          onClick={toggleCamera}
          className="w-10 h-10 rounded-full flex items-center justify-center bg-purple-700 text-white hover:bg-purple-800 transition-all active:scale-95 shadow"
          title="Toggle Camera"
        >
          {isCameraOff ? <VideoOff size={20} /> : <Video size={20} />}
        </button>
      )}
    </div>
  );
};

export default CallControls;
