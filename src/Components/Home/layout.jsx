import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import backgroundImage from "../../assets/background.jpg";

const Layout = () => {
  return (
    <div className="flex flex-col h-screen overflow-hidden relative">
      <div
        className="absolute inset-0 z-[-1] opacity-70"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <Header />
      <div className="flex-1 overflow-y-auto scrollbar-hide mt-20">
        {" "}
        {/* Adjust margin-top based on your Header height */}
        <div className="h-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
