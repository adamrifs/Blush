import React, { useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import axios from 'axios'
import { serverUrl } from '../../../url'
import api from '../../utils/axiosInstance'
import userProfile from '../../assets/user.png'

const PersonalDetails = () => {

    const [user, setUser] = useState(null)
    useEffect(() => {
        const storedUser = localStorage.getItem("user");

        if (storedUser) {
            setUser(JSON.parse(storedUser)); // ✅ show instantly if logged in with Google
        } else {
            const fetchUserData = async () => {
                const token = Cookies.get("authToken");
                if (!token) return;

                try {
                    const response = await api.get(`${serverUrl}/user/getUser`, {
                        withCredentials: true,
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setUser(response.data.user);
                } catch (error) {
                    console.error("Error fetching user:", error);
                }
            };
            fetchUserData();
        }
    }, []);
    // console.log('user>>', user)

    return (
        <div className="mainContainer p-6 md:p-8 flex flex-col gap-10 w-full font-Poppins">

            {/* Profile Header */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 border-b border-gray-200 pb-8">

                {/* Profile Image */}
                {user && user.profileImage && (
                    <div className='p-[3px] rounded-full bg-gradient-to-r from-[#b89bff] to-[#d6b8ff]'>
                        <img
                            src={user.profileImage}
                            alt={`${user.firstname} ${user.lastname}`}
                            className="
      w-28 h-28 md:w-32 md:h-32
      rounded-full
      object-cover
      border-4 border-white
      shadow-lg
    "
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                                e.currentTarget.src =
                                    `https://ui-avatars.com/api/?name=${user.firstname}+${user.lastname}&background=b89bff&color=fff`;
                            }}
                        />
                    </div>

                )}



                {/* Name & Email */}
                <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-2">
                    <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
                        {user?.firstname} {user?.lastname}
                    </h2>

                    <p className="text-sm md:text-base text-gray-500">
                        {user?.email}
                    </p>

                    {/* Provider badge */}
                    {user?.googleId && (
                        <span className="mt-2 inline-block text-xs px-3 py-1 rounded-full
            bg-[#f3f0ff] text-[#7b61ff] font-medium">
                            Signed in with Google
                        </span>
                    )}
                </div>
            </div>

            {/* Personal Details */}
            <div className="flex flex-col gap-6">

                <div className="list w-full border-b border-gray-200 pb-4">
                    <h5 className="text-sm text-gray-500">Full Name</h5>
                    <p className="font-medium mt-1 text-base md:text-lg">
                        {user?.firstname} {user?.lastname}
                    </p>
                </div>

                <div className="list w-full border-b border-gray-200 pb-4">
                    <h5 className="text-sm text-gray-500">Email Address</h5>
                    <p className="font-medium mt-1 text-base md:text-lg">
                        {user?.email}
                    </p>
                </div>

                <div className="list w-full border-b border-gray-200 pb-4">
                    <h5 className="text-sm text-gray-500">Joined At</h5>
                    <p className="font-medium mt-1 text-base md:text-lg">
                        {user?.createdAt
                            ? new Date(user.createdAt).toLocaleDateString("en-GB")
                            : "—"}
                    </p>
                </div>

            </div>
        </div>
    )
}

export default PersonalDetails