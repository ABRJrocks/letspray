import React, { useState, useEffect } from "react";
import { HiOutlineBell, HiOutlineChatAlt } from "react-icons/hi";
import Logo from "../../assets/logo.png";
import { auth, db } from "../../Firebase/firebase";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const [userProfileImage, setUserProfileImage] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false); // State to manage dropdown visibility

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user profile data and extract profile image URL
    const fetchUserProfileImage = async () => {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          console.log("User is not authenticated.");
          return;
        }

        const userDoc = doc(db, "users", currentUser.uid);
        const userSnapshot = await getDoc(userDoc);
        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
          setUserProfileImage(userData.profilePicture);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfileImage();
  }, []);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };

  const toggleDropdown = () => {
    setShowDropdown((prevShowDropdown) => !prevShowDropdown);
  };

  return (
    <div className="bg-white h-20 px-4 flex justify-between items-center border-b-2 shadow-md">
      <div
        className="flex items-center space-x-2"
        onClick={() => navigate("/namaz")}
        style={{ cursor: "pointer" }}
      >
        <img src={Logo} alt="logo" className="h-12" />
        <p className="text-2xl font-bold text-gray-800">LetsPray</p>
      </div>
      <div className="flex items-center space-x-4 relative">
        {/* Chat Button */}
        <button
          className="text-gray-600 hover:text-gray-900"
          onClick={() => navigate("/chat")}
        >
          <HiOutlineChatAlt className="h-8 w-8" />
        </button>

        {/* User Profile Picture */}
        {userProfileImage && (
          <div className="relative">
            <button
              className="rounded-full h-14 w-14 object-cover overflow-hidden"
              onClick={toggleDropdown} // Toggle dropdown when profile picture is clicked
            >
              <img
                src={userProfileImage}
                alt="profile"
                className="h-12 w-12 object-cover"
              />
            </button>
            {/* Dropdown menu for logout */}
            {showDropdown && (
              <div className="absolute top-12 right-0 w-48 z-50 bg-white border rounded-lg shadow-md">
                <button
                  onClick={() => navigate("/profile")} // Use a callback function to avoid immediate execution
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left"
                >
                  Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
