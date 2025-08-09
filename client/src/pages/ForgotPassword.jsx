import React, { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import debounce from "../utils/debounce";
import authStore from "../store/authStore";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [emailStatus, setEmailStatus] = useState(null); // null | 'valid' | 'invalid'
  const { sendEmailToPassword, isCheckingEmail } = authStore();

  const debouncedSendEmail = useCallback(
    debounce(async (emailValue) => {
      const result = await sendEmailToPassword(emailValue);
      if (result.status === "success") {
        setEmailStatus("valid");
      } else {
        setEmailStatus("invalid");
      }
    }, 800),
    [authStore]
  );
  const handleSendReset = () => {
    if (!email.includes("@")) {
      setEmailStatus("invalid");
      return;
    }

    setEmailStatus(null); // reset before trying
    debouncedSendEmail(email);
  };

  const handleGoToMail = () => {
    window.open("https://mail.google.com", "_blank");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-purple-100 px-4">
      <div className="bg-white shadow-xl rounded-xl p-8 sm:p-10 max-w-md w-full border border-purple-300">
        <h1 className="text-3xl font-bold text-purple-700 mb-4 text-center">
          Forgot Password
        </h1>
        <p className="text-sm text-gray-600 mb-6 text-center">
          Enter your email to receive a password reset link.
        </p>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="w-full px-4 py-3 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 transition mb-3"
        />

        <button
          onClick={handleSendReset}
          disabled={isCheckingEmail || !email}
          className={`w-full py-3 rounded-md font-medium transition ${
            isCheckingEmail || !email
              ? "bg-purple-300 cursor-not-allowed"
              : "bg-purple-600 text-white hover:bg-purple-700"
          }`}
        >
          {isCheckingEmail ? "Sending..." : "Send Reset Link"}
        </button>

        {emailStatus === "valid" && !isCheckingEmail && (
          <div className="text-center mt-4">
            <p className="text-green-600 text-sm mb-2">
              Reset link sent to your email.
            </p>
            <button
              onClick={handleGoToMail}
              className="mt-2 inline-block bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition"
            >
              Go to Mail
            </button>
          </div>
        )}

        {emailStatus === "invalid" && !isCheckingEmail && (
          <p className="text-red-600 text-sm text-center mt-4">
            Email not found.{" "}
            <Link to="/register" className="text-purple-700 underline">
              Register here
            </Link>
            .
          </p>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
