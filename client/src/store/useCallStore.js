import create from "zustand";

const useCallStore = create((set, get) => ({
  showCallScreen: false,
  calleeUser: null,
  callAccepted: false,
  callEnded: false,
  isFromMe: false,
  peer: null,

  setShowCallScreen: (show) => set({ showCallScreen: show }),
  setCalleeUser: (user) => set({ calleeUser: user }),

  setCallAccepted: (val) => set({ callAccepted: val }),
  setCallEnded: (val) => set({ callEnded: val }),
  setIsFromMe: (val) => set({ isFromMe: val }),
  setPeer: (peer) => set({ peer }),

  saveCallLog: (log) => {
    const calls = JSON.parse(localStorage.getItem("callHistory") || "[]");
    calls.push({ ...log, time: new Date().toISOString() });
    localStorage.setItem("callHistory", JSON.stringify(calls));
  },

  clearCallState: () =>
    set({
      showCallScreen: false,
      calleeUser: null,
      callAccepted: false,
      callEnded: false,
      isFromMe: false,
      peer: null,
    }),
}));
