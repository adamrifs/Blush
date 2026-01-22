import React, { useContext, useEffect, useState } from "react";
import { serverUrl } from "../../urls";
import { registerAdminPush } from "../utils/pushNotification";
import { toast } from "react-toastify";
import axios from "axios";
import { productContext } from "../context/ProductContext";
import { useNavigate } from "react-router-dom";

const VAPID_PUBLIC_KEY =
  "BDVbPLDxPADdK1vV_ZXJ8zNapfA1EubsCNVsz_FZo-w4XFgcAD1nHtcT360vNJ4_SuEW0bnaQTpusIjOrTr4zGw";

const Settings = ({ setIsAuth }) => {

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const [settings, setSettings] = useState({
    pushEnabled: false,
    emailEnabled: false,
    email: "",
  });

  const nav = useNavigate()
  // ---------------------------------------------------------
  // FETCH SETTINGS
  // ---------------------------------------------------------
  useEffect(() => {
    fetchSettings();
  }, []);

  const handlePushToggle = async () => {
    const newVal = !settings.pushEnabled;

    setSettings(prev => ({
      ...prev,
      pushEnabled: newVal
    }));

    try {
      if (newVal) {
        // 🔥 This already saves pushEnabled + token
        await registerAdminPush();
      } else {
        // Only disable
        await saveSettings({ pushEnabled: false });
      }

      toast.success(
        newVal
          ? "Push notifications enabled"
          : "Push notifications disabled"
      );
    } catch (err) {
      setSettings(prev => ({
        ...prev,
        pushEnabled: !newVal
      }));
      toast.error("Failed to update push settings");
    }
  };


  const fetchSettings = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${serverUrl}/settings`, {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();

      if (data?.settings) {
        setSettings({
          pushEnabled: data.settings.pushEnabled,
          emailEnabled: data.settings.emailEnabled,
          email: data.settings.email,
        });
      }

      //   toast.success("Settings loaded");
    } catch (err) {
      toast.error("Failed to load settings");
      console.error("Fetch settings failed", err);
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------
  // SAVE SETTINGS
  // ---------------------------------------------------------
  const saveSettings = async (updatedValues) => {
    try {
      setSaving(true);

      const res = await fetch(`${serverUrl}/settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ...settings,
          ...updatedValues,
        }),
      });

      const data = await res.json();

      if (data?.settings) {
        setSettings(data.settings);
        toast.success("Settings saved");
      }
    } catch (err) {
      toast.error("Failed to save settings");
      console.error("Save settings error", err);
    } finally {
      setSaving(false);
    }
  };



  // ---------------------------------------------------------
  // EMAIL TOGGLE
  // ---------------------------------------------------------
  const handleEmailToggle = async () => {
    const newVal = !settings.emailEnabled;
    await saveSettings({ emailEnabled: newVal });

    toast.success(
      newVal ? "Email alerts enabled" : "Email alerts disabled"
    );
  };

  // ---------------------------------------------------------
  // EMAIL INPUT
  // ---------------------------------------------------------
  const handleEmailChange = (e) => {
    setSettings({ ...settings, email: e.target.value });
  };

  const saveEmail = async () => {
    if (!settings.email) {
      toast.warn("Please enter an email");
      return;
    }
    await saveSettings({ email: settings.email });
    toast.success("Email updated");
  };


  // logout 
  const handleLogout = async () => {
    try {
      setLoggingOut(true);

      await axios.post(
        `${serverUrl}/admin/adminLogout`,
        {},
        { withCredentials: true }
      );
      setIsAuth(false);
      toast.success("Logged out successfully");

      nav('/register')
    } catch (err) {
      toast.error("Logout error");
      console.error("Logout error:", err);
      setLoggingOut(false);
    }
  };



  return (
    <div className="p-10">
      <h2 className="text-3xl font-semibold mb-8 font-Poppins">Settings</h2>

      {/* Push Notifications */}
      <div className="bg-white shadow-sm border border-gray-200 rounded-2xl p-6 max-w-xl mb-6">
        <h3 className="text-xl font-semibold mb-2 font-Poppins">Push Notifications</h3>
        <p className="text-gray-600 text-sm mb-6 font-Poppins">
          Enable push notifications to stay updated with new orders and activity.
        </p>

        {/* Toggle */}
        <label className="flex items-center cursor-pointer mb-6">
          <div className="relative">
            <input
              type="checkbox"
              checked={settings.pushEnabled}
              onChange={handlePushToggle}
              className="sr-only"
            />
            <div
              className={`w-14 h-7 rounded-full transition ${settings.pushEnabled ? "bg-[#6f52ff]" : "bg-gray-300"
                }`}
            ></div>
            <div
              className={`absolute top-1 w-5 h-5 bg-white rounded-full transition ${settings.pushEnabled ? "translate-x-7" : "translate-x-1"
                }`}
            ></div>
          </div>
          <span className="ml-3 text-sm font-Poppins">
            {settings.pushEnabled ? "Notifications Enabled" : "Enable Notifications"}
          </span>
        </label>

        <button
          onClick={handlePushToggle}
          className="px-6 py-2.5 bg-[#2F3746] text-white cursor-pointer rounded-lg shadow hover:bg-[#5b6983] transition-all font-Poppins"
        >
          {settings.pushEnabled ? "Disable Notifications" : "Enable Notifications"}
        </button>
      </div>

      {/* EMAIL SETTINGS */}
      <div className="bg-white shadow-sm border border-gray-200 rounded-2xl p-6 max-w-xl">
        <h3 className="text-xl font-semibold mb-2 font-Poppins">Email Alerts</h3>
        <p className="text-gray-600 text-sm mb-6 font-Poppins">
          Receive important updates in your email inbox.
        </p>

        {/* Toggle */}
        <label className="flex items-center cursor-pointer mb-4">
          <div className="relative">
            <input
              type="checkbox"
              checked={settings.emailEnabled}
              onChange={handleEmailToggle}
              className="sr-only"
            />
            <div
              className={`w-14 h-7 rounded-full transition ${settings.emailEnabled ? "bg-[#6f52ff]" : "bg-gray-300"
                }`}
            ></div>
            <div
              className={`absolute top-1 w-5 h-5 bg-white rounded-full transition ${settings.emailEnabled ? "translate-x-7" : "translate-x-1"
                }`}
            ></div>
          </div>

          <span className="ml-3 text-sm font-Poppins">
            {settings.emailEnabled ? "Email Alerts Enabled" : "Enable Email Alerts"}
          </span>
        </label>

        {/* Email input */}
        <div className="mt-3">
          <label className="block text-sm mb-1 font-Poppins">Alert Email</label>
          <input
            type="email"
            value={settings.email}
            onChange={handleEmailChange}
            placeholder="admin@example.com"
            className="border px-3 py-2 rounded-lg w-full font-Poppins"
          />
        </div>

        <button
          onClick={saveEmail}
          className="mt-4 px-6 py-2.5 bg-[#2F3746] cursor-pointer text-white rounded-lg shadow hover:bg-[#5b6983] transition-all font-Poppins"
        >
          Save Email
        </button>
      </div>
      {/* LOGOUT SECTION */}
      <div className="bg-white shadow-sm border border-red-200 rounded-2xl p-6 max-w-xl mt-10">
        <h3 className="text-xl font-semibold mb-2 font-Poppins text-red-600">
          Logout
        </h3>

        <p className="text-gray-600 text-sm mb-6 font-Poppins">
          You will be logged out from the admin dashboard.
        </p>

        <button
          onClick={() => setShowLogoutModal(true)}
          className="px-6 py-2.5 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition-all font-Poppins"
        >
          Logout
        </button>

      </div>

      {/* CONFIRM LOGOUT MODAL */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[9999] bg-black/40 flex items-center justify-center">
          <div className="bg-white w-[90%] max-w-md rounded-2xl p-6 shadow-xl animate-fadeIn">

            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Confirm Logout
            </h2>

            <p className="text-gray-600 text-sm mb-6">
              Are you sure you want to log out of the admin dashboard?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                disabled={loggingOut}
                className={`px-5 py-2 rounded-lg transition
    ${loggingOut
                    ? "bg-gray-200 cursor-not-allowed"
                    : "bg-gray-200 hover:bg-gray-300"
                  }`}
              >
                Cancel
              </button>


              {loggingOut ? (
                <div className="flex items-center justify-center py-20 w-full">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-gray-700" />
                </div>
              ) : (
                <button
                  onClick={handleLogout}
                  className="px-5 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
                >
                  Logout
                </button>
              )}


            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Settings;