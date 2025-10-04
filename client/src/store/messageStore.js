import { create } from "zustand";
import authStore from "./authStore";

const CLIENT_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5000";
const messageStore = create((set, get) => ({
  messages: [],
  isGettingConversation: false,
  selectedUser: null,

  getMessages: async (Id) => {
    set({ isGettingConversation: true });

    try {
      const response = await fetch(`${CLIENT_URL}/api/messages/${Id}`, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Error ${response.status}: ${text}`);
      }
      const data = await response.json();

      set({ messages: data });
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
      set({ isGettingConversation: false });
    }
  },

  sendMessage: async ({ text, image }) => {
    const { selectedUser } = get();
    try {
      const response = await fetch(
        `${CLIENT_URL}/api/messages/send${selectedUser._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text, image }),
          credentials: "include",
        }
      );
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
      const response = await fetch(
        `${CLIENT_URL}/api/messages/edit${messageId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: newMessage }),
          credentials: "include",
        }
      );
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
      await fetch(`${CLIENT_URL}/api/messages/delete${messageId}`, {
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
      const isMessageSentFromSelectedUser =
        newMessage.senderId === selectedUser._id;
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

  setSelectedUser: (selectedUser) => {
    console.log("Setting selectedUser:", selectedUser);
    set({ selectedUser });
  },
}));

export default messageStore;
