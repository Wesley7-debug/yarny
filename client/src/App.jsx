import { Loader, Loading } from "lucide-react";
import { Navigate, Route, Router } from "react-router-dom";
import authStore from "./store/authStore";

const App = () => {
  const { authUser, isAuthenticating } = authStore();
  if (isAuthenticating)
    return (
      <div className="flex items-center justify-center h-screen">
        {/* <Loader className="animate-spin text-black" /> */}
        loading...
      </div>
    );
  return (
    <Router>
      <Route
        path="/"
        element={authUser ? <Home /> : <Navigate to="/login" />}
      />
    </Router>
  );
};

export default App;
