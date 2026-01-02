import React, { useEffect, useState, useRef } from "react";
import {
  IoSearchOutline,
  IoNotificationsOutline,
} from "react-icons/io5";
import { RiMenu2Line } from "react-icons/ri";
import { io } from "socket.io-client";
import { serverUrl } from "../../urls";

const Navbar = ({ setIsSideBarOpen }) => {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const socketRef = useRef(null);

  useEffect(() => {
    const SOCKET_URL = serverUrl.replace("/api", "");

    socketRef.current = io(SOCKET_URL, {
      transports: ["polling", "websocket"],
      withCredentials: true,
      path: "/socket.io",
    });

    socketRef.current.on("connect", () => {
      socketRef.current.emit("join-admin-navbar");
    });

    socketRef.current.on("notification", (payload) => {
      setNotifications((prev) => [
        {
          id: Date.now(),
          title: payload.title,
          message: payload.message,
          time: new Date().toLocaleTimeString(),
        },
        ...prev,
      ]);
    });

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, []);

  return (
    <>
      {/* NAVBAR */}
      <div className="md:h-[65px] md:w-full w-screen flex items-center justify-between z-10 py-3 px-5 relative bg-white">

        {/* LEFT SECTION */}
        <div className="flex items-center gap-4">

          {/* MOBILE MENU + SEARCH ICON */}
          <div className="text-2xl flex items-center gap-3">
            <RiMenu2Line
              className="md:hidden cursor-pointer"
              onClick={() => setIsSideBarOpen(true)}
            />

            <IoSearchOutline
              className="md:hidden cursor-pointer"
              onClick={() => setShowMobileSearch(true)}
            />
          </div>

          {/* DESKTOP SEARCH */}
          <div
            className="
              hidden md:flex
              items-center gap-2
              bg-white
              border border-gray-200
              rounded-xl
              px-4 py-2
              shadow-sm
              focus-within:ring-2 focus-within:ring-[#B692F6]
              transition
            "
          >
            <IoSearchOutline className="text-gray-400 text-lg" />
            <input
              type="text"
              placeholder="Search..."
              className="
                outline-none
                bg-transparent
                text-sm
                w-64
                placeholder:text-gray-400
                font-Poppins
              "
            />
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-5 text-2xl cursor-pointer relative">
          {/* NOTIFICATIONS */}
          <div
            className="relative"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <IoNotificationsOutline />

            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white w-5 h-5 text-xs flex items-center justify-center rounded-full">
                {notifications.length}
              </span>
            )}
          </div>
        </div>

        {/* NOTIFICATION DROPDOWN */}
        {showDropdown && (
          <div className="font-Poppins absolute right-5 top-16 bg-white shadow-lg border border-gray-200 rounded-xl w-80 p-4 z-50">
            <h3 className="font-semibold text-lg mb-2">Notifications</h3>

            {notifications.length === 0 && (
              <p className="text-gray-500 text-sm">
                No notifications yet
              </p>
            )}

            <div className="max-h-64 overflow-y-auto">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className="border-b py-2 px-1 hover:bg-gray-100 rounded cursor-pointer"
                >
                  <p className="font-semibold">{n.title}</p>
                  <p className="text-sm text-gray-600">
                    {n.message}
                  </p>
                  <p className="text-xs text-gray-400">
                    {n.time}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* MOBILE SEARCH OVERLAY */}
      {showMobileSearch && (
        <div className="md:hidden fixed inset-0 z-50 bg-white px-4 py-3 flex items-center gap-3">
          {/* CLOSE */}
          <button
            onClick={() => setShowMobileSearch(false)}
            className="text-xl font-semibold"
          >
            ✕
          </button>

          {/* SEARCH INPUT */}
          <div
            className="
              flex items-center gap-2
              flex-1
              bg-[#F9FAFB]
              border border-gray-200
              rounded-xl
              px-4 py-2
            "
          >
            <IoSearchOutline className="text-gray-400 text-lg" />
            <input
              type="text"
              autoFocus
              placeholder="Search..."
              className="
                flex-1
                outline-none
                bg-transparent
                text-sm
                placeholder:text-gray-400
                font-Poppins
              "
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
