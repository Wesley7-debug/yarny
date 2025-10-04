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

import FriendsProfile from "./pages/FriendsProfile";
import CompleteSignup from "./pages/CompleteSignup";
import messageStore from "./store/messageStore";

const App = () => {
  const { authUser, isAuthenticating, CheckAuth } = authStore();
  const selectedUser = messageStore((state) => state.selectedUser);

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
  console.log("selectedUser", selectedUser);
  console.log("pathname", location.pathname);

  const showNavbarOn = ["/", "/settings"];
  const showNavbar =
    authUser && showNavbarOn.includes(location.pathname) && !selectedUser;

  return (
    <div>
      {showNavbar && <Navbar />}

      <ToastContainer position="top-right" autoClose={3000} max={3} />

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
          path="/completeSignup"
          element={authUser ? <CompleteSignup /> : <Navigate to="/" />}
        />
        <Route
          path="/SignUp"
          element={!authUser ? <SignUp /> : <Navigate to="/" />}
        />
        <Route
          path="/friendsProfile"
          element={authUser ? <FriendsProfile /> : <Navigate to="/Login" />}
        />
      </Routes>
    </div>
  );
};

export default App;
