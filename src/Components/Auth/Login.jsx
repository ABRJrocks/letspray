import React from "react";
import { FaGoogle } from "react-icons/fa";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../../Firebase/firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../../assets/background.jpg";
import Logo from "../../assets/logo.png";

const Login = () => {
  const navigate = useNavigate();
  const handleSignInGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      const user = result.user;

      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          name: user.displayName,
          profilePicture: user.photoURL,
        });
      }
      navigate("/");
      // Sign-in successful, you can redirect or perform other actions here
    } catch (error) {
      console.error("Error signing in with Google:", error.message);
      toast.error(error.message); // Display error in a Toast
    }
  };

  return (
    <div className="min-h-screen  flex flex-col justify-center items-center ">
      <div
        className="absolute top-0 left-0 right-0 bottom-0  z-[-1] opacity-70 "
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="backdrop-blur-md bg-opacity-50 rounded-3xl max-w-sm w-full bg-white p-8  shadow-lg">
        <img src={Logo} alt="logo" className="w-16 mb-2 mx-auto" />
        <h2 className="text-3xl font-bold text-center mb-6 z-[1]">
          One Step Closer to Deen
        </h2>
        <button
          onClick={handleSignInGoogle}
          className="flex items-center justify-center bg-[#9999ff] hover:bg-[#b5b5ff] text-white py-2 px-4 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <FaGoogle className="mr-2" /> Sign in with Google
        </button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
