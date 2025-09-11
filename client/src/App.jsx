import { Loader } from "lucide-react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import authStore from "./store/authStore";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { useEffect } from "react";
import Navbar from "./components/reuseable/Navbar";
import SignUp from "./pages/SignUp";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

const App = () => {
  const { authUser, isAuthenticating, CheckAuth } = authStore();
  const location = useLocation();

  useEffect(() => {
    CheckAuth();
  }, [CheckAuth]);

  if (isAuthenticating) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="animate-spin w-6 h-6 text-black" />
      </div>
    );
  }

  const showNavbarOn = ["/", "/settings"];
  const showNavbar = authUser && showNavbarOn.includes(location.pathname);

  return (
    <div>
      {showNavbar && <Navbar />}

      <ToastContainer position="bottom-right" autoClose={3000} />

      <Routes>
        <Route
          path="/"
          element={authUser ? <Home /> : <Navigate to="/Login" />}
        />
        <Route
          path="/Login"
          element={!authUser ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/SignUp"
          element={!authUser ? <SignUp /> : <Navigate to="/" />}
        />
        <Route path="/ForgotPassword" element={<ForgotPassword />} />
        <Route path="/ResetPassword/:token" element={<ResetPassword />} />
      </Routes>
    </div>
  );
};

export default App;
