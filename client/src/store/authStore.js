import { create } from "zustand";
import { io } from "socket.io-client";
const CLIENT_URL = import.meta.env.VITE_BASE_URL;
const socket = io(CLIENT_URL);

const authStore = create((set) => ({
  authUser: null,
  isRegistering: false,
  isSigningIn: false,
  isSigningOut: false,
  isAuthenticating: true,

  setAuthUser: async () => {
    try {
      const res = await fetch(`${CLIENT_URL}/api/auth/user`, {
        method: "GET",
        credentials: "include",
      });

      if (res.ok) {
        const user = await res.json();
        socket.on("connect", () => {
          console.log("Connected to socket server");
        });
        set({ authUser: user, isAuthenticating: false });
      } else {
        set({ authUser: null, isAuthenticating: false });
      }
    } catch (error) {
      console.error("Error fetching auth user:", error);
      set({ authUser: null, isAuthenticating: false });
    }
  },
  signIn: async (email, password) => {
    set({ isSigningIn: true });

    try {
      const res = await fetch(`${CLIENT_URL}/api/auth/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });
      if (res.ok) {
        const user = await res.json();

        socket.on("connect", () => {
          console.log("Connected to socket server");
        });
        set({ authUser: user, isSigningIn: false });
      } else {
        throw new Error("Sign in failed");
      }
    } catch (error) {
      console.error("Sign in error:", error);
      set({ isSigningIn: false });
    }
  },
  signUp: async (name, email, password, bio, nickname) => {
    set({ isRegistering: true });
    try {
      const res = await fetch(`${CLIENT_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, bio, nickname }),
        credentials: "include",
      });

      if (res.ok) {
        const user = await res.json();
        set({ authUser: user, isRegistering: false });
      } else {
        throw new Error("Sign up failed");
      }
    } catch (error) {
      console.error("Sign up error:", error);
      set({ isRegistering: false });
    }
  },
  signOut: async () => {
    set({ isSigningOut: true });
    try {
      const res = await fetch(`${CLIENT_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (res.ok) {
        set({ authUser: null, isSigningOut: false });
        socket.disconnect();
      } else {
        throw new Error("Sign out failed");
      }
    } catch (error) {
      console.error("Sign out error:", error);
      set({ isSigningOut: false });
    }
  },
}));

export default authStore;
