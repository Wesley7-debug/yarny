import { useRef, useEffect, useState } from "react";
import socket from "../src/utils/socket";
import useCallStore from "../src/store/useCallStore";
import messageStore from "../src/store/messageStore";

const iceServers = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

const useWebRTC = () => {
  const {
    peer,
    setPeer,
    setCallAccepted,
    setCallEnded,
    setLocalStream,
    setRemoteStream,
  } = useCallStore();
  const { selectedUser } = messageStore();
  const targetId = selectedUser?._id;

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [remoteSocketId, setRemoteSocketId] = useState(null);

  let pc = peer || new RTCPeerConnection(iceServers);

  useEffect(() => {
    setPeer(pc);

    pc.onicecandidate = (e) => {
      if (e.candidate) {
        socket.emit("ice-candidate", {
          to: remoteSocketId,
          candidate: e.candidate,
        });
      }
    };

    pc.ontrack = (e) => {
      setRemoteStream(e.streams[0]);
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = e.streams[0];
      }
    };

    socket.on("receive-call", async ({ from, offer }) => {
      setRemoteSocketId(from);
      const stream = await getMedia();
      addTracksToPeer(stream);

      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      socket.emit("answer-call", { answer, to: from });
      setCallAccepted(true);
    });

    socket.on("call-answered", async ({ answer }) => {
      await pc.setRemoteDescription(new RTCSessionDescription(answer));
      setCallAccepted(true);
    });

    socket.on("ice-candidate", async ({ candidate }) => {
      if (candidate) {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });

    return () => {
      socket.off("receive-call");
      socket.off("call-answered");
      socket.off("ice-candidate");
    };
  }, [socket]);

  const getMedia = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    setLocalStream(stream);
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
    }
    return stream;
  };

  const addTracksToPeer = (stream) => {
    stream.getTracks().forEach((track) => {
      pc.addTrack(track, stream);
    });
  };

  const callUser = async () => {
    const stream = await getMedia();
    addTracksToPeer(stream);

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    socket.emit("call-user", {
      offer,
      targetId,
    });

    setRemoteSocketId(targetId);
  };

  const endCall = () => {
    pc.close();
    setCallEnded(true);
  };

  return {
    callUser,
    endCall,
    localVideoRef,
    remoteVideoRef,
  };
};

export default useWebRTC;
