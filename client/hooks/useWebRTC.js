// hooks/useWebRTC.js
import { useEffect, useRef } from "react";
import SimplePeer from "simple-peer";
import socket from "../src/utils/socket";
import useCallStore from "../src/store/useCallStore";

const iceServers = [{ urls: "stun:stun.l.google.com:19302" }];

const useWebRTC = ({ roomId, user, audioOnly = false }) => {
  const {
    setPeer,
    setLocalStream,
    setRemoteStream,
    setIsFromMe,
    setCallAccepted,
    setCallEnded,
    setCaller,
    setShowCallScreen,
    peer,
    localStream,
  } = useCallStore();

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  // Get user media
  useEffect(() => {
    (async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: !audioOnly,
        audio: true,
      });
      setLocalStream(stream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    })();
  }, []);

  // Handle socket listeners
  useEffect(() => {
    socket.emit("join-room", { roomId, user });

    socket.on("receive-call", ({ from, signal }) => {
      setCaller(from);
      setIsFromMe(false);
      setCallAccepted(false);
      setShowCallScreen(true);

      const answerPeer = new SimplePeer({
        initiator: false,
        trickle: false,
        stream: localStream,
        config: { iceServers },
      });

      answerPeer.on("signal", (answerSignal) => {
        socket.emit("answer-call", { to: from, signal: answerSignal });
      });

      answerPeer.on("stream", (stream) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = stream;
        }
        setRemoteStream(stream);
      });

      answerPeer.signal(signal);
      setPeer(answerPeer);
    });

    socket.on("call-accepted", ({ signal }) => {
      peer?.signal(signal);
      setCallAccepted(true);
    });

    socket.on("end-call", () => {
      endCall();
    });

    return () => {
      socket.off("receive-call");
      socket.off("call-accepted");
      socket.off("end-call");
    };
  }, [localStream, peer]);

  const callUser = (targetId) => {
    const newPeer = new SimplePeer({
      initiator: true,
      trickle: false,
      stream: localStream,
      config: { iceServers },
    });

    newPeer.on("signal", (signalData) => {
      socket.emit("call-user", {
        userToCall: targetId,
        signal: signalData,
        from: user,
        roomId,
      });
    });

    newPeer.on("stream", (stream) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = stream;
      }
      setRemoteStream(stream);
    });

    setPeer(newPeer);
    setIsFromMe(true);
    setShowCallScreen(true);
  };

  const answerCall = () => {
    setCallAccepted(true);
  };

  const endCall = () => {
    setCallEnded(true);
    setShowCallScreen(false);
    socket.emit("end-call", { roomId });
    peer?.destroy();
    setPeer(null);
    setRemoteStream(null);
  };

  return {
    localVideoRef,
    remoteVideoRef,
    callUser,
    answerCall,
    endCall,
  };
};

export default useWebRTC;
