import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const RouteLoader = () => {
    const location = useLocation();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);

        const t = setTimeout(() => {
            setLoading(false);
        }, 200); // fast, no animation

        return () => clearTimeout(t);
    }, [location.pathname]);

    if (!loading) return null;

    return (
        <div className="fixed inset-0 z-[9998] bg-white flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-gray-600" />
        </div>
    );
};

export default RouteLoader;
