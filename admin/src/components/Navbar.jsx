import React, { useEffect, useState, useRef } from "react";
import {
  IoSearchOutline,
  IoNotificationsOutline,
} from "react-icons/io5";
import { RiMenu2Line } from "react-icons/ri";
import { io } from "socket.io-client";
import { serverUrl } from "../../urls";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const testSocket = io(import.meta.env.VITE_SERVER_URL, {
  withCredentials: true,
});

testSocket.on("connect", () => {
  console.log("🧪 TEST SOCKET CONNECTED:", testSocket.id);
});

const Navbar = ({ setIsSideBarOpen }) => {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [adminData, setAdminData] = useState(null);

  const fetchNotifications = async () => {
    try {
      const res = await fetch(
        `${serverUrl}/notifications`,
        { credentials: "include" }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch notifications");
      }

      const data = await res.json();
      setNotifications(data);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // ✅ UNREAD COUNT (NEW)
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const socketRef = useRef(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_SERVER_URL}/admin/me`, {
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => {
        if (data?.admin?._id) {
          setAdminData(data.admin);
          console.log("✅ Admin loaded:", data.admin._id);
        }
      })
      .catch(err => console.error(err));
  }, []);

  // 2️⃣ Connect socket AFTER admin exists
  useEffect(() => {
    if (!adminData?._id) return;

    socketRef.current = io(import.meta.env.VITE_SERVER_URL, {
      withCredentials: true,
      auth: {
        adminId: adminData._id,
      },
    });

    socketRef.current.on("connect", () => {
      console.log("🔌 Socket connected:", socketRef.current.id);
    });

    socketRef.current.on("notification", (payload) => {
      console.log("🔔 Notification received:", payload);
      setNotifications(prev => [payload, ...prev]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [adminData?._id]);


  const timeAgo = (date) => {
    const seconds = Math.floor((Date.now() - new Date(date)) / 1000);

    const intervals = [
      { label: "year", seconds: 31536000 },
      { label: "month", seconds: 2592000 },
      { label: "day", seconds: 86400 },
      { label: "hour", seconds: 3600 },
      { label: "min", seconds: 60 },
    ];

    for (const interval of intervals) {
      const count = Math.floor(seconds / interval.seconds);
      if (count >= 1) {
        return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
      }
    }

    return "just now";
  };

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
            onClick={async () => {
              setShowDropdown(!showDropdown);

              await fetch(`${serverUrl}/notifications/read-all`, {
                method: "PATCH",
                credentials: "include"
              });

              setNotifications(prev =>
                prev.map(n => ({ ...n, isRead: true }))
              );
            }}
          >
            <IoNotificationsOutline />

            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white w-5 h-5 text-xs flex items-center justify-center rounded-full">
                {unreadCount}
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
                  key={n._id}
                  className="border-b py-2 px-1 hover:bg-gray-100 rounded cursor-pointer"
                >
                  <p className="font-semibold">{n.title}</p>
                  <p className="text-sm text-gray-600">
                    {n.message}
                  </p>
                  <p className="text-xs text-blue-400">
                    {timeAgo(n.createdAt)}
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
          <button
            onClick={() => setShowMobileSearch(false)}
            className="text-xl font-semibold"
          >
            ✕
          </button>

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
