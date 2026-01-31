import React, { useEffect, useState } from "react";

const Toast = ({ message, type = "info", onClose }) => {
    const [closing, setClosing] = useState(false);

    useEffect(() => {
        // Start exit animation 300ms before actual removal
        const timer1 = setTimeout(() => setClosing(true), 2700);

        // Actually remove toast after animation ends
        const timer2 = setTimeout(onClose, 3000);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
        };
    }, [onClose]);

    const theme = {
        success: "from-green-400 to-green-500",
        error: "from-red-400 to-red-500",
        warning: "from-yellow-400 to-orange-500",
        info: "from-blue-400 to-blue-500",
    };

    return (
        <div className="fixed top-6 left-1/2  flex justify-center pointer-events-none">
            <div
                className={`
                    bg-gradient-to-r ${theme[type]}
                    text-white font-poppins text-sm sm:text-base
                    max-w-[90%] sm:max-w-[360px]
                    px-4 sm:px-6 py-3 rounded-xl shadow-lg
                    animate-slideDownFade break-words text-center
                    pointer-events-auto transition-all duration-300
                    ${closing ? "opacity-0 -translate-y-3" : "opacity-100 translate-y-0"}
                `}
            >
                {message}
            </div>
        </div>
    );
};

export default Toast;
