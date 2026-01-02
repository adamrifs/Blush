import { createContext, useContext, useRef, useState } from "react";

const LoaderContext = createContext();

export const LoaderProvider = ({ children }) => {
    const [loading, setLoadingState] = useState(false);
    const [text, setText] = useState("Loading");

    const timeoutRef = useRef(null);
    const startTimeRef = useRef(0);

    const MIN_TIME = 400; 
    const MAX_TIME = 8000; 

    const setLoading = (state, customText = "Loading") => {
        clearTimeout(timeoutRef.current);

        if (state) {
            startTimeRef.current = Date.now();
            setText(customText);
            setLoadingState(true);

            // 🛡 safety timeout
            timeoutRef.current = setTimeout(() => {
                setLoadingState(false);
            }, MAX_TIME);
        } else {
            const elapsed = Date.now() - startTimeRef.current;
            const remaining = MIN_TIME - elapsed;

            if (remaining > 0) {
                timeoutRef.current = setTimeout(() => {
                    setLoadingState(false);
                }, remaining);
            } else {
                setLoadingState(false);
            }
        }
    };

    return (
        <LoaderContext.Provider value={{ loading, setLoading, text }}>
            {children}
        </LoaderContext.Provider>
    );
};

export const useLoader = () => useContext(LoaderContext);
