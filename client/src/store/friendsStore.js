import { toast } from "react-toastify";
import { create } from "zustand";

const CLIENT_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5000";

const friendsStore = create((set) => ({
  friends: [],
  friendInfo: [],
  isGettingUsersFriends: false,
  isGettingUsersFriendRequest: false,
  isAcceptingFriendRequest: false,
  isRejectingFriendRequest: false,
  isGettingFriendInfo: false,
  isRemovingUserFriend: false,

  getAllUserFriends: async () => {
    set({ isGettingUsersFriends: true });
    try {
      const res = await fetch(`${CLIENT_URL}/api/friends`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        set({ friends: data.friends });
      } else {
        throw new Error("Failed to fetch friends");
      }
    } catch (error) {
      console.error("Error fetching friends:", error);
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
        toast.error("Failed to fetch friend requests, try again later");
        throw new Error("Failed to fetch friend requests");
      }
    } catch (error) {
      toast.error("Failed to fetch friend requests, try again later");
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
          friendRequests: state.friendRequests.filter((req) => req.id !== id),
        }));
        toast.success("Friend request accepted!");
      } else {
        throw new Error("Failed to accept friend request");
      }
    } catch (error) {
      throw new Error("something went wrong accepting request", error);
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
          friendRequests: state.friendRequests.filter((req) => req.id !== id),
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
  removeUserFriend: async (id) => {
    set({ isRemovingUserFriend: true });
    try {
      const res = await fetch(`${CLIENT_URL}/api/friends/remove/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        set((state) => ({
          friends: state.friends.filter((friend) => friend.id !== id),
        }));
        toast.success("Friend removed successfully!");
      } else {
        throw new Error("Failed to remove friend");
      }
    } catch (error) {
      toast.error("Something went wrong removing the friend");
      console.error("Error removing friend:", error);
    } finally {
      set({ isRemovingUserFriend: false });
    }
  },
}));

export default friendsStore;
