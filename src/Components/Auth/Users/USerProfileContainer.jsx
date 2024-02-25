import React from "react";
import { auth } from "../firebase"; // Import Firebase auth module
import UserProfile from "./UserProfile"; // Assuming this is the path to your UserProfile component

const UserProfileContainer = () => {
  const user = auth.currentUser; // Get the current user from Firebase auth

  return (
    <div>
      <UserProfile user={user} />
    </div>
  );
};

export default UserProfileContainer;
