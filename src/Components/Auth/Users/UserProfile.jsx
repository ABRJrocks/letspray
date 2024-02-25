import React, { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDocument } from "react-firebase-hooks/firestore";
import { auth, db, storage } from "../firebase"; // Import Firebase modules
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { updateProfile } from "firebase/auth";

const UserProfile = () => {
  const [user] = useAuthState(auth);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [bio, setBio] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [loading, setLoading] = useState(true); // Track loading state

  // Fetch user data from Firestore
  const userRef = doc(db, "users", user.uid);
  const [snapshot] = useDocument(userRef);

  useEffect(() => {
    if (snapshot && snapshot.exists) {
      const userData = snapshot.data();
      setUsername(userData.username || "");
      setEmail(userData.email || "");
      setJobTitle(userData.jobTitle || "");
      setBio(userData.bio || "");
      setProfileImage(userData.profileImage || "");
      setLoading(false); // Update loading state once data is fetched
    }
  }, [snapshot]); // Only re-run effect if snapshot changes

  const jobOptions = [
    "Software Engineer",
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "Product Manager",
    "UI/UX Designer",
    "Data Scientist",
    "Business Analyst",
    "Project Manager",
    "Quality Assurance Engineer",
    "DevOps Engineer",
    "Technical Support Specialist",
  ];

  const handleUpdateProfile = async () => {
    try {
      // Update Firebase Authentication user profile
      await updateProfile(auth.currentUser, {
        displayName: username,
        photoURL: profileImage,
      });

      // Update user profile data in Firestore
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        username,
        email,
        jobTitle,
        bio,
        profileImage,
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
              profileImage: downloadURL,
            });
          });
        }
      );
    } catch (error) {
      console.error("Error uploading profile image:", error);
    }
  };
  return (
    <div className="bg-gray-100 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Profile Information
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Update your profile information below.
            </p>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Profile Picture
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 flex items-center">
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="h-32 w-32 rounded-full mr-4"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfileImageChange}
                    className="py-2 px-4 border border-gray-300 rounded-md bg-white shadow-sm focus:outline-none focus:border-primary"
                  />
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                  <input
                    type="text"
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:border-primary"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
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
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Job Title</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                  <select
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:border-primary"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                  >
                    {jobOptions.map((jobOption, index) => (
                      <option key={index} value={jobOption}>
                        {jobOption}
                      </option>
                    ))}
                  </select>
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Bio</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                  <textarea
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:border-primary"
                    rows="3"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                  ></textarea>
                </dd>
              </div>
              {/* Add more profile information fields as needed */}
            </dl>
          </div>
          <div className="px-4 py-3 sm:px-6">
            <button
              type="button"
              onClick={handleUpdateProfile}
              className="inline-flex items-center justify-center w-full rounded-md border border-transparent px-4 py-2 bg-primary text-base leading-6 font-medium text-white shadow-sm hover:bg-[#ff8080] focus:outline-none bg-[#9999ff] transition ease-in-out duration-150 sm:text-sm sm:leading-5"
            >
              Update Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
