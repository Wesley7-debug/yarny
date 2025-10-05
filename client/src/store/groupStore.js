import { create } from "zustand";

const CLIENT_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5000";

const useGroupStore = create((set) => ({
  groups: [],
  groupMessages: [],
  isGettingGroupMessages: false,
  isGettingGroups: false,
  isCreatingGroup: false,

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

  getGroupMessages: async (groupId) => {
    set({ isGettingGroupMessages: true });
    try {
      const response = await fetch(
        `${CLIENT_URL}/api/group/${groupId}/messages`
      );

      if (!response.ok) {
        console.error(`Failed to fetch messages for group ${groupId}`);
        set({ isGettingGroupMessages: false });
        return;
      }

      const messages = await response.json();
      console.log(`Fetched messages for group ${groupId}:`, messages);

      set({ groupMessages: messages, isGettingGroupMessages: false });
    } catch (error) {
      console.error(`Error fetching messages for group ${groupId}:`, error);
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
