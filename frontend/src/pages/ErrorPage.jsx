import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const ErrorPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9F8F6] px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center max-w-lg"
      >
        {/* 404 */}
        <motion.h1
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="text-[90px] md:text-[110px] font-montserrat font-semibold text-[#b89bff]"
        >
          404
        </motion.h1>

        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-montserrat font-medium mt-2">
          Page not found
        </h2>

        {/* Description */}
        <p className="text-gray-600 mt-3 leading-relaxed">
          The page you’re looking for doesn’t exist or may have been moved.
        </p>

        {/* Button */}
        <motion.div
          whileHover={{ scale: 0.95 }}
          whileTap={{ scale: 0.9 }}
          className="mt-8"
        >
          <Link
            to="/"
            className="inline-block bg-gradient-to-r from-[#b89bff] to-[#d6b8ff]
                       border border-[#bca8ff] text-white px-8 py-3 rounded-full
                       font-montserrat shadow-md cursor-pointer"
          >
            Back to Home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ErrorPage;
