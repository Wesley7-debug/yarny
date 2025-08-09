// src/pages/VerifyAccount.jsx
import { MailCheck } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function VerifyAccount() {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  useEffect(() => {
    const verifyEmail = async () => {
      const res = await fetch(`${BASE_URL}/api/auth/verify-email`);
      if (!res.ok) {
        console.error("Failed to verify email");
      }
    };
    verifyEmail();
  }, [BASE_URL]);

  return (
    <div className="h-screen flex items-center justify-center  ">
      <div className="text-center space-y-6 max-w-md px-4">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-purple-600/20">
          <MailCheck className="h-10 w-10 text-purple-900" />
        </div>
        <h1 className="text-3xl font-bold">Check Your Email</h1>
        <p className="text-gray-400">
          We’ve sent a verification link to your email address. Please check
          your inbox and click the link to verify your account.
        </p>
        {/* <p className="text-sm text-gray-500">
          Didn’t receive it? Check your spam folder or{" "}
          <Link to="/resend-verification" className="text-purple-700 underline">
            resend the email
          </Link>
          .
        </p> */}
      </div>
    </div>
  );
}
