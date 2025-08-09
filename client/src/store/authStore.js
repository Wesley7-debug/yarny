import { create } from "zustand";
import { io } from "socket.io-client";
import { toast } from "react-toastify";
import { Navigate } from "react-router-dom";

const CLIENT_URL = "http://localhost:5000";

const socket = io(CLIENT_URL);

const authStore = create((set) => ({
  authUser: null,
  isRegistering: false,
  isSigningIn: false,
  isSigningOut: false,
  isAuthenticating: true,
  isCheckingEmail: false,
  isResetingPassword: false,

  CheckAuth: async () => {
    try {
      const res = await fetch(`${CLIENT_URL}/api/auth`);

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
        const { user, message } = await res.json();

        socket.on("connect", () => {
          console.log("Connected to socket server");
        });

        set({ authUser: user, isSigningIn: false });
        toast.success(message || "Signed in successfully!");
      } else {
        const errorData = await res.json();
        throw new Error(errorData.message || "Sign in failed");
      }
    } catch (error) {
      console.error("Sign in error:", error);
      toast.error(error.message || "Something went wrong while signing in.");
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
      });

      if (res.ok) {
        const user = await res.json();
        set({ authUser: user, isRegistering: false });
        toast.success("Registered successfully!");
      } else {
        throw new Error("Sign up failed");
      }
    } catch (error) {
      console.error("Sign up error:", error);
      set({ isRegistering: false });
      toast.error(error.message || "Something went wrong while signing up.");
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
  sendEmailToPassword: async (email) => {
    set({ isCheckingEmail: true });

    try {
      const res = await fetch(`${CLIENT_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok && data?.message === "Reset email sent") {
        toast.success("Password reset email sent successfully!");
      } else {
        toast.error(data?.message || "Failed to send reset email.");
      }
    } catch (error) {
      console.error("Error during password reset:", error);
      toast.error("Something went wrong while resetting the password.");
    } finally {
      set({ isCheckingEmail: false });
    }
  },
  resettPassword: async (password, token) => {
    set({ isResetingPassword: true });
    try {
      const res = await fetch(`${CLIENT_URL}/api/auth/reset-password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, token }),
      });
      if (res.ok) {
        toast.success("Password reset  successfully,!");
      } else {
        throw new Error("Failed to reset password");
      }
    } catch (error) {
      console.error("Error during password reset:", error);
      toast.error("Something went wrong while resetting the password.");
    } finally {
      set({ isCheckingEmail: false });
    }
  },
}));

export default authStore;
