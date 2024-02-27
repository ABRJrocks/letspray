import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import backgroundImage from "../../assets/background.jpg";

export default function layout() {
  return (
    <div className="flex flex-row h-screen w-screen overflow-hidden ">
      <div
        className="absolute top-0 left-0 right-0 bottom-0  z-[-1] opacity-70 "
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="flex-1">
        <Header />
        <div className="">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
