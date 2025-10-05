// useTypingStore.js
import { create } from "zustand";

const useTypingStore = create((set) => ({
  typingInfo: null, // { userId, conversationId }
  setTypingInfo: (info) => set({ typingInfo: info }),
  clearTypingInfo: () => set({ typingInfo: null }),
}));

export default useTypingStore;
