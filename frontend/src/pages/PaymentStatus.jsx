import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../utils/axiosInstance";

const PaymentStatus = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const orderId = params.get("order");

  useEffect(() => {
    if (!orderId) {
      navigate("/payment-failed");
      return;
    }

    const checkPayment = async () => {
      try {
        const res = await api.get(`/orders/${orderId}`);
        const order = res.data.order;

        setTimeout(() => {
          if (order?.payment?.status === "paid") {
            navigate("/order-success", { state: { order } });
          } else {
            navigate("/payment-failed");
          }
        }, 1500); // smooth UX delay
      } catch (error) {
        console.error(error);
        navigate("/payment-failed");
      }
    };

    checkPayment();
  }, [orderId, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50">
      <div className="bg-white/70 backdrop-blur-xl border border-pink-100 rounded-3xl shadow-xl px-10 py-12 max-w-md w-full text-center">
        
        {/* Loader */}
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Verifying Your Payment
        </h2>

        {/* Subtitle */}
        <p className="text-gray-500 text-sm leading-relaxed">
          Please wait while we securely confirm your transaction.
          <br />
          This will only take a moment 💗
        </p>

        {/* Divider */}
        <div className="mt-8 h-px bg-gradient-to-r from-transparent via-pink-200 to-transparent" />

        {/* Footer Note */}
        <p className="mt-6 text-xs text-gray-400">
          Do not refresh or close this page
        </p>
      </div>
    </div>
  );
};

export default PaymentStatus;
