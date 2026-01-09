import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import floral from "../assets/floral.png";

const PaymentSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    toast.success("Payment successful");

    const timer = setTimeout(() => {
      navigate("/order-success"); // or track-order route if needed
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen w-full font-Poppins relative bg-white overflow-hidden flex items-center justify-center">

      {/* Floral Background */}
      <div className="absolute top-0 left-0 w-full opacity-[0.07] pointer-events-none">
        <img src={floral} className="w-full object-cover" alt="floral-bg" />
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
          initial={{ scale: 0.8 }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 1.8 }}
          className="flex justify-center mb-6"
        >
          <div className="w-16 h-16 rounded-full
                          bg-gradient-to-r from-[#b89bff] to-[#d6b8ff]
                          flex items-center justify-center
                          shadow-lg"
          >
            <CheckCircle size={34} className="text-white" />
          </div>
        </motion.div>

        {/* Title */}
        <h1 className="text-2xl font-semibold text-gray-800">
          Payment Successful
        </h1>

        {/* Subtitle */}
        <p className="text-gray-500 mt-3 text-sm leading-relaxed">
          Thank you for your order 💐  
          <br />
          We’re preparing everything with care.
        </p>

        {/* Divider */}
        <div className="mt-8 h-px bg-gradient-to-r from-transparent via-[#d6b8ff] to-transparent" />

        {/* Processing Text */}
        <p className="mt-6 text-sm text-[#b89bff] font-medium">
          Redirecting to your order details…
        </p>
      </motion.div>
    </div>
  );
};

export default PaymentSuccess;
