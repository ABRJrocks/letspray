import React from "react";
import {
  HiOutlineBell,
  HiOutlineChatAlt,
  HiOutlineUserCircle,
} from "react-icons/hi";
import Logo from "../../assets/logo.png";

export default function Header() {
  return (
    <div className="bg-white h-16 px-4 flex justify-between items-center border-b-2 shadow-md">
      <div className="flex items-center space-x-2">
        <img src={Logo} alt="logo" className="h-10" />
        <p className="text-xl font-semibold text-gray-800">LetsPray</p>
      </div>
      <div className="flex items-center space-x-4">
        {/* Chat Button */}
        <button className="text-gray-600 hover:text-gray-900">
          <HiOutlineChatAlt className="h-8 w-8" />
        </button>

        {/* User Profile Button */}
        <button className="text-gray-600 hover:text-gray-900">
          <HiOutlineUserCircle className="h-8 w-8" />
        </button>
      </div>
    </div>
  );
}
