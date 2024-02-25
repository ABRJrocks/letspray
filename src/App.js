import React, { useState, useEffect } from "react";
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
import Logo from "../src/assets/logo.png";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  function LoadingScreen() {
    return (
      <div className="flex h-screen items-center justify-center">
        <img
          src={Logo}
          alt="Logo"
          className="w-[350px] animate-pulse opacity-0 transition-opacity duration-500 ease-in-out"
        />
      </div>
    );
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);

        // Check if the user's email is verified
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    // Clean-up function
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

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
