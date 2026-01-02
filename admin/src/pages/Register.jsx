import React, { useState } from 'react'
import { User, Lock } from "lucide-react";
import vector from '../assets/Vector.png'
import elipse from '../assets/Ellipse.png'
import { toast } from 'react-toastify';
import axios from 'axios';
import { serverUrl } from '../../urls';
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom';

const Register = ({ setIsAuth }) => {
    const nav = useNavigate()

    const [isSignup, setIsSignup] = useState(false)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const handleSigin = async (e) => {
        e.preventDefault();

        if (confirmPassword !== password) {
            toast.error("Passwords do not match");
            return;
        }

        const toastId = toast.loading("Creating account...");

        try {
            const response = await axios.post(
                `${serverUrl}/admin/adminRegister`,
                { name, email, password },
                { withCredentials: true }
            );

            toast.update(toastId, {
                render: "Signup successful 🎉",
                type: "success",
                isLoading: false,
                autoClose: 2000,
            });

            setName("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");
            setIsSignup(false); // go to login

        } catch (error) {
            toast.update(toastId, {
                render:
                    error.response?.data?.message ||
                    error.response?.data ||
                    "Signup failed",
                type: "error",
                isLoading: false,
                autoClose: 3000,
            });
        }
    };


    // _______________________ login 
    const handleLogin = async (e) => {
        e.preventDefault();

        const toastId = toast.loading("Signing you in...");

        try {
            const response = await axios.post(
                `${serverUrl}/admin/adminLogin`,
                { email, password },
                { withCredentials: true }
            );

            setIsAuth(true);

            toast.update(toastId, {
                render: "Login successful ✅",
                type: "success",
                isLoading: false,
                autoClose: 1500,
            });

            setEmail("");
            setPassword("");

            setTimeout(() => {
                nav("/");
            }, 1500);

        } catch (error) {
            toast.update(toastId, {
                render:
                    error.response?.data?.message ||
                    error.response?.data ||
                    "Invalid email or password",
                type: "error",
                isLoading: false,
                autoClose: 3000,
            });
        }
    };


    return (
        <div className="flex items-center justify-center h-screen bg-[#1e40af] relative overflow-hidden">
            {/* Background waves */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#1e3a8a] via-[#1d4ed8] to-[#1e40af]"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#1e3a8a] opacity-30 rounded-full blur-3xl"></div>
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#1e3a8a] opacity-40 rounded-full blur-3xl"></div>
            <div>
                <img src={vector} className='absolute right-0 top-0' />
                <img src={elipse} className='absolute left-0 bottom-0' />
            </div>
            {/* _________________________________ sign up__________________________________ */}
            {
                isSignup ? (
                    <div className="relative z-10 w-[340px] bg-transparent flex flex-col items-center text-white">
                        {/* Cart Icon */}
                        <div className="mb-10">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-16 h-16 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m10-9v9m4-9l-2 9m-8 0h8"
                                />
                            </svg>
                        </div>

                        {/* Form */}
                        <form className="flex flex-col w-full space-y-4">
                            <div className="relative">
                                <User className="absolute left-3 top-3 text-gray-300 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="NAME"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 bg-transparent rounded-md text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-blue-300"
                                />
                            </div>
                            <div className="relative">
                                <User className="absolute left-3 top-3 text-gray-300 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="EMAIL"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 bg-transparent rounded-md text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-blue-300"
                                />
                            </div>

                            <div className="relative">
                                <Lock className="absolute left-3 top-3 text-gray-300 w-5 h-5" />
                                <input
                                    type="password"
                                    placeholder="PASSWORD"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 bg-transparent rounded-md text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-blue-300"
                                />
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 text-gray-300 w-5 h-5" />
                                <input
                                    type="password"
                                    placeholder="CONFIRM PASSWORD"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 bg-transparent rounded-md text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-blue-300"
                                />
                            </div>

                            <button
                                type="submit"
                                onClick={handleSigin}
                                className="w-full mt-2 bg-white text-blue-700 py-2 rounded-md font-semibold tracking-wider hover:bg-gray-200 transition duration-200"
                            >
                                SIGN IN
                            </button>

                            <p className="text-center text-sm text-gray-200 mt-3 cursor-pointer hover:underline">
                                Forgot password?
                            </p>
                            <p className="text-center text-sm text-gray-200 mt-3 cursor-pointer hover:underline" onClick={() => setIsSignup(!isSignup)}>
                                Login
                            </p>
                        </form>
                    </div>
                ) : (

                    <div className="relative z-10 w-[340px] bg-transparent flex flex-col items-center text-white">
                        {/* _________________________Login box ________________________________*/}
                        <div className="mb-10">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-16 h-16 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m10-9v9m4-9l-2 9m-8 0h8"
                                />
                            </svg>
                        </div>

                        {/* Form */}
                        <form className="flex flex-col w-full space-y-4">
                            <div className="relative">
                                <User className="absolute left-3 top-3 text-gray-300 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="EMAIL"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 bg-transparent rounded-md text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-blue-300"
                                />
                            </div>

                            <div className="relative">
                                <Lock className="absolute left-3 top-3 text-gray-300 w-5 h-5" />
                                <input
                                    type="password"
                                    placeholder="PASSWORD"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 bg-transparent rounded-md text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-blue-300"
                                />
                            </div>

                            <button
                                type="submit"
                                onClick={handleLogin}
                                className="w-full mt-2 bg-white text-blue-700 py-2 rounded-md font-semibold tracking-wider hover:bg-gray-200 transition duration-200"
                            >
                                LOGIN
                            </button>

                            <p className="text-center text-sm text-gray-200 mt-3 cursor-pointer hover:underline">
                                Forgot password?
                            </p>
                            <p className="text-center text-sm text-gray-200 mt-3 cursor-pointer hover:underline" onClick={() => setIsSignup(!isSignup)}>
                                Sign up
                            </p>
                        </form>
                    </div>
                )
            }

        </div>
    )
}

export default Register