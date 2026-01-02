import { useNavigate } from "react-router-dom";

const PaymentFailed = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center font-Poppins">
      <h1 className="text-2xl font-semibold text-red-500">
        Payment failed 
      </h1>
      <button
        onClick={() => navigate("/checkout")}
        className="mt-5 px-6 py-2 rounded-full bg-black text-white"
      >
        Try Again
      </button>
    </div>
  );
};

export default PaymentFailed;
