import { create } from "zustand";
import { getSocket } from "../utils/socket";
import messageStore from "./messageStore";
import useAuthStore from "./authStore";

const iceServers = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

const useCallStore = create((set, get) => ({
  showCallScreen: false,
  showCallNotification: false,
  calleeUser: null,
  callAccepted: false,
  callEnded: false,
  isFromMe: false,
  remoteSocketId: null,
  peer: null,
  localStream: null,
  remoteStream: null,
  isMuted: false,
  isCameraOff: false,
  isVideoCall: true,
  callType: "video", // or "audio"
  caller: [],

  // ========== SETTERS ==========
  setCallType: (type) =>
    set({
      callType: type,
      isVideoCall: type === "video",
    }),
  setCaller: (val) => set({ caller: [val] }),
  setRemoteSocketId: (id) => set({ remoteSocketId: id }),
  setLocalStream: (stream) => set({ localStream: stream }),
  setRemoteStream: (stream) => set({ remoteStream: stream }),
  setShowCallScreen: (show) => set({ showCallScreen: show }),
  setCalleeUser: (user) => set({ calleeUser: user }),
  setCallAccepted: (val) => set({ callAccepted: val }),
  setCallEnded: (val) => set({ callEnded: val }),
  setIsFromMe: (val) => set({ isFromMe: val }),
  setPeer: (peer) => set({ peer }),
  setShowCallNotification: (val) => set({ showCallNotification: val }),

  // ========== GET MEDIA ==========
  // getMedia: async () => {
  //   const { isVideoCall } = get();
  //   try {
  //     const stream = await navigator.mediaDevices.getUserMedia({
  //       video: isVideoCall,
  //       audio: true,
  //     });
  //     get().setLocalStream(stream);
  //     return stream;
  //   } catch (error) {
  //     console.error("getMedia error:", error);
  //   }
  // },
  getMedia: async () => {
    const { isVideoCall } = get();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: isVideoCall,
        audio: true,
      });
      console.log("[📷 getMedia] Got stream:", stream);

      stream.getTracks().forEach((track) => {
        console.log(
          `[🎙️ Track Info] Kind: ${track.kind}, Enabled: ${track.enabled}`
        );
      });

      get().setLocalStream(stream);
      const audioTracks = stream.getAudioTracks();
      console.log("[🎙️ Local audio tracks count]:", audioTracks.length);

      if (audioTracks.length === 0) {
        console.warn(
          "⚠️ No audio track found! Microphone access may be blocked."
        );
      }

      return stream;
    } catch (error) {
      console.error("[❌ getMedia error]:", error);
    }
  },

  // ========== ADD TRACKS ==========
  // addTracksToPeer: (stream) => {
  //   const pc = get().peer;
  //   if (!pc) return;
  //   stream.getTracks().forEach((track) => {
  //     pc.addTrack(track, stream);
  //   });
  // },
  addTracksToPeer: (stream) => {
    const pc = get().peer;
    if (!pc) {
      console.warn("[⚠️ addTracksToPeer] No peer found.");
      return;
    }

    stream.getTracks().forEach((track) => {
      pc.addTrack(track, stream);
      console.log(`[➕ addTracksToPeer] Added track: ${track.kind}`);
    });

    const senders = pc.getSenders();
    console.log("[📡 Peer senders]", senders);
  },

  // ========== INIT PEER ==========
  initPeer: () => {
    const socket = getSocket();
    const pc = new RTCPeerConnection(iceServers);
    get().setPeer(pc);

    console.log("[🔌 initPeer] New RTCPeerConnection created.");

    pc.onicecandidate = (e) => {
      if (e.candidate) {
        const selectedUser = messageStore.getState().selectedUser;
        if (!selectedUser) return;

        socket.emit("ice-candidate", {
          to: selectedUser._id,
          candidate: e.candidate,
        });
      }
    };

    pc.oniceconnectionstatechange = () => {
      console.log("[🔄 ICE Connection State]", pc.iceConnectionState);
    };

    pc.onsignalingstatechange = () => {
      console.log("[📶 Signaling State]", pc.signalingState);
    };

    pc.ontrack = (e) => {
      const remoteStream = e.streams[0];

      get().setRemoteStream(remoteStream);

      const audioTracks = remoteStream.getAudioTracks();
      if (audioTracks.length === 0) {
        console.warn("🚫 No remote audio track received!");
      }
    };
  },

  // initPeer: () => {
  //   const socket = getSocket();
  //   const pc = new RTCPeerConnection(iceServers);
  //   get().setPeer(pc);

  //   pc.onicecandidate = (e) => {
  //     const selectedUser = messageStore.getState().selectedUser;
  //     if (!selectedUser) return;
  //     if (e.candidate && selectedUser._id) {
  //       socket.emit("ice-candidate", {
  //         to: selectedUser._id,
  //         candidate: e.candidate,
  //       });
  //     }
  //   };

  //   pc.ontrack = (e) => {
  //     const remoteStream = e.streams[0];
  //     get().setRemoteStream(remoteStream);
  //   };
  // },

  // ========== NOTIFY FRIEND ==========
  notifyUserIsCalling: () => {
    const socket = getSocket();
    const authUser = useAuthStore.getState().authUser;
    const selectedUser = messageStore.getState().selectedUser;
    if (!selectedUser) return;

    socket.emit("friendsCalling", {
      targetUserId: selectedUser._id,
      from: {
        id: authUser.userId,
        nickname: authUser.usernickname,
      },
      callType: get().callType,
    });

    console.log(
      "📞 Notifying user:",
      selectedUser._id,
      "from:",
      authUser.userId
    );
  },

  // ========== CALL USER ==========
  callUser: async () => {
    const socket = getSocket();
    const selectedUser = messageStore.getState().selectedUser;
    const authUser = useAuthStore.getState().authUser;

    if (!selectedUser) return;

    console.log("[📞 callUser] Calling user:", selectedUser);

    get().notifyUserIsCalling();
    get().initPeer();

    const pc = get().peer;
    const stream = await get().getMedia();

    get().addTracksToPeer(stream);

    try {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      console.log("[📤 callUser] Created offer:", offer);

      socket.emit("call-user", {
        offer,
        targetUserId: selectedUser._id,
        from: {
          id: authUser.userId,
          nickname: authUser.usernickname,
        },
      });

      set({
        showCallScreen: true,
        isFromMe: true,
        calleeUser: selectedUser,
      });
    } catch (error) {
      console.error("[❌ callUser error]", error);
    }
  },

  // callUser: async () => {
  //   const socket = getSocket();
  //   get().notifyUserIsCalling();

  //   const selectedUser = messageStore.getState().selectedUser;
  //   const authUser = useAuthStore.getState().authUser;
  //   if (!selectedUser || !authUser) return;

  //   get().initPeer();
  //   const pc = get().peer;
  //   const stream = await get().getMedia();
  //   get().addTracksToPeer(stream);

  //   try {
  //     const offer = await pc.createOffer();
  //     await pc.setLocalDescription(offer);

  //     socket.emit("call-user", {
  //       offer,
  //       targetUserId: selectedUser._id,
  //       from: {
  //         id: authUser.userId,
  //         nickname: authUser.usernickname,
  //       },
  //     });

  //     set({
  //       showCallScreen: true,
  //       isFromMe: true,
  //       calleeUser: selectedUser,
  //     });
  //   } catch (error) {
  //     console.error("callUser error:", error);
  //   }
  // },

  // ========== ANSWER CALL ==========
  // answerCall: async ({ offer, from }) => {
  //   const socket = getSocket();
  //   get().initPeer();

  //   const pc = get().peer;
  //   const stream = await get().getMedia();
  //   get().addTracksToPeer(stream);

  //   try {
  //     await pc.setRemoteDescription(new RTCSessionDescription(offer));
  //     const answer = await pc.createAnswer();
  //     await pc.setLocalDescription(answer);

  //     socket.emit("answer-call", {
  //       answer,
  //       to: from.id,
  //     });

  //     set({
  //       showCallScreen: true,
  //       callAccepted: true,
  //       isFromMe: false,
  //       remoteSocketId: from.id,
  //     });
  //   } catch (error) {
  //     console.error("answerCall error:", error);
  //   }
  // },

  answerCall: async ({ offer, from }) => {
    const socket = getSocket();
    console.log("[📥 answerCall] Received offer from:", from);

    get().initPeer();
    const pc = get().peer;

    const stream = await get().getMedia();
    get().addTracksToPeer(stream);

    try {
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      console.log("[🧾 answerCall] Set remote description");

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      console.log("[📤 answerCall] Sending answer:", answer);

      socket.emit("answer-call", {
        answer,
        to: from.id,
      });

      set({
        showCallScreen: true,
        callAccepted: true,
        isFromMe: false,
        remoteSocketId: from.id,
      });
    } catch (error) {
      console.error("[❌ answerCall error]", error);
    }
  },

  // ========== HANDLE ANSWER ==========
  handleCallAnswered: async ({ answer }) => {
    const pc = get().peer;
    if (!pc) {
      console.error("[❌ handleCallAnswered] Peer connection not found!");
      return;
    }
    try {
      await pc.setRemoteDescription(new RTCSessionDescription(answer));
      set({ callAccepted: true });
    } catch (error) {
      console.error("handleCallAnswered error:", error);
    }
  },

  // ========== HANDLE ICE ==========
  handleIceCandidate: async ({ candidate }) => {
    const pc = get().peer;
    if (!pc || !candidate) return;
    try {
      console.log("[🧊 handleIceCandidate] Adding ICE candidate:", candidate);
      await pc.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (error) {
      console.error("[❌ handleIceCandidate error]", error);
    }
  },

  // handleIceCandidate: async ({ candidate }) => {
  //   const pc = get().peer;
  //   if (candidate && pc) {
  //     try {
  //       await pc.addIceCandidate(new RTCIceCandidate(candidate));
  //       console.log("user ice", candidate);
  //     } catch (error) {
  //       console.error("handleIceCandidate error:", error);
  //     }
  //   }
  // },

  // ========== END CALL ==========
  // endCall: () => {
  //   const socket = getSocket();
  //   const selectedUser = messageStore.getState().selectedUser;
  //   if (!selectedUser) return;

  //   console.log("[📴 endCall] Ending call with:", selectedUser);

  //   const pc = get().peer;
  //   if (pc) {
  //     pc.close();
  //     console.log("[🧹 endCall] Peer connection closed");
  //     set({ peer: null });
  //   }

  //   const localStream = get().localStream;
  //   if (localStream) {
  //     localStream.getTracks().forEach((track) => {
  //       console.log(`[🛑 Stopping track] ${track.kind}`);
  //       track.stop();
  //     });
  //   }

  //   socket.emit("end-call", { roomId: selectedUser._id });

  //   set({
  //     callEnded: true,
  //     showCallScreen: false,
  //     callAccepted: false,
  //     remoteStream: null,
  //     localStream: null,
  //     remoteSocketId: null,
  //     isMuted: false,
  //     isCameraOff: false,
  //     calleeUser: null,
  //     isFromMe: false,
  //   });
  // },
  endCall: () => {
    const socket = getSocket();
    const selectedUser = messageStore.getState().selectedUser;

    // ✅ FIX: fallback if selectedUser is not set
    const remoteSocketId = get().remoteSocketId;

    console.log(
      "[📴 endCall] Ending call with:",
      selectedUser?._id || remoteSocketId
    );

    const pc = get().peer;
    if (pc) {
      pc.close();
      set({ peer: null });
    }

    const localStream = get().localStream;
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }

    // ✅ Use remoteSocketId if selectedUser is not available
    if (selectedUser || remoteSocketId) {
      socket.emit("end-call", {
        roomId: selectedUser?._id || remoteSocketId,
      });
    }

    set({
      callEnded: true,
      showCallScreen: false,
      callAccepted: false,
      remoteStream: null,
      localStream: null,
      remoteSocketId: null,
      isMuted: false,
      isCameraOff: false,
      calleeUser: null,
      isFromMe: false,
    });
  },

  // endCall: () => {
  //   const socket = getSocket();
  //   const selectedUser = messageStore.getState().selectedUser;
  //   if (!selectedUser) return;

  //   const pc = get().peer;
  //   if (pc) {
  //     pc.close();
  //     set({ peer: null });
  //   }

  //   const localStream = get().localStream;
  //   if (localStream) {
  //     localStream.getTracks().forEach((track) => track.stop());
  //   }

  //   socket.emit("end-call", { roomId: selectedUser._id });

  //   set({
  //     callEnded: true,
  //     showCallScreen: false,
  //     callAccepted: false,
  //     remoteStream: null,
  //     localStream: null,
  //     remoteSocketId: null,
  //     isMuted: false,
  //     isCameraOff: false,
  //     calleeUser: null,
  //     isFromMe: false,
  //   });
  // },

  // ========== TOGGLE MUTE ==========
  toggleMute: () => {
    const localStream = get().localStream;
    if (!localStream) return;
    const isMuted = get().isMuted;

    localStream.getAudioTracks().forEach((track) => {
      track.enabled = isMuted;
    });

    set({ isMuted: !isMuted });
  },

  // ========== TOGGLE CAMERA ==========
  toggleCamera: () => {
    const localStream = get().localStream;
    if (!localStream) return;
    const isCameraOff = get().isCameraOff;

    localStream.getVideoTracks().forEach((track) => {
      track.enabled = isCameraOff;
    });

    set({ isCameraOff: !isCameraOff });
  },

  // ========== SETUP SOCKET LISTENERS ==========
  setupSocketListeners: () => {
    const socket = getSocket();
    if (!socket) return;

    socket.on("receive-call", ({ from, offer }) => {
      set({ caller: [{ from, callType: get().callType, offer }] });
      console.log("📞 Incoming call from:", from.nickname);
    });

    socket.on("friendsCalling", ({ from, callType }) => {
      console.log("friendsCalling from:", from);
      set({
        caller: [{ from, callType }],
        callType,
        isVideoCall: callType === "video",
        showCallNotification: true,
      });
    });

    socket.on("call-declined", () => {
      console.log("🚫 Call was declined by the callee.");
      get().endCall();
      set({ showCallScreen: false, showCallNotification: false });
    });

    socket.on("call-answered", ({ answer }) => {
      get().handleCallAnswered({ answer });
      set({
        callAccepted: true,
        showCallScreen: true, // <— THIS IS IMPORTANT
      });
    });

    socket.on("ice-candidate", ({ candidate }) => {
      get().handleIceCandidate({ candidate });
    });

    socket.on("end-call", () => {
      get().endCall();
      set({ showCallScreen: false, showCallNotification: false });
    });
  },

  // ========== CLEAR STATE ==========
  clearCallState: () => {
    set({
      showCallScreen: false,
      calleeUser: null,
      callAccepted: false,
      callEnded: false,
      isFromMe: false,
      peer: null,
      localStream: null,
      remoteStream: null,
      remoteSocketId: null,
      isMuted: false,
      isCameraOff: false,
    });
  },
}));

export default useCallStore;
