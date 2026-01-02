import { useState, useRef, useEffect } from "react";
import { FiChevronDown, FiCheck } from "react-icons/fi";

const CustomDropdown = ({ value, onChange, options, placeholder }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedOption = options.find(o => o.value === value);

    return (
        <div ref={ref} className="relative min-w-[170px] font-Poppins ">
            {/* Trigger */}
            <div
                onClick={() => setOpen(!open)}
                className="
                    flex items-center justify-between
                    text-sm text-[#344054]
                    cursor-pointer
                    hover:bg-[#F9FAFB]
                    w-full py-3 px-4 rounded-full border border-gray-300 bg-white/70 backdrop-blur
                "
            >
                <span>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <FiChevronDown className="text-gray-400 text-sm" />
            </div>

            {/* Options */}
            {open && (
                <div
                    className="
                        absolute z-50 mt-2 w-full
                        bg-white
                        border border-[#EAECF0]
                        rounded-xl
                        shadow-lg
                        overflow-hidden
                    "
                >
                    {options.map((opt) => (
                        <div
                            key={opt.value}
                            onClick={() => {
                                onChange(opt.value);
                                setOpen(false);
                            }}
                            className="
                                flex items-center justify-between
                                px-4 py-2 text-sm
                                cursor-pointer
                                hover:bg-[#F9FAFB]
                                text-[#344054]
                            "
                        >
                            <span>{opt.label}</span>
                            {value === opt.value && (
                                <FiCheck className="text-[#7F56D9] text-sm" />
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CustomDropdown;
