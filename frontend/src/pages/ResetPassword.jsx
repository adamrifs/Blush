import React, { useState } from "react";
import { FiLock } from "react-icons/fi";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import api from "../utils/axiosInstance";
import { serverUrl } from "../../url";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      return setError("Password must be at least 6 characters");
    }
    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      setLoading(true);
      await api.post(`${serverUrl}/user/reset-password/${token}`, {
        password,
      });

      showToast("Password reset successful. Please login.");
      navigate("/login");
    } catch (err) {
      showToast(
        err?.response?.data?.message || "Reset link expired or invalid",
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
          Reset Password
        </h2>

        <p className="text-center text-gray-500 text-sm mb-6">
          Enter your new password below
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-[#0f708a] mb-1">
              New Password
            </label>
            <div className="flex items-center bg-[#f7f5f3] rounded-full border border-[#b7dbe3] px-4 py-3">
              <FiLock className="text-[#0f708a] mr-2" />
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                placeholder="Enter new password"
                className="w-full bg-transparent focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#0f708a] mb-1">
              Confirm Password
            </label>
            <div className="flex items-center bg-[#f7f5f3] rounded-full border border-[#b7dbe3] px-4 py-3">
              <FiLock className="text-[#0f708a] mr-2" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setError("");
                }}
                placeholder="Confirm password"
                className="w-full bg-transparent focus:outline-none"
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full bg-gradient-to-r from-[#b89bff] to-[#d6b8ff] text-white font-medium"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
