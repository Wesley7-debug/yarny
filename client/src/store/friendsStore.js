import { toast } from "react-toastify";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import useAuthStore from "./authStore";

const CLIENT_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5000";

const useFriendsStore = create(
  persist(
    (set, get) => ({
      friends: [],
      friendInfo: [],
      friendRequests: [],
      onlineUsersId: [],
      isGettingUsersFriends: false,
      isGettingUsersFriendRequest: false,
      isAcceptingFriendRequest: false,
      isRejectingFriendRequest: false,
      isGettingFriendInfo: false,
      isRemovingUserFriend: false,
      hasFetchedFriends: false,

      getAllUserFriends: async () => {
        const { hasFetchedFriends } = get();
        if (hasFetchedFriends) return;

        set({ isGettingUsersFriends: true });

        try {
          const res = await fetch(`${CLIENT_URL}/api/friends`, {
            credentials: "include",
          });

          if (res.ok) {
            const data = await res.json();
            console.log("✅ Friends data:", data);
            set({ friends: data.friends, hasFetchedFriends: true });
          } else {
            throw new Error("Failed to fetch friends");
          }
        } catch (error) {
          console.error("❌ Error fetching friends:", error);
        } finally {
          set({ isGettingUsersFriends: false });
        }
      },

      getFriendsInfo: async (id) => {
        set({ isGettingFriendInfo: true });
        try {
          const res = await fetch(`${CLIENT_URL}/api/friends-info/${id}`, {
            credentials: "include",
          });

          if (res.ok) {
            const data = await res.json();
            set({ friendInfo: data });
          } else {
            throw new Error("Failed to fetch friend info");
          }
        } catch (error) {
          console.error("Error fetching friend info:", error);
        } finally {
          set({ isGettingFriendInfo: false });
        }
      },

      getUserFriendRequest: async (id) => {
        set({ isGettingUsersFriendRequest: true });
        try {
          const res = await fetch(`${CLIENT_URL}/api/friends/requests/${id}`, {
            credentials: "include",
          });

          if (res.ok) {
            const data = await res.json();
            set({ friendRequests: data.requests });
          } else {
            toast.error("Failed to fetch friend requests");
          }
        } catch (error) {
          toast.error("Failed to fetch friend requests");
          console.error("Error fetching friend requests:", error);
        } finally {
          set({ isGettingUsersFriendRequest: false });
        }
      },

      acceptFriendRequest: async (id) => {
        set({ isAcceptingFriendRequest: true });
        try {
          const res = await fetch(
            `${CLIENT_URL}/api/friends/accept-request/${id}`,
            {
              method: "POST",
              credentials: "include",
            }
          );

          if (res.ok) {
            const data = await res.json();
            set((state) => ({
              friends: [...state.friends, data.friend],
              friendRequests: state.friendRequests.filter(
                (req) => req.id !== id
              ),
            }));
            toast.success("Friend request accepted!");
          } else {
            throw new Error("Failed to accept friend request");
          }
        } catch (error) {
          console.error("Error accepting request:", error);
        } finally {
          set({ isAcceptingFriendRequest: false });
        }
      },

      rejectFriendRequest: async (id) => {
        set({ isRejectingFriendRequest: true });
        try {
          const res = await fetch(
            `${CLIENT_URL}/api/friends/reject-request/${id}`,
            {
              method: "POST",
              credentials: "include",
            }
          );

          if (res.ok) {
            set((state) => ({
              friendRequests: state.friendRequests.filter(
                (req) => req.id !== id
              ),
            }));
            toast.success("Friend request rejected!");
          } else {
            throw new Error("Failed to reject friend request");
          }
        } catch (error) {
          toast.error("Something went wrong rejecting the request");
          console.error("Error rejecting friend request:", error);
        } finally {
          set({ isRejectingFriendRequest: false });
        }
      },

      removeUserFriend: async () => {
        const { selectedUser } = useAuthStore.getState(); // or get() if stored locally
        if (!selectedUser?._id) return;

        set({ isRemovingUserFriend: true });

        try {
          const res = await fetch(
            `${CLIENT_URL}/api/friends/remove/${selectedUser._id}`,
            {
              method: "DELETE",
              credentials: "include",
            }
          );

          if (res.ok) {
            set((state) => ({
              friends: state.friends.filter(
                (friend) => friend.id !== selectedUser._id
              ),
            }));
            toast.success("Friend removed successfully!");
          } else {
            throw new Error("Failed to remove friend");
          }
        } catch (error) {
          toast.error("Error removing friend");
          console.error("Error removing friend:", error);
        } finally {
          set({ isRemovingUserFriend: false });
        }
      },

      listenForOnlineUsers: () => {
        const checkSocket = () => {
          const { socket } = useAuthStore.getState();
          if (!socket) {
            console.warn("⏳ Socket not ready, retrying...");
            setTimeout(checkSocket, 5000);
            return;
          }

          console.log("✅ Listening for online users...");
          socket.on("getOnlineUsers", (userIds) => {
            console.log("👥 Online users:", userIds);
            set({ onlineUsersId: userIds });
          });
        };

        checkSocket();
      },
    }),
    {
      name: "friends-store", // localStorage key
      partialize: (state) => ({
        friends: state.friends,
        friendRequests: state.friendRequests,
        hasFetchedFriends: state.hasFetchedFriends,
      }),
    }
  )
);

export default useFriendsStore;
