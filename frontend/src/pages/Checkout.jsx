import React, { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import AnnouncementBar from '../components/AnnouncementBar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer'
import DetailsStep from "../components/checkout/DetailsStep";
import ShippingStep from "../components/checkout/ShippingStep";
import PaymentStep from "../components/checkout/PaymentStep";
import floral from '../assets/floral.png'

const Checkout = () => {
    const { state } = useLocation();
    const { cart, subTotal, deliveryCharges, total } = state ?? {};
    const vat = total * 0.05;
    // console.log("Received checkout data:", cart, total);

    // ---------------- existing states ----------------
    const [currentStep, setCurrentStep] = useState("details");
    // Delivery selections (from ShippingStep)
    const [deliverySlot, setDeliverySlot] = useState(null);
    const [deliveryDate, setDeliveryDate] = useState(null);
    const [deliveryEmirate, setDeliveryEmirate] = useState("");


    // ---------------- user details ----------------
    const [name, setName] = useState(localStorage.getItem("name") || "");
    const [email, setEmail] = useState(localStorage.getItem("email") || "");
    const [phoneNumber, setPhoneNumber] = useState(localStorage.getItem("phoneNumber") || "");
    const [cardMessageData, setCardMessageData] = useState(null);

    useEffect(() => {
        localStorage.setItem("name", name);
    }, [name]);

    useEffect(() => {
        localStorage.setItem("email", email);
    }, [email]);

    useEffect(() => {
        localStorage.setItem("phoneNumber", phoneNumber);
    }, [phoneNumber]);


    // ---------------- shipping receiver details ----------------
    const [receiverName, setReceiverName] = useState(localStorage.getItem("receiverName") || "");
    const [receiverPhone, setReceiverPhone] = useState(localStorage.getItem("receiverPhone") || "");
    const [iAmReceiver, setIAmReceiver] = useState(
        localStorage.getItem("iAmReceiver") === "true"
    );

    const [area, setArea] = useState(localStorage.getItem("area") || "");
    const [street, setStreet] = useState(localStorage.getItem("street") || "");
    const [building, setBuilding] = useState(localStorage.getItem("building") || "");
    const [flat, setFlat] = useState(localStorage.getItem("flat") || "");

    const [date, setDate] = useState(localStorage.getItem("date") ? new Date(localStorage.getItem("date")) : null);
    const [selectedSlot, setSelectedSlot] = useState(
        localStorage.getItem("selectedSlot")
            ? JSON.parse(localStorage.getItem("selectedSlot"))
            : null
    );


    useEffect(() => {
        localStorage.setItem("receiverName", receiverName);
    }, [receiverName]);

    useEffect(() => {
        localStorage.setItem("receiverPhone", receiverPhone);
    }, [receiverPhone]);

    useEffect(() => {
        localStorage.setItem("iAmReceiver", iAmReceiver);
    }, [iAmReceiver]);

    useEffect(() => {
        localStorage.setItem("area", area);
    }, [area]);

    useEffect(() => {
        localStorage.setItem("street", street);
    }, [street]);

    useEffect(() => {
        localStorage.setItem("building", building);
    }, [building]);

    useEffect(() => {
        localStorage.setItem("flat", flat);
    }, [flat]);

    useEffect(() => {
        if (date) localStorage.setItem("date", date.toString());
    }, [date]);

    useEffect(() => {
        if (selectedSlot)
            localStorage.setItem("selectedSlot", JSON.stringify(selectedSlot));
    }, [selectedSlot]);



    // ---------------- errors ----------------
    const [errors, setErrors] = useState({
        name: "",
        email: "",
        phone: "",
    });

    // ---------------- phone validation ----------------
    const handlePhoneChange = (e) => {
        const value = e.target.value.replace(/\D/g, '');
        if (value.length <= 9) setPhoneNumber(value);
    };

    const validateDetails = () => {
        let newErrors = { name: "", email: "", phone: "" };
        let valid = true;

        if (!name.trim()) {
            newErrors.name = "This Field Must Be Filled";
            valid = false;
        }
        if (!email.trim()) {
            newErrors.email = "This Field Must Be Filled";
            valid = false;
        } else if (!email.includes("@")) {
            newErrors.email = "Enter a valid email";
            valid = false;
        }
        if (phoneNumber.length !== 9) {
            newErrors.phone = "Enter a valid 9-digit phone number";
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    // ---------------- COUNTRY CODE DROPDOWN ----------------
    const countryCodes = [
        { code: '+971', name: 'United Arab Emirates', flag: 'https://flagcdn.com/w20/ae.png' },
        { code: '+91', name: 'India', flag: 'https://flagcdn.com/w20/in.png' },
        { code: '+1', name: 'United States', flag: 'https://flagcdn.com/w20/us.png' },
    ];

    const [selectedCountry, setSelectedCountry] = useState("United Arab Emirates");
    const [selectedEmirate, setSelectedEmirate] = useState(
        localStorage.getItem("selectedEmirate") || ""
    );
    const [selectedCode, setSelectedCode] = useState("+971");
    const [selectedFlag, setSelectedFlag] = useState("https://flagcdn.com/w20/ae.png");
    const [showDropdown, setShowDropdown] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const savedEmirate = localStorage.getItem("selectedEmirate");
        if (savedEmirate) {
            setSelectedEmirate(savedEmirate);
            setDeliveryEmirate(savedEmirate);
        }
    }, []);

    useEffect(() => {
        const handleEmirateChange = (e) => {
            setSelectedEmirate(e.detail);
            setDeliveryEmirate(e.detail);
        };

        window.addEventListener("emirateChanged", handleEmirateChange);

        return () => window.removeEventListener("emirateChanged", handleEmirateChange);
    }, []);


    const dropdownRef = useRef(null);

    const filteredCountries = countryCodes.filter(
        (c) =>
            c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.code.includes(searchTerm)
    );

    // ---------------- click outside to close dropdown ----------------
    useEffect(() => {
        const close = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", close);
        return () => document.removeEventListener("mousedown", close);
    }, []);
    // ---------------- filtered countries for dropdown remain same ----------------
    const getProgressWidth = () => {
        if (currentStep === "details") return "33%";
        if (currentStep === "shipping") return "66%";
        if (currentStep === "payment") return "100%";
        return "0%";
    };

    // ----- Card Message States -----
    const [cardOption, setCardOption] = useState("");
    const editorRef = useRef(null);
    const [showEmoji, setShowEmoji] = useState(false);

    const MAX_CHAR = 250;
    const [charCount, setCharCount] = useState(0);
    const [previewHTML, setPreviewHTML] = useState("");

    const [cardTemplate, setCardTemplate] = useState("icedSilver");

    const templateClasses = {
        icedSilver: {
            background: "linear-gradient(to bottom, #F5F5F7 0%, #E7E7EB 100%)",
            border: "1px solid #d1d1d1",
        },
        floral: {
            backgroundImage: `url(${floral})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            padding: "60px",
            backgroundColor: "#fffefc"
        },
        gold: {
            border: "3px solid #d4af37",
            boxShadow: "0 0 12px rgba(212, 175, 55, 0.25)",
            background: "#fffdf7",
        },
        pastel: {
            background: "linear-gradient(135deg, #ffeaea, #fff7f2, #fff)",
            border: "1px solid #ffd5d5",
        },
        luxury: {
            border: "2px solid #c3a6ff",
            background: "#faf7ff",
            position: "relative",
        },
    };

    // Update character & preview
    const updateCount = () => {
        if (!editorRef.current) return;
        const textHTML = editorRef.current.innerHTML;
        const text = editorRef.current.innerText || "";
        setPreviewHTML(textHTML);
        setCharCount(text.length);
    };

    // Clear when switching to empty/no card
    const clearCardData = () => {
        if (editorRef.current) editorRef.current.innerHTML = "";
        setPreviewHTML("");
        setCharCount(0);
    };


    const validateShipping = () => {
        if (!receiverName.trim()) return false;
        if (!receiverPhone.trim()) return false;
        if (!selectedEmirate) return false;
        if (!area.trim()) return false;
        if (!street.trim()) return false;
        if (!building.trim()) return false;
        if (!flat.trim()) return false;
        if (!date) return false;
        if (!selectedSlot) return false;

        return true;
    };

    return (
        <div className='bg- min-h-screen w-full overflow-x-hidden'>
            <AnnouncementBar />
            <Navbar />
            <div className='maincontainer w-[94%] mx-auto lg:mx-auto min-h-[85vh] mb-10 relative flex flex-col items-center justify-start px-4 sm:px-6 '> {/* Adjusted w-[94%] and added responsive padding/margin */}

                <h1 className='font-Poppins text-2xl md:text-4xl font-medium text-center w-full mt-10 '>Checkout</h1>
                <div className='subcontainer flex flex-col items-start gap-5 mt-10 sm:mt-16 w-full lg:w-[45%] xl:w-     [45%]'> {/* Made subcontainer width responsive */}

                    {/* Checkout Steps Navigation (More space needed on small screens) */}
                    <div className="headingNavigation flex items-center justify-between w-full font-Poppins pb-2">
                        <p
                            className={`text-sm md:text-xl cursor-pointer 
                            ${currentStep === "details" ? "text-black font-semibold" : "text-gray-400"}`}
                            onClick={() => setCurrentStep("details")}
                        >
                            Your Details
                        </p>

                        <p
                            className={`text-sm md:text-xl cursor-pointer 
                             ${currentStep === "shipping" ? "text-black font-semibold" : "text-gray-400"}`}
                            onClick={() => {
                                if (validateDetails()) {
                                    setCurrentStep("shipping");
                                }
                            }}

                        >
                            Shipping
                        </p>

                        <p
                            className={`text-sm md:text-xl cursor-pointer 
    ${currentStep === "payment" ? "text-black font-semibold" : "text-gray-400"}`}
                            onClick={() => {
                                if (validateDetails() && validateShipping()) {
                                    setCurrentStep("payment");
                                }
                            }}
                        >
                            Payment
                        </p>

                    </div>

                    <div className="progressbar w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-[#b89bff] to-[#d6b8ff] transition-all duration-500 ease-in-out"
                            style={{
                                width: getProgressWidth(),
                            }}
                        ></div>
                    </div>

                    {/* ___________________________ components____________________ */}
                    <div className="Components w-full">
                        {currentStep === "details" && (
                            <DetailsStep
                                name={name} setName={setName}
                                email={email} setEmail={setEmail}
                                phoneNumber={phoneNumber}
                                handlePhoneChange={handlePhoneChange}
                                errors={errors} setErrors={setErrors}

                                selectedCode={selectedCode}
                                selectedFlag={selectedFlag}
                                showDropdown={showDropdown}
                                setShowDropdown={setShowDropdown}
                                dropdownRef={dropdownRef}
                                filteredCountries={filteredCountries}
                                searchTerm={searchTerm}
                                setSearchTerm={setSearchTerm}

                                /* CARD MESSAGE PROPS */
                                cardOption={cardOption}
                                setCardOption={setCardOption}
                                editorRef={editorRef}
                                updateCount={updateCount}
                                showEmoji={showEmoji}
                                setShowEmoji={setShowEmoji}
                                charCount={charCount}
                                MAX_CHAR={MAX_CHAR}
                                templateClasses={templateClasses}
                                cardTemplate={cardTemplate}
                                setCardTemplate={setCardTemplate}
                                previewHTML={previewHTML}
                                setPreviewHTML={setPreviewHTML}
                                clearCardData={clearCardData}

                                validateDetails={validateDetails}
                                setCurrentStep={setCurrentStep}
                                setCardMessageData={setCardMessageData}
                            />

                        )}

                        {currentStep === "shipping" && (
                            <ShippingStep
                                receiverName={receiverName}
                                setReceiverName={setReceiverName}
                                receiverPhone={receiverPhone}
                                setReceiverPhone={setReceiverPhone}
                                name={name}
                                phoneNumber={phoneNumber}
                                iAmReceiver={iAmReceiver}
                                setIAmReceiver={setIAmReceiver}

                                selectedCountry={selectedCountry}
                                setSelectedCountry={setSelectedCountry}
                                selectedEmirate={selectedEmirate}
                                setSelectedEmirate={(emirate) => {
                                    setSelectedEmirate(emirate);
                                    setDeliveryEmirate(emirate);   // 🔥 store for payment step
                                }}

                                selectedCode={selectedCode}
                                selectedFlag={selectedFlag}
                                showDropdown={showDropdown}
                                setShowDropdown={setShowDropdown}
                                dropdownRef={dropdownRef}
                                filteredCountries={filteredCountries}
                                searchTerm={searchTerm}
                                setSearchTerm={setSearchTerm}

                                deliverySlot={deliverySlot}
                                setDeliverySlot={setDeliverySlot}
                                deliveryDate={deliveryDate}
                                setDeliveryDate={setDeliveryDate}

                                deliveryEmirate={deliveryEmirate}
                                setDeliveryEmirate={setDeliveryEmirate}   // 🔥 FIX

                                area={area}
                                setArea={setArea}
                                street={street}
                                setStreet={setStreet}
                                building={building}
                                setBuilding={setBuilding}
                                flat={flat}
                                setFlat={setFlat}

                                setCurrentStep={setCurrentStep}
                            />

                        )}

                        {currentStep === "payment" &&
                            <PaymentStep
                                senderName={name}
                                senderPhone={phoneNumber}

                                deliverySlot={deliverySlot}
                                deliveryDate={deliveryDate}
                                deliveryEmirate={deliveryEmirate}

                                receiverName={receiverName}
                                receiverPhone={receiverPhone}
                                area={area}
                                street={street}
                                building={building}
                                flat={flat}
                                cardMessageData={cardMessageData}
                            />}

                    </div>

                </div>
            </div>
            <Footer />
        </div >
    );
};

export default Checkout;
