import React, { useState } from "react";
import { FiMail } from "react-icons/fi";
import { motion } from "framer-motion";
import { useToast } from "../context/ToastContext";
import api from "../utils/axiosInstance";
import { serverUrl } from "../../url";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");

  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    const val = e.target.value;
    setEmail(val);

    if (!val) setEmailError("Email is required");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val))
      setEmailError("Invalid email format");
    else setEmailError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (emailError || !email) return;

    try {
      setLoading(true);
      await api.post(`${serverUrl}/user/forgot-password`, { email });

      // ✅ same message for security
      showToast(
        "If this email exists, a password reset link has been sent."
      );

      setEmail("");
    } catch (error) {
      showToast(
        error?.response?.data?.message ||
          "Unable to send reset link. Please try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#f7f5f3] font-Poppins">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8"
      >
        <h2 className="text-2xl font-semibold text-center text-[#0f708a] mb-2">
          Forgot Password
        </h2>

        <p className="text-center text-gray-500 text-sm mb-6">
          Enter your email and we’ll send you a reset link
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-[#0f708a] mb-1">
              Email
            </label>
            <div className="flex items-center bg-[#f7f5f3] rounded-full border border-[#b7dbe3] px-4 py-3">
              <FiMail className="text-[#0f708a] mr-2" />
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="Enter your email"
                className="w-full bg-transparent focus:outline-none"
              />
            </div>
            {emailError && (
              <p className="text-red-500 text-sm mt-1">{emailError}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full bg-gradient-to-r from-[#b89bff] to-[#d6b8ff] text-white font-medium hover:opacity-90 transition"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Remember your password?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-[#0f708a] font-medium hover:underline"
          >
            Sign in
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
