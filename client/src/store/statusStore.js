import { toast } from "react-toastify";
import { create } from "zustand";
const CLIENT_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5000";

const STATUS_LOCAL_STORAGE_KEY = "myStatus";
const STATUS_EXPIRY_KEY = "myStatusExpiry";
const STATUS_EXPIRY_HOURS = 24;

const saveStatusToLocalStorage = (statuses) => {
  localStorage.setItem(STATUS_LOCAL_STORAGE_KEY, JSON.stringify(statuses));
  const expiry = Date.now() + STATUS_EXPIRY_HOURS * 60 * 60 * 1000;
  localStorage.setItem(STATUS_EXPIRY_KEY, expiry.toString());
};

const getStatusFromLocalStorage = () => {
  const expiry = localStorage.getItem(STATUS_EXPIRY_KEY);
  if (!expiry || Date.now() > Number(expiry)) {
    localStorage.removeItem(STATUS_LOCAL_STORAGE_KEY);
    localStorage.removeItem(STATUS_EXPIRY_KEY);
    return null;
  }
  const data = localStorage.getItem(STATUS_LOCAL_STORAGE_KEY);
  return data ? JSON.parse(data) : null;
};

const FRIEND_STATUS_LOCAL_STORAGE_KEY = "friendStatus";
const FRIEND_STATUS_EXPIRY_KEY = "friendStatusExpiry";
const FRIEND_STATUS_EXPIRY_HOURS = 24;
const VIEWED_STATUS_KEY = "viewedStatus";

// Save friend statuses to local storage
const saveFriendStatusToLocalStorage = (statuses) => {
  localStorage.setItem(
    FRIEND_STATUS_LOCAL_STORAGE_KEY,
    JSON.stringify(statuses)
  );
  const expiry = Date.now() + FRIEND_STATUS_EXPIRY_HOURS * 60 * 60 * 1000;
  localStorage.setItem(FRIEND_STATUS_EXPIRY_KEY, expiry.toString());
};

// Get friend statuses from local storage
const getFriendStatusFromLocalStorage = () => {
  const expiry = localStorage.getItem(FRIEND_STATUS_EXPIRY_KEY);
  if (!expiry || Date.now() > Number(expiry)) {
    localStorage.removeItem(FRIEND_STATUS_LOCAL_STORAGE_KEY);
    localStorage.removeItem(FRIEND_STATUS_EXPIRY_KEY);
    return null;
  }
  const data = localStorage.getItem(FRIEND_STATUS_LOCAL_STORAGE_KEY);
  return data ? JSON.parse(data) : null;
};

// Save viewed status IDs to local storage
const saveViewedStatus = (statusId) => {
  let viewed = JSON.parse(localStorage.getItem(VIEWED_STATUS_KEY) || "[]");
  if (!viewed.includes(statusId)) {
    viewed.push(statusId);
    localStorage.setItem(VIEWED_STATUS_KEY, JSON.stringify(viewed));
  }
};

// Get viewed status IDs from local storage
const getViewedStatus = () => {
  return JSON.parse(localStorage.getItem(VIEWED_STATUS_KEY) || "[]");
};

const useStatusStore = create((set) => ({
  statusId: null,
  myStatus: getStatusFromLocalStorage() || [],
  visibleStatus: [],
  isUploadingStatus: false,
  isdeletingStatus: false,
  friendStatus: getFriendStatusFromLocalStorage() || [],
  viewedStatus: getViewedStatus(),

  myStatuses: async () => {
    try {
      const res = await fetch(`${CLIENT_URL}/api/status/my-status`, {
        method: "GET",
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error("Failed to fetch my status");
      }
      const data = await res.json();
      console.log("Fetched my status:", data);
      set({ myStatus: data });
      saveStatusToLocalStorage(data);
      return data;
    } catch (error) {
      console.error("Error fetching my status:", error);
    }
  },

  uploadStatus: async ({ text, media, color }) => {
    set({ isUploadingStatus: true });
    try {
      const images = media
        .filter((m) => m.type === "image")
        .map((m) => ({ url: m.url, caption: m.caption }));
      const videos = media
        .filter((m) => m.type === "video")
        .map((m) => ({ url: m.url, caption: m.caption }));

      const texts = text ? [text] : [];

      const res = await fetch(`${CLIENT_URL}/api/status/create-status`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          texts,
          images,
          videos,
          color,
        }),
      });

      if (!res.ok) {
        toast.error("Failed to upload status");
        set({ isUploadingStatus: false });
        throw new Error("Upload failed");
      }

      const data = await res.json();
      await useStatusStore.getState().myStatuses();
      set({ isUploadingStatus: false });
      return data;
    } catch (error) {
      console.error("Upload failed:", error);
      set({ isUploadingStatus: false });
    }
  },

  deleteStatus: async ({ statusId }) => {
    set({ isdeletingStatus: true });
    try {
      const res = await fetch(
        `${CLIENT_URL}/api/status/delete-status/${statusId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!res.ok) {
        toast.error("Failed to delete status");
        set({ isdeletingStatus: false });
        throw new Error("Failed to delete status");
      }
      const data = await res.json();
      set({ isdeletingStatus: false });
      // Refresh myStatus after delete
      await useStatusStore.getState().myStatuses();
      return data;
    } catch (error) {
      console.error("Error deleting status:", error);
      set({ isdeletingStatus: false });
    }
  },
  getFriendStatus: async () => {
    try {
      const res = await fetch(`${CLIENT_URL}/api/status/friends-status`, {
        method: "GET",
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error("Failed to fetch friends' status");
      }
      const data = await res.json();
      set({ friendStatus: data });
      saveFriendStatusToLocalStorage(data);
      return data;
    } catch (error) {
      console.error("Error fetching friends' status:", error);
    }
  },
  markStatusAsViewed: (statusId) => {
    saveViewedStatus(statusId);
    set((state) => ({
      viewedStatus: [...new Set([...state.viewedStatus, statusId])],
    }));
  },
  refreshViewedStatus: () => {
    set({ viewedStatus: getViewedStatus() });
  },
}));

export default useStatusStore;
