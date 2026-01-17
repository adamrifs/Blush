import React, { useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMail, FiLock, FiUser } from "react-icons/fi";
import abstract from '../assets/abstract.png';
import axios from "axios";
import { serverUrl } from "../../url";
import Cookies from 'js-cookie'
import { useLocation, useNavigate } from "react-router-dom";
import { ProductContext } from "../context/ProductContext";
import { toast } from "react-toastify";
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { useToast } from "../context/ToastContext";
import { registerPush } from "../utils/pushNotification";
import api from "../utils/axiosInstance";


const Login = () => {
    const { token, setToken, sessionId, fetchCartCount, setUser } = useContext(ProductContext)
    const { showToast } = useToast()

    const location = useLocation()
    const navigate = useNavigate()

    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);

    // login details
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    // signup details
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [signupEmail, setSignupEmail] = useState("");
    const [signupPassword, setSignupPassword] = useState("");
    const [firstNameError, setFirstNameError] = useState("");
    const [lastNameError, setLastNameError] = useState("");
    const [signupEmailError, setSignupEmailError] = useState("");
    const [signupPasswordError, setSignupPasswordError] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");

    // handle real-time validation for login fields
    const handleEmailChange = (e) => {
        const val = e.target.value;
        setEmail(val);
        if (!val) setEmailError("Email is required.");
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val))
            setEmailError("Invalid email format.");
        else setEmailError("");
    };

    const handlePasswordChange = (e) => {
        const val = e.target.value;
        setPassword(val);
        if (!val) setPasswordError("Password is required.");
        else if (val.length < 6)
            setPasswordError("Password must be at least 6 characters.");
        else setPasswordError("");
    };

    // handle real-time validation for signup fields
    const handleFirstNameChange = (e) => {
        const val = e.target.value;
        setFirstName(val);
        if (!val) setFirstNameError("First name is required.");
        else if (val.length < 2)
            setFirstNameError("First name must be at least 2 characters.");
        else setFirstNameError("");
    };

    const handleLastNameChange = (e) => {
        const val = e.target.value;
        setLastName(val);
        if (!val) setLastNameError("Last name is required.");
        else if (val.length < 2)
            setLastNameError("Last name must be at least 2 characters.");
        else setLastNameError("");
    };

    const handleSignupEmailChange = (e) => {
        const val = e.target.value;
        setSignupEmail(val);
        if (!val) setSignupEmailError("Email is required.");
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val))
            setSignupEmailError("Invalid email format.");
        else setSignupEmailError("");
    };

    const handleSignupPasswordChange = (e) => {
        const val = e.target.value;
        setSignupPassword(val);
        if (!val) setSignupPasswordError("Password is required.");
        else if (val.length < 6)
            setSignupPasswordError("Password must be at least 6 characters.");
        else setSignupPasswordError("");
    };

    // handle login submit
    const handleLogin = async (e) => {
        e.preventDefault();
        if (emailError || passwordError) return;

        if (!email || !password) {
            if (!email) setEmailError("Email is required.");
            if (!password) setPasswordError("Password is required.");
            return;
        }
        try {
            setLoading(true);
            const response = await api.post(
                serverUrl + "/user/login",
                { email, password },
                { withCredentials: true }
            );
            // console.log(response.data);

            Cookies.set('authToken', response.data.token, { expires: 7, secure: true, sameSite: 'strict' });
            const userToken = response.data.token
            setToken(userToken)

            localStorage.setItem("user", JSON.stringify(response.data.user));
            setUser(response.data.user);

            showToast("Welcome back! Login successful");

            // 🔔 Register Push Notifications (right after setting user)
            registerPush(
                response.data.user._id,
                "BDVbPLDxPADdK1vV_ZXJ8zNapfA1EubsCNVsz_FZo-w4XFgcAD1nHtcT360vNJ4_SuEW0bnaQTpusIjOrTr4zGw"
            );

            // __________________________ cart merging ___________________________ 
            let activeSessionId = sessionId || localStorage.getItem("sessionId");
            console.log("Merging cart with sessionId:", activeSessionId);

            await api.post(serverUrl + `/cart/mergeCart`, { sessionId: activeSessionId }, {
                withCredentials: true,
                headers: { Authorization: `Bearer ${userToken}` },
                showLoader: true,
            })
            fetchCartCount();

            const redirectPath = location.state?.from || '/'
            const checkoutData = location.state ? {
                cart: location.state.cart,
                subTotal: location.state.subTotal,
                deliveryCharges: location.state.deliveryCharges,
                total: location.state.total
            } : {};
            navigate(redirectPath, { state: checkoutData })

            setEmail("");
            setPassword("");

        } catch (error) {
            console.log(error);
            showToast(
                error?.response?.data?.message || "Login failed. Please try again.",
                "error"
            );
        } finally {
            setLoading(false);
        }
    };

    // handle signup submit
    const handleSignup = async (e) => {
        e.preventDefault();
        if (
            firstNameError ||
            lastNameError ||
            signupEmailError ||
            signupPasswordError
        )
            return;

        if (!firstName || !lastName || !signupEmail || !signupPassword) {
            if (!firstName) setFirstNameError("First name is required.");
            if (!lastName) setLastNameError("Last name is required.");
            if (!signupEmail) setSignupEmailError("Email is required.");
            if (!signupPassword) setSignupPasswordError("Password is required.");
            return;
        }
        if (confirmPassword !== signupPassword) {
            setConfirmPasswordError("Passwords do not match.");
            return;
        }
        try {
            setLoading(true);
            const response = await api.post(
                serverUrl + "/user/register",
                {
                    firstname: firstName,
                    lastname: lastName,
                    email: signupEmail,
                    password: signupPassword,
                },
                {
                    withCredentials: true,
                    showLoader: true,
                }
            );
            showToast("Account created successfully! Please sign in");
            // console.log("Signup success:", response.data);
            setIsLogin(true);
            setFirstName("");
            setLastName("");
            setSignupEmail("");
            setSignupPassword("");
        } catch (error) {
            console.log(error);
            showToast(
                error?.response?.data?.message || "Signup failed. Please try again.",
                "error"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen flex flex-col md:flex-row text-gray-800 font-Poppins overflow-hidden">
            {/* Mobile background fade */}
            <motion.div
                className="absolute inset-0 bg-cover bg-center md:hidden"
                style={{
                    backgroundImage: `linear-gradient(rgba(255,255,255,0.75), rgba(255,255,255,0.75)), url(${abstract})`,
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
            ></motion.div>

            {/* Left section */}
            <div className="hidden md:flex w-1/2 items-center justify-center relative">
                <img
                    src={abstract}
                    alt="floral"
                    className="w-full h-full object-cover rounded-r-[40px]"
                />
                <div className="absolute top-10 left-10">
                    <h1 className="font-chopard text-5xl text-[#0f708a]">Blush</h1>
                    <p className="text-[#7aa2a9] text-lg mt-2 font-light">
                        Fresh blooms, elegant fragrance.
                    </p>
                </div>
            </div>

            {/* Right section */}
            <div className="flex-1 flex items-center justify-center px-6 py-10 md:px-16 relative">
                <div className="max-w-md w-full space-y-8">
                    <AnimatePresence mode="wait">
                        {isLogin ? (
                            <motion.div
                                key="login"
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                transition={{ duration: 0.5, ease: "easeInOut" }}
                            >
                                <h2 className="text-3xl font-semibold text-center text-[#0f708a] mb-4">
                                    Welcome Back
                                </h2>
                                <p className="text-center text-gray-500 mb-8">
                                    Sign in to continue shopping for your favorite blooms
                                </p>

                                <form className="space-y-5" onSubmit={handleLogin}>
                                    <div>
                                        <label className="block text-sm font-medium mb-1 text-[#0f708a]">
                                            Email
                                        </label>
                                        <div className="flex items-center bg-[#f7f5f3] rounded-full border border-[#b7dbe3] px-4 py-3">
                                            <FiMail className="text-[#0f708a] mr-2" />
                                            <input
                                                type="email"
                                                onChange={handleEmailChange}
                                                value={email}
                                                placeholder="Enter your email"
                                                className="w-full bg-transparent focus:outline-none"
                                            />
                                        </div>
                                        {emailError && (
                                            <p className="text-red-500 text-sm mt-1">{emailError}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1 text-[#0f708a]">
                                            Password
                                        </label>
                                        <div className="flex items-center bg-[#f7f5f3] rounded-full border border-[#b7dbe3] px-4 py-3">
                                            <FiLock className="text-[#0f708a] mr-2" />
                                            <input
                                                type="password"
                                                onChange={handlePasswordChange}
                                                value={password}
                                                placeholder="Enter your password"
                                                className="w-full bg-transparent focus:outline-none"
                                            />
                                        </div>
                                        {passwordError && (
                                            <p className="text-red-500 text-sm mt-1">{passwordError}</p>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-3 rounded-full bg-gradient-to-r from-[#b89bff] to-[#d6b8ff] border border-[#bca8ff] shadow-[0_2px_8px_rgba(0,0,0,0.1)] hover:from-[#a27aff] hover:to-[#cda5ff] hover:shadow-[0_4px_14px_rgba(107,70,193,0.3)] text-white font-medium transition-all duration-300 ease-in-out cursor-pointer"
                                    >
                                        {loading ? "Signing In..." : "Sign In"}
                                    </button>

                                    {/* OR divider */}
                                    <div className="flex items-center my-4">
                                        <hr className="flex-grow border-gray-300" />
                                        <span className="px-3 text-gray-400 text-sm">or</span>
                                        <hr className="flex-grow border-gray-300" />
                                    </div>

                                    {/* Google Sign-In button */}
                                    <div className="flex justify-center">
                                        <GoogleLogin
                                            onSuccess={async (credentialResponse) => {
                                                try {
                                                    // ✅ Use jwtDecode instead of jwt_decode
                                                    const decoded = jwtDecode(credentialResponse.credential);
                                                    // console.log("Google user decoded:", decoded);

                                                    const res = await api.post(`${serverUrl}/user/google-login`, {
                                                        token: credentialResponse.credential,
                                                    }, { withCredentials: true, showLoader: true, });

                                                    Cookies.set("authToken", res.data.token, {
                                                        expires: 7,
                                                        secure: true,
                                                        sameSite: "strict",
                                                    });
                                                    localStorage.setItem('user', JSON.stringify(res.data.user));
                                                    setToken(res.data.token);
                                                    setUser(res.data.user);
                                                    showToast("Logged in with Google!")
                                                    navigate("/");
                                                } catch (err) {
                                                    showToast("Google Sign-In failed. Please try again.");
                                                    console.error(err);
                                                }
                                            }}
                                            onError={() => {
                                                showToast("Google Sign-In failed. Please try again.");
                                            }}
                                        />
                                    </div>



                                    <p className="text-center text-gray-500 text-sm mt-8">
                                        Don’t have an account?{" "}
                                        <button
                                            type="button"
                                            onClick={() => setIsLogin(false)}
                                            className="text-[#0f708a] hover:text-[#084e61] font-medium cursor-pointer"
                                        >
                                            Create an account
                                        </button>
                                    </p>
                                </form>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="signup"
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 50 }}
                                transition={{ duration: 0.5, ease: "easeInOut" }}
                            >
                                <h2 className="text-3xl font-semibold text-center text-[#0f708a] mb-4">
                                    Create Your Account
                                </h2>
                                <p className="text-center text-gray-500 mb-8">
                                    Join the Blush family and enjoy exclusive floral collections
                                </p>

                                <form className="space-y-5" onSubmit={handleSignup}>
                                    <div className="flex gap-3">
                                        <div className="w-1/2">
                                            <label className="block text-sm font-medium mb-1 text-[#0f708a]">
                                                First Name
                                            </label>
                                            <div className="flex items-center bg-[#f7f5f3] rounded-full border border-[#b7dbe3] px-4 py-3">
                                                <FiUser className="text-[#0f708a] mr-2" />
                                                <input
                                                    type="text"
                                                    onChange={handleFirstNameChange}
                                                    value={firstName}
                                                    placeholder="First name"
                                                    className="w-full bg-transparent focus:outline-none"
                                                />
                                            </div>
                                            {firstNameError && (
                                                <p className="text-red-500 text-sm mt-1">{firstNameError}</p>
                                            )}
                                        </div>

                                        <div className="w-1/2">
                                            <label className="block text-sm font-medium mb-1 text-[#0f708a]">
                                                Last Name
                                            </label>
                                            <div className="flex items-center bg-[#f7f5f3] rounded-full border border-[#b7dbe3] px-4 py-3">
                                                <FiUser className="text-[#0f708a] mr-2" />
                                                <input
                                                    type="text"
                                                    onChange={handleLastNameChange}
                                                    value={lastName}
                                                    placeholder="Last name"
                                                    className="w-full bg-transparent focus:outline-none"
                                                />
                                            </div>
                                            {lastNameError && (
                                                <p className="text-red-500 text-sm mt-1">{lastNameError}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className="block text-sm font-medium mb-1 text-[#0f708a]">
                                            Email
                                        </label>
                                        <div className="flex items-center bg-[#f7f5f3] rounded-full border border-[#b7dbe3] px-4 py-3">
                                            <FiMail className="text-[#0f708a] mr-2" />
                                            <input
                                                type="email"
                                                onChange={handleSignupEmailChange}
                                                value={signupEmail}
                                                placeholder="Enter your email"
                                                className="w-full bg-transparent focus:outline-none"
                                            />
                                        </div>
                                        {signupEmailError && (
                                            <p className="text-red-500 text-sm mt-1">{signupEmailError}</p>
                                        )}
                                    </div>

                                    {/* Password */}
                                    <div>
                                        <label className="block text-sm font-medium mb-1 text-[#0f708a]">
                                            Password
                                        </label>
                                        <div className="flex items-center bg-[#f7f5f3] rounded-full border border-[#b7dbe3] px-4 py-3">
                                            <FiLock className="text-[#0f708a] mr-2" />
                                            <input
                                                type="password"
                                                onChange={handleSignupPasswordChange}
                                                value={signupPassword}
                                                placeholder="Create a password"
                                                className="w-full bg-transparent focus:outline-none"
                                            />
                                        </div>
                                        {signupPasswordError && (
                                            <p className="text-red-500 text-sm mt-1">{signupPasswordError}</p>
                                        )}
                                    </div>

                                    {/* Confirm Password */}
                                    <div>
                                        <label className="block text-sm font-medium mb-1 text-[#0f708a]">
                                            Confirm Password
                                        </label>
                                        <div className="flex items-center bg-[#f7f5f3] rounded-full border border-[#b7dbe3] px-4 py-3">
                                            <FiLock className="text-[#0f708a] mr-2" />
                                            <input
                                                type="password"
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    setConfirmPassword(val);
                                                    if (!val) setConfirmPasswordError("Please confirm your password.");
                                                    else if (val !== signupPassword)
                                                        setConfirmPasswordError("Passwords do not match.");
                                                    else setConfirmPasswordError("");
                                                }}
                                                value={confirmPassword}
                                                placeholder="Confirm your password"
                                                className="w-full bg-transparent focus:outline-none"
                                            />
                                        </div>
                                        {confirmPasswordError && (
                                            <p className="text-red-500 text-sm mt-1">{confirmPasswordError}</p>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-3 rounded-full bg-gradient-to-r from-[#b89bff] to-[#d6b8ff] border border-[#bca8ff] shadow-[0_2px_8px_rgba(0,0,0,0.1)] hover:from-[#a27aff] hover:to-[#cda5ff] hover:shadow-[0_4px_14px_rgba(107,70,193,0.3)] text-white font-medium transition-all duration-300 ease-in-out"
                                    >
                                        {loading ? "Creating..." : "Sign Up"}
                                    </button>

                                    {/* _______________________________ google authentication __________________ */}
                                    <div className="flex items-center my-4 ">
                                        <hr className="flex-grow border-gray-300 " />
                                        <span className="px-3 text-gray-400 text-sm">or</span>
                                        <hr className="flex-grow border-gray-300" />
                                    </div>

                                    {/* Google Sign-Up button */}
                                    <div className="flex justify-center ">
                                        <GoogleLogin
                                            onSuccess={async (credentialResponse) => {
                                                try {
                                                    // ✅ Use jwtDecode (capital D)
                                                    const decoded = jwtDecode(credentialResponse.credential);
                                                    console.log("Google signup decoded:", decoded);

                                                    const res = await api.post(`${serverUrl}/user/google-login`, {
                                                        token: credentialResponse.credential,
                                                    }, { withCredentials: true ,showLoader: true, });

                                                    Cookies.set("authToken", res.data.token, {
                                                        expires: 7,
                                                        secure: true,
                                                        sameSite: "strict",
                                                    });
                                                    localStorage.setItem('user', JSON.stringify(res.data.user));
                                                    setToken(res.data.token);
                                                    setUser(res.data.user);
                                                    showToast("Account created with Google");
                                                    navigate("/");
                                                } catch (err) {
                                                    showToast("Google Sign-Up failed")
                                                    console.error(err);
                                                }
                                            }}
                                            onError={() => {
                                                showToast("Google Sign-Up failed", "error")
                                            }}
                                        />
                                    </div>


                                    <p className="text-center text-gray-500 text-sm mt-8">
                                        Already have an account?{" "}
                                        <button
                                            type="button"
                                            onClick={() => setIsLogin(true)}
                                            className="text-[#0f708a] hover:text-[#084e61] font-medium cursor-pointer"
                                        >
                                            Sign in
                                        </button>
                                    </p>
                                </form>
                            </motion.div>

                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default Login;
