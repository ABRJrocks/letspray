import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./Firebase/firebase";
import Login from "./Components/Auth/Login";
import NamazPage from "./Components/Home/NamazPage";

function App() {
  const [user, loading, error] = useAuthState(auth);

  // If loading, display loading indicator
  if (loading) return <div>Loading...</div>;

  // If there is an error, display error message
  if (error) return <div>Error: {error.message}</div>;

  return (
    <Router>
      <Routes>
        {/* If user is logged in, navigate to NamazPage, otherwise navigate to Login */}
        <Route
          path="/"
          element={user ? <Navigate to="/namaz" /> : <Navigate to="/login" />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/namaz" element={<NamazPage />} />
      </Routes>
    </Router>
  );
}

export default App;
