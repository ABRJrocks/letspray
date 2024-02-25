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

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={user ? <Navigate to={<NamazPage />} /> : <Login />}
        />
        <Route path="/namaz" element={<NamazPage />} />
      </Routes>
    </Router>
  );
}

export default App;
