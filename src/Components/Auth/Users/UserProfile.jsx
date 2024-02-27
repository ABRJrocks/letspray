import React, { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDocument } from "react-firebase-hooks/firestore";
import { auth, db, storage } from "../../../Firebase/firebase"; // Import Firebase modules
import { doc, updateDoc } from "firebase/firestore"; // Import updateDoc from Firestore
import {
  ref,
  uploadBytesResumable,
  getDownloadURL, // Import ref, uploadBytesResumable, and getDownloadURL from storage
} from "firebase/storage";
import Header from "../../Home/Header";

const UserProfile = () => {
  const [user] = useAuthState(auth);
  const [name, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [profilePicture, setProfileImage] = useState("");
  const [loading, setLoading] = useState(true); // Track loading state

  // Fetch user data from Firestore
  const userRef = doc(db, "users", user.uid);
  const [snapshot] = useDocument(userRef);

  useEffect(() => {
    if (snapshot && snapshot.exists) {
      const userData = snapshot.data();
      setUsername(userData.name || "");
      setEmail(userData.email || "");
      setProfileImage(userData.profilePicture || "");
      setLoading(false); // Update loading state once data is fetched
    }
  }, [snapshot]); // Only re-run effect if snapshot changes

  const handleUpdateProfile = async () => {
    try {
      // Update user profile data in Firestore
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        name,
        name,
        profilePicture,
      });

      console.log("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleProfileImageChange = async (event) => {
    try {
      const file = event.target.files[0];
      const storageRef = ref(
        storage,
        `profile_images/${user.uid}/${file.name}`
      );
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Handle progress, if needed
        },
        (error) => {
          // Handle unsuccessful upload
        },
        () => {
          // Handle successful upload
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setProfileImage(downloadURL);
            // Store the downloadURL in the user's profile data in Firestore
            const userRef = doc(db, "users", user.uid);
            updateDoc(userRef, {
              profilePicture: downloadURL,
            });
          });
        }
      );
    } catch (error) {
      console.error("Error uploading profile image:", error);
    }
  };

  return (
    <div>
      <div className=" min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div
          className="max-w-4xl mx-auto backdrop-blur-md
        bg-white bg-opacity-50 rounded-3xl mt-20 "
        >
          <div className=" shadow overflow-hidden sm:rounded-lg ">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Profile Information
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Update your profile information below.
              </p>
            </div>
            <div className="border-t ">
              <dl>
                <div className=" px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Profile Picture
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 flex items-center">
                    <img
                      src={profilePicture}
                      alt="Profile"
                      className="h-32 w-32 rounded-full mr-4"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfileImageChange}
                      className="py-2 px-4 border rounded-md  shadow-sm focus:outline-none focus:border-primary"
                    />
                  </dd>
                </div>
                <div className=" px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Full Name
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                    <input
                      type="text"
                      className="w-full border rounded-md px-3 py-2 focus:outline-none focus:border-primary"
                      value={name}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </dd>
                </div>
                <div className=" px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Email Address
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                    <input
                      type="email"
                      className="w-full border rounded-md px-3 py-2 focus:outline-none focus:border-primary"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled
                    />
                  </dd>
                </div>
              </dl>
            </div>
            <div className="px-4 py-3 sm:px-6">
              <button
                type="button"
                onClick={handleUpdateProfile}
                className="inline-flex items-center justify-center w-full rounded-md border border-transparent px-4 py-2 bg-primary text-base leading-6 font-medium text-white shadow-sm hover:bg-[#b5b5ff] focus:outline-none bg-[#9999ff] transition ease-in-out duration-150 sm:text-sm sm:leading-5"
              >
                Update Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
