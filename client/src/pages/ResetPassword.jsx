import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { toast } from "react-toastify";
import { Loader } from "lucide-react";
import authStore from "../store/authStore";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { resetPassword, isResetingPassword } = authStore();
  const navigate = useNavigate();
  const { token } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const success = await resetPassword(password, token);
    if (success !== false) {
      setTimeout(() => {
        navigate("/login");
      }, 2000); // Wait for toast to be seen
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-purple-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-xl p-8 sm:p-10 max-w-md w-full border border-purple-300"
      >
        <h1 className="text-3xl font-bold text-purple-700 mb-4 text-center">
          Reset Password
        </h1>
        <p className="text-sm text-gray-600 mb-6 text-center">
          Enter and confirm your new password.
        </p>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="New password"
          className="w-full px-4 py-3 mb-3 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 transition"
        />

        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm password"
          className="w-full px-4 py-3 mb-4 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 transition"
        />

        <button
          type="submit"
          disabled={isResetingPassword}
          className="w-full bg-purple-700 hover:bg-purple-800 text-white font-semibold py-3 rounded-md transition disabled:opacity-50"
        >
          {isResetingPassword ? (
            <Loader className="animate-spin" />
          ) : (
            "Reset Password"
          )}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
