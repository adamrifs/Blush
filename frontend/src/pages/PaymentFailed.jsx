import { useNavigate } from "react-router-dom";
import { XCircle } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import floral from "../assets/floral.png";

const PaymentFailed = () => {
  const navigate = useNavigate();

  return (
    <div>
      <Navbar />

      <div className="min-h-screen w-full font-Poppins relative bg-white overflow-hidden">

        {/* Floral Background */}
        <div className="absolute top-0 left-0 w-full opacity-[0.07] pointer-events-none">
          <img src={floral} className="w-full object-cover" alt="floral-bg" />
        </div>

        {/* Center Card */}
        <div className="relative z-10 flex items-center justify-center min-h-[70vh]">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white/70 backdrop-blur-xl p-10 rounded-3xl
                       shadow-[0_8px_30px_rgba(0,0,0,0.08)]
                       border border-gray-100
                       text-center max-w-md w-[90%]"
          >
            {/* Icon */}
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
              className="flex justify-center mb-6"
            >
              <div className="w-16 h-16 rounded-full
                              bg-gradient-to-r from-[#b89bff] to-[#d6b8ff]
                              flex items-center justify-center
                              shadow-lg"
              >
                <XCircle size={34} className="text-white" />
              </div>
            </motion.div>

            {/* Title */}
            <h1 className="text-2xl font-semibold text-gray-800">
              Payment Failed
            </h1>

            {/* Message */}
            <p className="text-gray-500 mt-3 text-sm leading-relaxed">
              We couldn’t complete your payment at this moment.
              <br />
              Please try again — your order is safe 💐
            </p>

            {/* Divider */}
            <div className="mt-8 h-px bg-gradient-to-r from-transparent via-[#d6b8ff] to-transparent" />

            {/* Actions */}
            <div className="mt-8 flex flex-col gap-4">
              <button
                onClick={() => navigate("/checkout")}
                className="px-8 py-3 rounded-full
                           bg-gradient-to-r from-[#b89bff] to-[#d6b8ff]
                           text-white font-medium
                           shadow-md hover:shadow-lg
                           hover:scale-[1.02]
                           transition"
              >
                Try Payment Again
              </button>

              <button
                onClick={() => navigate("/")}
                className="text-sm text-gray-500 hover:text-gray-700 transition"
              >
                Back to Home
              </button>
            </div>

            {/* Footer Note */}
            <p className="mt-6 text-xs text-gray-400">
              Need help? Our support team is always here 💗
            </p>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PaymentFailed;
