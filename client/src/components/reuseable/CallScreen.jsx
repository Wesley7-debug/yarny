import React, { useRef, useEffect } from "react";
import CallControls from "./CallControls";
import useCallStore from "../../store/useCallStore";

export default function CallScreen() {
  const {
    isFromMe,
    callAccepted,
    caller,
    localStream,
    remoteStream,
    callType,
  } = useCallStore();

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const remoteAudioRef = useRef(null); // 👈 added for audio fix

  // Set local video stream
  useEffect(() => {
    if (localStream && localVideoRef.current) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);
  useEffect(() => {
    if (remoteStream) {
      console.log("[👁️ CallScreen] remoteStream ID:", remoteStream.id);
      console.log("🎧 Audio tracks:", remoteStream.getAudioTracks());
      console.log("🎥 Video tracks:", remoteStream.getVideoTracks());
    }
  }, [remoteStream]);

  // Set remote video stream
  useEffect(() => {
    if (remoteStream && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  useEffect(() => {
    if (remoteStream && remoteAudioRef.current) {
      remoteAudioRef.current.srcObject = remoteStream;

      remoteAudioRef.current
        .play()
        .then(() => console.log("✅ remote audio autoplay started"))
        .catch((err) => console.warn("❌ remote audio autoplay failed:", err));
    }
  }, [remoteStream]);

  return (
    <div className="fixed inset-0 z-50 bg-black text-white flex flex-col">
      {/* Header */}
      <div className="w-full px-6 py-4 border-b border-purple-700 bg-gradient-to-r from-purple-700 via-purple-800 to-purple-900 text-center text-white font-semibold text-base shadow-md">
        {callAccepted
          ? `In Call with ${caller?.nickname || "User"}`
          : isFromMe
          ? "Calling..."
          : `${caller?.nickname || "Someone"} is calling you`}
      </div>

      {/* Main call screen */}
      <div className="flex-1 relative overflow-hidden">
        {callType === "video" && (
          <>
            {/* Remote Video Fullscreen */}
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Local Video Small */}
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className="absolute bottom-5 right-5 w-28 h-20 rounded-xl border-2 border-white shadow-md object-cover"
            />
          </>
        )}

        {callType === "audio" && (
          <div className="flex flex-col items-center justify-center h-full space-y-4 px-4 text-center">
            <img
              src={caller?.avatarUrl || "/Images/avatar.png"}
              alt="Caller Avatar"
              className="w-28 h-28 rounded-full border-4 border-purple-600 shadow-lg"
            />
            <h2 className="text-2xl font-bold tracking-tight">
              {caller?.nickname || "User"}
            </h2>
            <p className="text-purple-300 text-sm">
              {callAccepted ? "Connected" : "Ringing..."}
            </p>
          </div>
        )}

        {/* 🔊 Remote Audio (always mounted when stream exists) */}
        {/* <audio
          ref={remoteAudioRef}
          autoPlay
          playsInline
          controls={false}
          className="hidden"
        /> */}
        <audio
          ref={remoteAudioRef}
          autoPlay
          playsInline
          controls
          className="z-1000 w-full bg-pink-900 absolute top-1/2 "
        ></audio>
      </div>

      {/* Call Controls */}
      <div className="relative z-10">
        <CallControls />
      </div>
    </div>
  );
}
