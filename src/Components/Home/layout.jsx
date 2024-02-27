import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import backgroundImage from "../../assets/background.jpg";

export default function Layout() {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <div
        className="absolute top-0 left-0 right-0 bottom-0 z-[-1] opacity-70"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <Header />
      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}
