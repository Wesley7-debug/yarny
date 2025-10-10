import { create } from "zustand";
import { persist } from "zustand/middleware";
import messageStore from "./messageStore";
import { toast } from "react-toastify";

const CLIENT_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5000";

const useGroupStore = create(
  persist(
    (set, get) => ({
      groups: [],
      groupMessages: [],
      groupInfo: [],
      selectedGroup: null,
      isGettingGroupMessages: false,
      isGettingGroupInfo: false,
      isGettingGroups: false,
      isCreatingGroup: false,
      isDeletingGroup: false,
      isGeneratingInviteLink: false,

      // ✅ Set and persist selected group + fetch invite token immediately
      setSelectedGroup: async (selectedGroup) => {
        console.log("Setting setSelectedGroup:", selectedGroup);
        messageStore.setState({ selectedUser: null });
        set({ selectedGroup });

        if (selectedGroup && selectedGroup._id) {
          await get().getGroupMessages(selectedGroup._id);
          await get().fetchInviteLink(selectedGroup._id); // ✅ fetch inviteToken
        }
      },

      // ✅ Fetch invite token
      fetchInviteLink: async (groupId) => {
        try {
          const response = await fetch(
            `${CLIENT_URL}/api/group/${groupId}/invite-link`,
            {
              credentials: "include",
            }
          );

          if (!response.ok) {
            console.error("Failed to fetch invite link");
            return;
          }

          const data = await response.json(); // expecting { inviteToken: string }
          set((state) => ({
            groupInfo: {
              ...state.groupInfo,
              inviteToken: data.inviteToken, // ✅ stored
            },
          }));
        } catch (error) {
          console.error("Error fetching invite link:", error);
        }
      },

      getUsersGroup: async () => {
        set({ isGettingGroups: true });
        try {
          const response = await fetch(`${CLIENT_URL}/api/group`, {
            credentials: "include",
          });

          if (!response.ok) {
            console.error("Failed to fetch groups.");
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

      getGroupInfo: async () => {
        const { selectedGroup } = get();
        if (!selectedGroup?._id) {
          console.error("No selected group to fetch info for.");
          return;
        }
        set({ isGettingGroupInfo: true });
        try {
          const response = await fetch(
            `${CLIENT_URL}/api/group/${selectedGroup._id}/info`,
            {
              credentials: "include",
            }
          );
          if (!response.ok) {
            console.error(
              `Failed to fetch info for group ${selectedGroup._id}`
            );
            set({ isGettingGroupInfo: false });
            return;
          }
          const info = await response.json();
          set({ groupInfo: info, isGettingGroupInfo: false });
        } catch (error) {
          console.error(
            `Error fetching info for group ${selectedGroup._id}:`,
            error
          );
          set({ isGettingGroupInfo: false });
        }
      },

      getGroupMessages: async () => {
        const { selectedGroup } = get();
        if (!selectedGroup?._id) return;
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

          const resData = await response.json();
          const newMessages = resData.messages.map((msg) => msg.message || msg);
          set({ groupMessages: newMessages, isGettingGroupMessages: false });
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
          const formData = new FormData();
          formData.append("name", name);
          formData.append("participants", JSON.stringify(participants));
          if (groupAvatar) {
            formData.append("groupAvatar", groupAvatar);
          }

          const response = await fetch(`${CLIENT_URL}/api/group/create-group`, {
            method: "POST",
            credentials: "include",
            body: formData,
          });

          if (!response.ok) {
            console.error("Failed to create group:", await response.text());
            set({ isCreatingGroup: false });
            return;
          }

          const newGroup = await response.json();
          set((state) => ({
            groups: [...state.groups, newGroup],
            isCreatingGroup: false,
          }));
          return newGroup;
        } catch (error) {
          console.error("Error creating group:", error);
          set({ isCreatingGroup: false });
        }
      },

      sendGroupMessage: async ({ text, image }) => {
        const { selectedGroup } = get();
        if (!selectedGroup?._id) {
          console.error("No selected group to send message to.");
          return;
        }

        try {
          const formData = new FormData();
          if (text) formData.append("text", text);
          if (image) {
            if (Array.isArray(image)) {
              image.forEach((file) => formData.append("attachments", file));
            } else {
              formData.append("attachments", image);
            }
          }

          const response = await fetch(
            `${CLIENT_URL}/api/group/${selectedGroup._id}/messages`,
            {
              method: "POST",
              credentials: "include",
              body: formData,
            }
          );

          if (!response.ok) {
            console.error(
              `Failed to send message to group ${selectedGroup._id}:`,
              await response.text()
            );
            return;
          }

          const resData = await response.json();
          const newMessage = resData.message || resData;
          set((state) => ({
            groupMessages: [...state.groupMessages, newMessage],
          }));
          return newMessage;
        } catch (error) {
          console.error(
            `Error sending message to group ${selectedGroup._id}:`,
            error
          );
        }
      },

      deleteGroup: async (navigate) => {
        const { selectedGroup } = get();
        if (!selectedGroup?._id) return;
        set({ isDeletingGroup: true });

        try {
          const response = await fetch(
            `${CLIENT_URL}/api/group/delete/${selectedGroup._id}`,
            {
              method: "DELETE",
              credentials: "include",
            }
          );

          if (!response.ok) {
            console.error(
              `Failed to delete group ${selectedGroup._id}:`,
              await response.text()
            );
            set({ isDeletingGroup: false });
            return;
          }

          toast.success("Group deleted successfully");

          set((state) => ({
            groups: state.groups.filter((g) => g._id !== selectedGroup._id),
            selectedGroup: null,
            groupMessages: [],
            groupInfo: [],
            isDeletingGroup: false,
          }));

          if (navigate) {
            navigate("/");
          }
        } catch (error) {
          console.error(`Error deleting group ${selectedGroup._id}:`, error);
          set({ isDeletingGroup: false });
        }
      },

      regenerateinvitationLink: async () => {
        const { selectedGroup } = get();
        if (!selectedGroup?._id) return;

        set({ isGeneratingInviteLink: true });
        try {
          const response = await fetch(
            `${CLIENT_URL}/api/group/${selectedGroup._id}/invite-link`,
            {
              method: "POST",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                expiresInHours: 168,
              }),
            }
          );

          if (!response.ok) {
            console.error(
              "Error regenerating invite link",
              await response.text()
            );
            set({ isGeneratingInviteLink: false });
            return;
          }

          const data = await response.json(); // Expecting inviteToken here too
          toast.success("New invite link generated successfully");

          set((state) => ({
            groupInfo: {
              ...state.groupInfo,
              inviteToken: data.inviteToken, // ✅ update inviteToken after regeneration
            },
            isGeneratingInviteLink: false,
          }));
        } catch (error) {
          console.error(
            `Error generating group link ${selectedGroup._id}:`,
            error
          );
          set({ isGeneratingInviteLink: false });
        }
      },
    }),
    {
      name: "group-store", // 🔐 Key for localStorage
      partialize: (state) => ({
        selectedGroup: state.selectedGroup, // ✅ Persist only this
      }),
    }
  )
);

export default useGroupStore;
