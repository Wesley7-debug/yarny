// components/CallScreen.jsx
import React from "react";
import useCallStore from "../store/useCallStore";
import CallControls from "./CallControls";
import IncomingCall from "./IncomingCall";
import useWebRTC from "../../../hooks/useWebRTC";

export default function CallScreen({ roomId, user }) {
  const { isFromMe, callAccepted, callEnded, caller } = useCallStore();
  const { localVideoRef, remoteVideoRef, callUser, answerCall, endCall } =
    useWebRTC({ roomId, user });

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      <div className="p-4 text-center font-semibold bg-white border-b">
        {callAccepted ? `Talking with ${caller}` : "Connecting..."}
      </div>

      <div className="relative flex-1 bg-black">
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />
        <video
          ref={localVideoRef}
          autoPlay
          muted
          playsInline
          className="absolute bottom-4 right-4 w-32 h-24 rounded-md ring-2 ring-white"
        />
      </div>

      <div className="p-4 bg-white border-t">
        <CallControls
          onCall={() => callUser("callee-id")} // Pass target user ID
          onEnd={endCall}
          disabled={callEnded}
        />
      </div>

      {!isFromMe && !callAccepted && caller && (
        <IncomingCall
          caller={caller}
          onAccept={answerCall}
          onReject={endCall}
        />
      )}
    </div>
  );
}
