import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { serverUrl } from "../../url.js";
import Cookies from "js-cookie";
import api from "../utils/axiosInstance.js";

export const ProductContext = createContext();

const ProductContextProvider = (props) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(localStorage.getItem("sessionId") || "");
  const [cartCount, setCartCount] = useState(0);
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState([]);
  const [token, setToken] = useState(Cookies.get("authToken") || null);
  const [globalClearModal, setGlobalClearModal] = useState(false);
  const [pendingEmirate, setPendingEmirate] = useState(null);
  const [restrictedItems, setRestrictedItems] = useState([]);

  // ⭐ NEW: selected emirate (global)
  const [selectedEmirate, setSelectedEmirate] = useState(
    localStorage.getItem("selectedEmirate") || ""
  );

  useEffect(() => {
    const handler = (e) => {
      const newEmirate = e.detail;

      // detect restricted items
      const notDeliverable = cart.filter((item) => {
        const available = item.productId?.availableIn || [];
        return !available.includes(newEmirate);
      });

      setPendingEmirate(newEmirate);
      setRestrictedItems(notDeliverable);
      setGlobalClearModal(true);

    };

    window.addEventListener("announcementEmirateChange", handler);
    return () => window.removeEventListener("announcementEmirateChange", handler);
  }, []);

  const finalizeGlobalEmirateChange = (emirate) => {
    setSelectedEmirate(emirate);
    localStorage.setItem("selectedEmirate", emirate);
    window.dispatchEvent(new CustomEvent("emirateChanged", { detail: emirate }));
  };

  const confirmGlobalChange = async () => {
    try {
      // REMOVE ALL ITEMS IN CART
      for (let item of cart) {
        await api.delete(`${serverUrl}/cart/removeCart`, {
          data: { productId: item.productId._id, sessionId },
          withCredentials: true,
        });
      }

      setCart([]);        // empty frontend
      setCartCount(0);    // reset count

      finalizeGlobalEmirateChange(pendingEmirate);

    } catch (err) {
      console.error("Failed to clear cart:", err);
    }

    setGlobalClearModal(false);
  };



  // ------------------ NEW FUNCTION ------------------
  const fetchProductsByEmirate = async (emirate) => {
    try {
      setLoading(true);
      const response = await api.get(
        `${serverUrl}/product/filter`,
        { params: { emirate }, showLoader: true, }
      );
      setProducts(response.data.products);
    } catch (error) {
      toast.error("Failed to load products for selected emirate");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // ------------------ INIT SESSION ------------------
  useEffect(() => {
    if (!sessionId) {
      const newSessionId = "guest_" + Math.random().toString(36).substring(2, 10) + Date.now();
      localStorage.setItem("sessionId", newSessionId);
      setSessionId(newSessionId);
    }
  }, []);

  // ⭐ LISTEN TO EMIRATE CHANGE EVENT FROM AnnouncementBar
  useEffect(() => {
    const handleEmirateChange = (event) => {
      const emirate = event.detail;
      setSelectedEmirate(emirate);
      localStorage.setItem("selectedEmirate", emirate);
      fetchProductsByEmirate(emirate);
    };

    window.addEventListener("emirateChanged", handleEmirateChange);

    return () => {
      window.removeEventListener("emirateChanged", handleEmirateChange);
    };
  }, []);

  // ⭐ On first load → fetch products for selected emirate
  useEffect(() => {
    if (selectedEmirate) {
      fetchProductsByEmirate(selectedEmirate);
    } else {
      // If not selected, default Abu Dhabi
      fetchProductsByEmirate("Abu Dhabi");
      setSelectedEmirate("Abu Dhabi");
      localStorage.setItem("selectedEmirate", "Abu Dhabi");
    }
    // console.log('car>>', cart)
  }, []);

  // Fetch user when logged in
  useEffect(() => {
    if (token) fetchUserData();
  }, [token]);

  useEffect(() => {
    if (sessionId) {
      fetchCartCount();
      fetchCart();
    }
  }, [sessionId, token]);

  // Existing functions (same as before)
  const fetchCartCount = async () => {
    try {
      const response = await api.get(`${serverUrl}/cart/getCart`, {
        params: { sessionId },
        withCredentials: true,
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
        showLoader: false,
      });
      setCartCount(response.data?.items?.length || 0);
      setCart(response.data.items || []);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCart = async () => {
    try {
      const response = await api.get(`${serverUrl}/cart/getCart`, {
        params: { sessionId },
        withCredentials: true,
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
        showLoader: false,
      });
      setCart(response.data?.items || []);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await api.get(serverUrl + `/user/getUser`, {
        withCredentials: true,
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
        showLoader: true,
      });
      setUser(response.data.user);
    } catch (error) {
      console.error(error);
    }
  };

  // useEffect(() => {
  //   console.log("user>>", user)
  // }, [])
  // console.log("products>>", products)

  // address

  const fetchAddresss = async () => {
    try {
      const response = await api.get(serverUrl + `address/getAddress/${userId}`)

    } catch (error) {
      console.log(error)
    }
  }

  // ------------------ CONTEXT VALUE ------------------
  const value = {
    products,
    loading,
    selectedEmirate,
    setSelectedEmirate,
    fetchProductsByEmirate,
    cart,
    cartCount,
    setCartCount,
    fetchCartCount,
    setCart,
    token,
    setToken,
    user,
    setUser,
    fetchUserData,
    sessionId,
  };

  return (
    <ProductContext.Provider value={value}>
      {props.children}

      {/* 🔥 GLOBAL MODAL SHOULD BE HERE */}
      {globalClearModal && (
        <div className="fixed inset-0 bg-black/40 z-[9999] flex items-center justify-center">
          <div className="bg-white p-6 rounded-2xl w-[90%] max-w-[600px]">
            <h2 className="text-2xl font-semibold text-[#b89bff] mb-4">Clear Bag?</h2>

            <p className="text-gray-700 mb-3">
              Your bag contains items not deliverable to {pendingEmirate}.
            </p>

            <div className="flex gap-4 justify-end">
              <button
                onClick={() => setGlobalClearModal(false)}
                className="px-6 py-3 bg-gray-200 rounded-full"
              >
                Cancel
              </button>

              <button
                onClick={confirmGlobalChange}
                className="px-6 py-3 bg-gradient-to-r from-[#b89bff] to-[#d6b8ff] text-white rounded-full"
              >
                Change The City
              </button>
            </div>
          </div>
        </div>
      )}

    </ProductContext.Provider>
  );
};

export default ProductContextProvider;
