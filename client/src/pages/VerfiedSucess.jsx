// src/pages/VerifiedSuccess.jsx
import { CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

const VerifiedSuccess = () => {
  return (
    <div className="h-screen flex items-center justify-center  ">
      <div className="text-center space-y-6 max-w-md px-4">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-600/20">
          <CheckCircle2 className="h-10 w-10 text-green-500" />
        </div>
        <h1 className="text-3xl font-bold">Account Verified!</h1>
        <p className="text-gray-400">
          Your account has been successfully verified. You're all set to start
          chatting and connecting.
        </p>

        <Link
          to="/"
          className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-md transition"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
};

export default VerifiedSuccess;
