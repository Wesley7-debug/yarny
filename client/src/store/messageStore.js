import { create } from "zustand";
import authStore from "./authStore";
import useGroupStore from "./groupStore";
import useAuthStore from "./authStore";

const CLIENT_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5000";

const messageStore = create((set, get) => ({
  messages: [],
  isGettingConversation: false,
  selectedUser: null,
  conversationId: null,

  getMessages: async (userId) => {
    set({ isGettingConversation: true });

    try {
      const response = await fetch(`${CLIENT_URL}/api/message/${userId}`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Error ${response.status}: ${text}`);
      }

      const data = await response.json();
      console.log("data received", data);
      set({
        messages: data.messages || data,
        conversationId: data.conversationId,
      });
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
      set({ isGettingConversation: false });
    }
  },

  sendMessage: async ({ text, image }) => {
    const { conversationId } = get();
    const selectedGroup = useGroupStore.getState().selectedGroup;

    if (!conversationId && !selectedGroup) {
      console.log("No conversation or group selected");
      return;
    }

    try {
      if (selectedGroup) {
        const formData = new FormData();

        if (text) formData.append("text", text); // ✅ key must be "content"

        if (image) {
          if (Array.isArray(image)) {
            image.forEach((file) => formData.append("attachments", file)); // ✅ key matches multer
          } else {
            formData.append("attachments", image);
          }
        }

        const userId = useAuthStore.getState().userId;
        formData.append("senderId", userId); // ✅ required
        formData.append("groupId", selectedGroup._id);
        const response = await fetch(
          `${CLIENT_URL}/api/group/${selectedGroup._id}/messages`,
          {
            method: "POST",
            credentials: "include",
            body: formData,
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Error sending group message:", errorText);
          return;
        }

        const newMessage = await response.json();
        useGroupStore.setState((state) => ({
          groupMessages: [...(state.groupMessages || []), newMessage],
        }));
      } else {
        // Send direct message
        const response = await fetch(
          `${CLIENT_URL}/api/message/send/${conversationId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ text, image }),
            credentials: "include",
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Error sending direct message:", errorText);
          return;
        }

        const data = await response.json();
        set((state) => ({
          messages: [...state.messages, data],
        }));
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  },

  editMessage: async (Id, messageId, newMessage) => {
    const selectedGroup = useGroupStore.getState().selectedGroup;

    try {
      if (selectedGroup) {
        // Edit group message
        const response = await fetch(
          `${CLIENT_URL}/api/group/${selectedGroup._id}/messages/${messageId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ message: newMessage }),
          }
        );

        if (!response.ok) {
          const text = await response.text();
          console.error("Error editing group message:", text);
          return;
        }

        const updatedMessage = await response.json();
        useGroupStore.setState((state) => ({
          groupMessages: state.groupMessages.map((msg) =>
            msg._id === messageId ? updatedMessage : msg
          ),
        }));
      } else {
        // Edit direct message
        const response = await fetch(
          `${CLIENT_URL}/api/message/edit/${messageId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ message: newMessage }),
            credentials: "include",
          }
        );

        const updatedMessage = await response.json();
        set((state) => ({
          messages: state.messages.map((msg) =>
            msg.id === messageId ? updatedMessage : msg
          ),
        }));
      }
    } catch (error) {
      console.error("Failed to edit message:", error);
    }
  },

  deleteMessage: async (Id, messageId) => {
    const selectedGroup = useGroupStore.getState().selectedGroup;

    try {
      if (selectedGroup) {
        // Delete group message
        await fetch(
          `${CLIENT_URL}/api/group/${selectedGroup._id}/messages/${messageId}`,
          {
            method: "DELETE",
            credentials: "include",
          }
        );

        useGroupStore.setState((state) => ({
          groupMessages: state.groupMessages.filter(
            (msg) => msg._id !== messageId
          ),
        }));
      } else {
        // Delete direct message
        await fetch(`${CLIENT_URL}/api/message/delete/${messageId}`, {
          method: "DELETE",
          credentials: "include",
        });

        set((state) => ({
          messages: state.messages.filter((msg) => msg.id !== messageId),
        }));
      }
    } catch (error) {
      console.error("Failed to delete message:", error);
    }
  },

  subscribeToMessages: () => {
    const socket = authStore.getState().socket;
    const { selectedUser } = get();
    const selectedGroup = useGroupStore.getState().selectedGroup;

    if (!socket) {
      console.warn("Socket not connected yet");
      return;
    }

    if (selectedUser) {
      socket.on("newMessage", (newMessage) => {
        const isFromSelectedUser = newMessage.senderId === selectedUser._id;
        if (!isFromSelectedUser) return;

        set((state) => ({
          messages: [...state.messages, newMessage],
        }));
      });
    }

    if (selectedGroup) {
      // ✅ New group message
      socket.on("newGroupMessage", (newGroupMessage) => {
        if (newGroupMessage.groupId !== selectedGroup._id) return;

        useGroupStore.setState((state) => ({
          groupMessages: [...state.groupMessages, newGroupMessage],
        }));
      });

      // ✅ Group message deleted
      socket.on("groupMessageDeleted", ({ messageId }) => {
        useGroupStore.setState((state) => ({
          groupMessages: state.groupMessages.filter(
            (msg) => msg._id !== messageId
          ),
        }));
      });
    }
  },

  unsubscribeFromMessages: () => {
    const socket = authStore.getState().socket;
    if (!socket) return;

    socket.off("newMessage");
    socket.off("newGroupMessage");
    socket.off("groupMessageDeleted");
  },

  setSelectedUser: async (selectedUser) => {
    console.log("Setting selectedUser:", selectedUser);
    useGroupStore.setState({ selectedGroup: null });
    set({ selectedUser });

    if (selectedUser && selectedUser._id) {
      await get().getMessages(selectedUser._id);
    }
  },
}));

export default messageStore;
