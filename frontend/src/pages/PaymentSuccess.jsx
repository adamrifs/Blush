import { useEffect, useState, useRef, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import floral from "../assets/floral.png";
import api from "../utils/axiosInstance";
import { ProductContext } from "../context/ProductContext";
import Navbar from "../components/Navbar";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const stripeSessionId = params.get("session_id");

  const { setCart, sessionId: cartSessionId, fetchCartCount } =
    useContext(ProductContext);

  const attemptsRef = useRef(0); //  IMPORTANT
  const [loadingText, setLoadingText] = useState(
    "Finalizing your order…"
  );

  const MAX_ATTEMPTS = 25; // ~75 seconds
  const INTERVAL = 3000;

  useEffect(() => {
    if (!stripeSessionId) {
      toast.error("Invalid payment session");
      navigate("/");
      return;
    }

    toast.success("Payment successful");

    const fetchOrder = async () => {
      try {
        const res = await api.get(
          `/orders/by-session/${stripeSessionId}`
        );

        const order = res.data.order;

        await api.delete("/cart/clearCart", {
          data: { sessionId: cartSessionId },
          withCredentials: true,
        }).catch(() => { });

        setCart([]);
        fetchCartCount();

        navigate("/order-success", {
          state: { order },
          replace: true,
        });

      } catch (err) {
        if (
          err.response?.status === 404 &&
          attemptsRef.current < MAX_ATTEMPTS
        ) {
          attemptsRef.current += 1;

          console.log(
            `⏳ Waiting for order... attempt ${attemptsRef.current}`
          );

          setLoadingText(
            `Finalizing your order… (${attemptsRef.current}/${MAX_ATTEMPTS})`
          );

          setTimeout(fetchOrder, INTERVAL);
        } else {
          console.warn("Order still processing");

          navigate("/order-success", {
            state: { pending: true },
            replace: true,
          });
        }
      }
    };

    // 🔥 IMPORTANT: delay FIRST fetch
    setTimeout(fetchOrder, 4000);
  }, [stripeSessionId]);


  return (
    <div>
      <Navbar />

      <div className="min-h-screen w-full font-Poppins relative bg-white overflow-hidden flex items-center justify-center">

        {/* Floral Background */}
        <div className="absolute top-0 left-0 w-full opacity-[0.07] pointer-events-none">
          <img src={floral} className="w-full object-cover" alt="bg" />
        </div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 bg-white/70 backdrop-blur-xl
            px-10 py-12 rounded-3xl
            shadow-[0_8px_30px_rgba(0,0,0,0.08)]
            border border-gray-100
            text-center max-w-md w-[90%]"
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 1.8 }}
            className="flex justify-center mb-6"
          >
            <div className="w-16 h-16 rounded-full
              bg-gradient-to-r from-[#b89bff] to-[#d6b8ff]
              flex items-center justify-center shadow-lg"
            >
              <CheckCircle size={34} className="text-white" />
            </div>
          </motion.div>

          <h1 className="text-2xl font-semibold text-gray-800">
            Payment Successful
          </h1>

          <p className="text-gray-500 mt-3 text-sm leading-relaxed">
            Thank you for your order 💐
            <br />
            We’re preparing everything with care.
          </p>

          <div className="mt-8 h-px bg-gradient-to-r from-transparent via-[#d6b8ff] to-transparent" />

          <p className="mt-6 text-sm text-[#b89bff] font-medium">
            {loadingText}
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
