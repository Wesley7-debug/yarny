import { create } from "zustand";
import messageStore from "./messageStore";

const CLIENT_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5000";

const useGroupStore = create((set, get) => ({
  groups: [],
  groupMessages: [],
  selectedGroup: null,
  isGettingGroupMessages: false,
  isGettingGroups: false,
  isCreatingGroup: false,

  setSelectedGroup: async (selectedGroup) => {
    console.log("Setting   setSelectedgroup:", selectedGroup);
    messageStore.setState({ selectedUser: null });
    set({ selectedGroup });

    if (selectedGroup && selectedGroup._id) {
      await get().getGroupMessages(selectedGroup._id);
    }
  },

  getUsersGroup: async () => {
    set({ isGettingGroups: true });
    try {
      const response = await fetch(`${CLIENT_URL}/api/group`, {
        credentials: "include",
      });

      if (!response.ok) {
        console.error("Failed to fetch groups. Response:", response.text);
        set({ isGettingGroups: false });
        return;
      }

      const data = await response.json();
      console.log("Fetched groups:", data);
      set({ groups: data.groups, isGettingGroups: false });
    } catch (error) {
      console.error("Error fetching groups:", error);
      set({ isGettingGroups: false });
    }
  },

  getGroupMessages: async () => {
    const { selectedGroup } = get();
    set({ isGettingGroupMessages: true });
    try {
      const response = await fetch(
        `${CLIENT_URL}/api/group/${selectedGroup._id}/messages`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        console.error(
          `Failed to fetch messages for group ${selectedGroup._id}`
        );
        set({ isGettingGroupMessages: false });
        return;
      }

      const messages = await response.json();
      console.log(`Fetched messages for group ${selectedGroup._id}:`, messages);

      set({ groupMessages: messages, isGettingGroupMessages: false });
    } catch (error) {
      console.error(
        `Error fetching messages for group ${selectedGroup._id}:`,
        error
      );
      set({ isGettingGroupMessages: false });
    }
  },
  createClientGroup: async ({ name, participants, groupAvatar }) => {
    set({ isCreatingGroup: true });
    try {
      const response = await fetch(`${CLIENT_URL}/api/group/create-group`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          participants,
          groupAvatar,
        }),
      });

      if (!response.ok) {
        console.error(
          "Failed to create group. Response:",
          await response.text()
        );
        set({ isCreatingGroup: false });
        return;
      }

      const newGroup = await response.json();
      set((state) => ({
        groups: [...state.groups, newGroup],
      }));
      set({ isCreatingGroup: false });
      return newGroup;
    } catch (error) {
      console.error("Error creating group:", error);
    }
  },
}));

export default useGroupStore;
