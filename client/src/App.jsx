import { Loader } from "lucide-react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import authStore from "./store/authStore";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { useEffect } from "react";
import Navbar from "./components/reuseable/Navbar";
import SignUp from "./pages/SignUp";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import VerifyAccount from "./pages/VerifyAccount";
import VerifiedSuccess from "./pages/VerfiedSucess";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

const App = () => {
  const { authUser, isAuthenticating, CheckAuth } = authStore();

  useEffect(() => {
    CheckAuth();
  }, [CheckAuth]);

  if (isAuthenticating && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="animate-spin w-6 h-6 text-black" />
      </div>
    );
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
        <Route path="/VerifyAccount" element={<VerifyAccount />} />
        <Route path="/VerifiedSuccess/:token" element={<VerifiedSuccess />} />
        <Route path="/ForgotPassword" element={<ForgotPassword />} />
        <Route path="/ResetPassword/:token" element={<ResetPassword />} />
      </Routes>
    </div>
  );
};

export default App;
