import React, { useCallback, useState } from "react";
import debounce from "../utils/debounce";
import authStore from "../store/authStore";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null); // null | 'success' | 'error'
  const [resetToken, setResetToken] = useState(null);
  const { sendEmailToPassword, isCheckingEmail } = authStore();

  const debouncedSendEmail = useCallback(
    debounce(async (emailValue) => {
      const result = await sendEmailToPassword(emailValue);
      if (result.status === "success" && result.token) {
        setResetToken(result.token);
        setStatus("success");
      } else {
        setStatus("error");
      }
    }, 800),
    [authStore]
  );

  const handleSendReset = () => {
    if (!email.includes("@")) {
      setStatus("error");
      return;
    }

    setStatus(null);
    debouncedSendEmail(email);
  };

  const baseUrl = "http://localhost:5173";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-purple-100 px-4">
      <div className="bg-white shadow-xl rounded-xl p-8 sm:p-10 max-w-md w-full border border-purple-300">
        <h1 className="text-3xl font-bold text-purple-700 mb-4 text-center">
          Reset Password
        </h1>
        <p className="text-sm text-gray-600 mb-6 text-center">
          Enter your email to generate a password reset link.
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
          {isCheckingEmail ? "Generating..." : "Generate Reset Link"}
        </button>

        {status === "success" && resetToken && (
          <div className="text-center mt-4">
            <p className="text-green-600 text-sm mb-2">
              Your password reset link:
            </p>
            <a
              href={`${baseUrl}/ResetPassword/${resetToken}`}
              target="_blank"
              rel="noopener noreferrer"
              className="break-words inline-block bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition"
            >
              this
            </a>
          </div>
        )}

        {status === "error" && !isCheckingEmail && (
          <p className="text-red-600 text-sm text-center mt-4">
            Couldn't generate reset link. Please check your email or try again.
          </p>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
