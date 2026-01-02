import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const PaymentSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    toast.success("Payment successful");
    setTimeout(() => {
      navigate("/order-success");
    }, 1500);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center font-Poppins">
      <h1 className="text-2xl font-semibold">Processing your order…</h1>
    </div>
  );
};

export default PaymentSuccess;
