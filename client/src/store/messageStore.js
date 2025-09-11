import { create } from "zustand";
import authStore from "./authStore";

const CLIENT_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5000";
const messageStore = create((set, get) => ({
  messages: [],
  isGettingConversation: false,
  selectedUser:null,

  getMessages: async (Id) => {
    set({ isGettingConversation: true });

    try {
      const response = await fetch(`${CLIENT_URL}/messages/${Id}`, {
        method: "POST",
        credentials: "include",
      });
      const data = await response.json();
      set({ messages: data });
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
      set({ isGettingConversation: false });
    }
  },
  sendMessage: async ( message) => {
      const { selectedUser } = get();
    try {
      const response = await fetch(`${CLIENT_URL}/messages/${selectedUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
        credentials: "include",
      });
      const data = await response.json();
      set((state) => ({
        messages: [...state.messages, data],
        
      }));
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  },
  editMessage: async (Id, messageId, newMessage) => {
    try {
      const response = await fetch(`${CLIENT_URL}/messages/${Id}/${messageId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: newMessage }),
        credentials: "include",
      });
      const data = await response.json();
      set((state) => ({
        messages: state.messages.map((msg) =>
          msg.id === messageId ? data : msg
        ),
      }));
    } catch (error) {
      console.error("Failed to edit message:", error);
    }
  },
  deleteMessage: async (Id, messageId) => {
    try {
      await fetch(`${CLIENT_URL}/messages/${Id}/${messageId}`, {
        method: "DELETE",
        credentials: "include",
      });
      set((state) => ({
        messages: state.messages.filter((msg) => msg.id !== messageId),
      }));
    } catch (error) {
      console.error("Failed to delete message:", error);
    }
  },
    subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = authStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;

      set({
        messages: [...get().messages, newMessage],
      });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = authStore.getState().socket;
    socket.off("newMessage");
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));

export default messageStore;
