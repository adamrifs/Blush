import React, { useState, useEffect, useContext } from "react";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import "../../styles/datepicker.css";
import { ChevronDown, ChevronRight } from "lucide-react";
import axios from "axios";
import { serverUrl } from "../../../url";
import { ProductContext } from "../../context/ProductContext";
import { useToast } from "../../context/ToastContext";
import api from "../../utils/axiosInstance";

const ShippingStep = ({
    receiverName,
    setReceiverName,
    receiverPhone,
    setReceiverPhone,
    name,
    phoneNumber,
    iAmReceiver,
    setIAmReceiver,

    selectedCountry,
    setSelectedCountry,
    selectedEmirate,
    setSelectedEmirate,

    selectedCode,
    selectedFlag,
    showDropdown,
    setShowDropdown,
    dropdownRef,
    filteredCountries,
    searchTerm,
    setSearchTerm,
    setCurrentStep,

    deliverySlot,
    setDeliverySlot,
    deliveryDate,
    setDeliveryDate,
    deliveryEmirate,
    setDeliveryEmirate,

    area,
    setArea,
    street,
    setStreet,
    building,
    setBuilding,
    flat,
    setFlat,
}) => {

    const { cart = [], sessionId, fetchCartCount, setSelectedEmirate: ctxSetSelectedEmirate } =
        useContext(ProductContext);

    const { showToast } = useToast();

    const emirates = ["Abu Dhabi", "Ajman", "Al Ain", "Dubai", "Sharjah"];

    const [showEmirateDropdown, setShowEmirateDropdown] = useState(false);

    const date = deliveryDate;
    const setDate = setDeliveryDate;

    const selectedSlot = deliverySlot;
    const setSelectedSlot = setDeliverySlot;
    const [deliveryCharges, setDeliveryCharges] = useState([]);

    useEffect(() => {
        api.get(`${serverUrl}/settings`).then(res => {
            setDeliveryCharges(res.data.settings.deliveryCharges || []);
        });
    }, []);

    // console.log("delivery charges",deliveryCharges)
    // ------------------ SLOT LOGIC (UNCHANGED UI) ------------------

    const parseTimeToDate = (timeStr) => {
        const [time, modifier] = timeStr.split(" ");
        let [hours, minutes] = time.split(":");

        if (modifier === "PM" && hours !== "12") hours = String(Number(hours) + 12);
        if (modifier === "AM" && hours === "12") hours = "00";

        const now = new Date();
        return new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            Number(hours),
            Number(minutes),
            0
        );
    };

    const isToday = (selectedDate) => {
        if (!selectedDate) return false;
        const today = new Date();
        return (
            selectedDate.getDate() === today.getDate() &&
            selectedDate.getMonth() === today.getMonth() &&
            selectedDate.getFullYear() === today.getFullYear()
        );
    };


    const getDeliveryPrice = (emirate, slot) => {
        const found = deliveryCharges.find(
            d => d.emirate === emirate && d.slot === slot
        );
        return found ? found.price : 0;
    };

    const deliverySlots = {
        abuDhabi: [
            {
                title: "Standard",
                desc: "7 hour slot",
                price: getDeliveryPrice(selectedEmirate, "Standard"),
                type: "multiple",
                options: ["09:00 AM – 04:00 PM", "04:00 PM – 11:00 PM"]
            },
            {
                title: "Priority",
                desc: "3 hour slot",
                price: getDeliveryPrice(selectedEmirate, "Priority"),
                type: "multiple",
                options: [
                    "10:00 AM – 01:00 PM",
                    "01:00 PM – 04:00 PM",
                    "04:00 PM – 07:00 PM",
                    "07:00 PM – 10:00 PM"
                ]
            },
            {
                title: "Bullet",
                desc: "60 Minutes Slot",
                price: getDeliveryPrice(selectedEmirate, "Bullet"),
                type: "multiple",
                options: [
                    "10:00 AM – 11:00 AM",
                    "11:00 AM – 12:00 PM",
                    "12:00 PM – 01:00 PM",
                    "01:00 PM – 02:00 PM",
                    "02:00 PM – 03:00 PM",
                    "03:00 PM – 04:00 PM",
                    "04:00 PM – 05:00 PM",
                    "05:00 PM – 06:00 PM",
                    "06:00 PM – 07:00 PM",
                    "07:00 PM – 08:00 PM",
                    "08:00 PM – 09:00 PM",
                    "09:00 PM – 10:00 PM"
                ]
            }
        ],

        other: [
            {
                title: "Standard",
                desc: "4 hour slot",
                price: getDeliveryPrice(selectedEmirate, "Standard"),
                type: "multiple",
                options: ["02:00 PM – 06:00 PM", "06:00 PM – 10:00 PM"]
            },
            {
                title: "Priority",
                desc: "Not available in your emirate",
                price: getDeliveryPrice(selectedEmirate, "Priority"),
                type: "disabled"
            },
            {
                title: "Bullet",
                desc: "Not available in your emirate",
                price: getDeliveryPrice(selectedEmirate, "Bullet"),
                type: "disabled"
            }
        ]
    };

    const getFilteredSlots = () => {
        if (!date) return [];

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const selected = new Date(date);
        selected.setHours(0, 0, 0, 0);

        const now = new Date();
        const isTodayDate = selected.getTime() === today.getTime();

        if (selected < today) return [];

        if (isTodayDate && selectedEmirate !== "Abu Dhabi") return [];

        if (selectedEmirate === "Abu Dhabi") {
            return deliverySlots.abuDhabi.map((slot) => {
                if (!slot.options) return slot;

                const futureOptions = slot.options.filter((option) => {
                    const startTime = option.split("–")[0].trim();
                    const startDate = parseTimeToDate(startTime);
                    return !isTodayDate || startDate > now;
                });

                return { ...slot, options: futureOptions };
            });
        }

        if (!isTodayDate) return deliverySlots.other;

        return [];
    };

    const [showSlotDropdown, setShowSlotDropdown] = useState(false);
    const [expandedSlot, setExpandedSlot] = useState(null);
    const [slotError, setSlotError] = useState("");

    const handleSlotFieldClick = () => {
        if (!date) {
            setSlotError("Please select a delivery date first.");
            return;
        }

        if (isToday(date) && selectedEmirate !== "Abu Dhabi") {
            setSlotError("Today delivery is not available for this emirate. Please select tomorrow.");
            return;
        }

        const filtered = getFilteredSlots();
        if (filtered.length === 0) {
            setSlotError("No delivery slots available for this date.");
            return;
        }

        setSlotError("");
        setShowSlotDropdown(!showSlotDropdown);
    };

    useEffect(() => {
        if (selectedSlot) {
            if (!date) setSelectedSlot(null);
            else if (isToday(date) && selectedEmirate !== "Abu Dhabi") setSelectedSlot(null);
        }
    }, [date, selectedEmirate]);

    useEffect(() => {
        if (date) setSlotError("");
    }, [date]);

    const validateForm = () => {
        if (!receiverName.trim()) return setSlotError("Please enter receiver name."), false;
        if (!receiverPhone.trim()) return setSlotError("Please enter receiver phone number."), false;
        if (!selectedEmirate) return setSlotError("Please select an emirate."), false;
        if (!area.trim()) return setSlotError("Please enter area."), false;
        if (!street.trim()) return setSlotError("Please enter street."), false;
        if (!building.trim()) return setSlotError("Please enter building/compound name."), false;
        if (!flat.trim()) return setSlotError("Please enter flat/office/villa number."), false;
        if (!date) return setSlotError("Please select a delivery date."), false;
        if (!selectedSlot) return setSlotError("Please select a delivery slot."), false;

        setSlotError("");
        return true;
    };

    const saveAddress = async () => {
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            const userId = user?._id;

            if (!userId) {
                return showToast("User not logged in", "error");
            }

            if (!date || isNaN(new Date(date).getTime())) {
                return showToast("Invalid delivery date", "error");
            }

            if (!selectedSlot) {
                return showToast("Invalid delivery slot", "error");
            }

            const deliverySlotString =
                selectedSlot.selectedTime
                    ? `${selectedSlot.title} (${selectedSlot.selectedTime})`
                    : selectedSlot.title;

            const payload = {
                userId,
                receiverName,
                receiverPhone,
                country: selectedCountry,
                emirate: selectedEmirate,
                area,
                street,
                building,
                flat,
                deliveryDate: new Date(date).toISOString(),
                deliverySlot: deliverySlotString,
                deliveryCharge: selectedSlot.price || 0,
            };

            await api.post(`${serverUrl}/address/addAddress`, payload, {
                showLoader: true,
            });
            showToast("Address saved successfully", "success");
            setCurrentStep("payment");
        } catch (error) {
            showToast(error.response?.data?.message || "Server error saving address", "error");
        }
    };

    return (
        <div className="shippingcontainer w-full font-Poppins">

            <h2 className="font-Poppins text-2xl text-center font-medium mb-8">
                Receiver Details
            </h2>

            {/* RECEIVER UI (UNCHANGED) */}
            {/* ------------------------------------------------------ */}
            <label className="flex items-center gap-3 mt-2 cursor-pointer">
                <span className="relative flex items-center justify-center">
                    <input
                        type="checkbox"
                        checked={iAmReceiver}
                        onChange={(e) => {
                            setIAmReceiver(e.target.checked);
                            if (e.target.checked) {
                                setReceiverName(name);
                                setReceiverPhone(phoneNumber);
                            } else {
                                setReceiverName("");
                                setReceiverPhone("");
                            }
                        }}
                        className="peer appearance-none w-5 h-5 rounded-full border border-gray-400 cursor-pointer"
                    />
                    <span className="absolute w-3 h-3 rounded-full scale-0 peer-checked:scale-100 transition-transform bg-gradient-to-r from-[#b89bff] to-[#d6b8ff]"></span>
                </span>
                <span className="font-Poppins text-base">I am the receiver</span>
            </label>

            <div className="mt-6">
                <label className="mb-1 block">Name</label>
                <input
                    type="text"
                    placeholder="Receiver name"
                    value={receiverName}
                    onChange={(e) => setReceiverName(e.target.value)}
                    className="w-full bg-[#f4f5f7] rounded-full px-6 py-3 outline-none"
                />
            </div>

            {/* PHONE UI (UNCHANGED) */}
            {/* ------------------------------------------------------ */}
            <div className="flex flex-col mt-6">
                <label className="font-Poppins mb-1">Mobile Number</label>
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative sm:w-1/4 w-full">
                        <div
                            className="bg-[#f4f5f7] rounded-full px-6 py-3 cursor-pointer flex justify-between items-center"
                            onClick={() => setShowDropdown(!showDropdown)}
                        >
                            <div className="flex items-center gap-2">
                                {selectedFlag && (
                                    <img src={selectedFlag} alt="flag" className="w-5 h-4" />
                                )}
                                <span>{selectedCode}</span>
                            </div>
                        </div>

                        {showDropdown && (
                            <div
                                ref={dropdownRef}
                                className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg shadow max-h-56 overflow-y-auto"
                            >
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-3 py-2 border-b outline-none"
                                />

                                {filteredCountries.map((country, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => {
                                            setShowDropdown(false);
                                            setSearchTerm("");
                                            setSelectedFlag(country.flag);
                                            setSelectedCode(country.code);
                                        }}
                                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex justify-between">
                                        <div className="flex items-center gap-2">
                                            <img src={country.flag} className="w-5 h-4" />
                                            <span>{country.name}</span>
                                        </div>
                                        <span>{country.code}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <input
                        type="text"
                        placeholder="Enter phone number"
                        value={receiverPhone}
                        onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "");
                            if (value.length <= 9) setReceiverPhone(value);
                        }}
                        maxLength={9}
                        className="flex-1 border bg-[#f4f5f7] rounded-full px-6 py-3 outline-none border-transparent focus:ring-2 focus:ring-[#bca8ff]"
                    />
                </div>
            </div>

            {/* ADDRESS UI (UNCHANGED) */}
            {/* ------------------------------------------------------ */}

            <h2 className="text-2xl text-center font-medium my-8">Delivery Address.</h2>

            <div className="address w-full flex flex-col gap-4">

                <label className="mb-1">Country</label>
                <div className="relative w-full">
                    <select
                        disabled
                        value={selectedCountry}
                        className="w-full bg-[#f4f5f7] rounded-full px-6 py-3 outline-none cursor-not-allowed"
                    >
                        <option value="United Arab Emirates">United Arab Emirates</option>
                    </select>
                </div>

                {/* EMIRATE DROPDOWN (ONLY LOGIC CHANGED INSIDE onClick) */}
                <label className="font-Poppins mb-1 mt-6">Emirate</label>
                <div className="relative w-full">
                    <div
                        onClick={() => setShowEmirateDropdown(!showEmirateDropdown)}
                        className="w-full bg-[#f4f5f7] rounded-full px-6 py-3 cursor-pointer flex justify-between"
                    >
                        {selectedEmirate || "Select Emirate"}
                        <ChevronDown strokeWidth={1} className={showEmirateDropdown ? "rotate-180" : ""} />
                    </div>

                    {showEmirateDropdown && (
                        <div className="absolute mt-2 w-full bg-white shadow-xl rounded-3xl max-h-64 overflow-y-auto z-20 py-4">
                            {emirates.map((item, index) => (
                                <div
                                    key={index}
                                    onClick={() => {
                                        //  FIRE GLOBAL EMIRATE CHANGE MODAL
                                        window.dispatchEvent(
                                            new CustomEvent("announcementEmirateChange", { detail: item })
                                        );

                                        setShowEmirateDropdown(false);
                                    }}
                                    className="px-6 py-3 cursor-pointer hover:bg-[#f4f5f7]"
                                >
                                    {item}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <label className="mb-1 block">Area</label>
                <input
                    type="text"
                    placeholder="Al Nahda"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="w-full bg-[#f4f5f7] rounded-full px-6 py-3 outline-none"
                />

                <label className="mb-1 block">Street</label>
                <input
                    type="text"
                    placeholder="Al Wasl Road"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className="w-full bg-[#f4f5f7] rounded-full px-6 py-3 outline-none"
                />

                <label className="mb-1 block">Building / Compound Name</label>
                <input
                    type="text"
                    placeholder="Al Zahra Compound"
                    value={building}
                    onChange={(e) => setBuilding(e.target.value)}
                    className="w-full bg-[#f4f5f7] rounded-full px-6 py-3 outline-none"
                />

                <label className="mb-1 block">Flat / Office / Villa No.</label>
                <input
                    type="text"
                    placeholder="Flat 1204 – Downtown Dubai"
                    value={flat}
                    onChange={(e) => setFlat(e.target.value)}
                    className="w-full bg-[#f4f5f7] rounded-full px-6 py-3 outline-none"
                />
            </div>

            {/* DATE & SLOT UI (UNCHANGED) */}
            {/* ------------------------------------------------------ */}

            <h2 className="text-2xl text-center font-medium my-8">Date & Time</h2>

            <div className="flex flex-col gap-4">
                <label className="mb-1 block">Date</label>
                <DatePicker
                    selected={date}
                    onChange={(d) => {
                        setDate(d);
                        setDeliveryDate(d);
                        setShowSlotDropdown(false);
                        setSlotError("");
                    }}
                    dateFormat="dd-MM-yyyy"
                    placeholderText="DD-MM-YYYY"
                    className="w-full bg-[#f4f5f7] rounded-full px-6 py-3 outline-none"
                />

                <div className="w-full mt-6">
                    <label className="mb-1 block">Delivery Slot</label>

                    <div
                        onClick={handleSlotFieldClick}
                        className="w-full bg-[#f4f5f7] rounded-full px-6 py-3 cursor-pointer flex justify-between"
                    >
                        <span>
                            {selectedSlot
                                ? selectedSlot.selectedTime
                                    ? `${selectedSlot.title} (${selectedSlot.selectedTime})`
                                    : selectedSlot.title
                                : "Select a Slot"}
                        </span>
                        <ChevronDown strokeWidth={1} />
                    </div>

                    {slotError && (
                        <p className="text-red-500 text-sm py-2">{slotError}</p>
                    )}

                    {showSlotDropdown && (
                        <div className="bg-white shadow-xl rounded-3xl mt-2 p-6 pb-4 max-h-[380px] overflow-y-auto z-30">
                            {getFilteredSlots().length === 0 ? (
                                <p className="text-red-500 text-sm py-3">
                                    Today delivery is not available for this emirate. Please select tomorrow.
                                </p>
                            ) : (
                                getFilteredSlots().map((slot, index) => (
                                    <div key={index}>
                                        <div
                                            onClick={() => {
                                                if (slot.type === "disabled") return;
                                                if (slot.type === "multiple") {
                                                    setExpandedSlot(
                                                        expandedSlot === slot.title ? null : slot.title
                                                    );
                                                } else {
                                                    setSelectedSlot(slot);
                                                    setDeliverySlot(slot);
                                                    setShowSlotDropdown(false);
                                                }
                                            }}
                                            className={`py-4 flex justify-between items-center 
                                                ${slot.type === "disabled" ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
                                        >
                                            <div>
                                                <h3 className="font-semibold text-lg">{slot.title}</h3>
                                                <p className="text-gray-500 text-sm">{slot.desc}</p>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <span className="text-[#b89bff] font-semibold">
                                                    + AED {slot.price}
                                                </span>
                                                <ChevronRight strokeWidth={1} />
                                            </div>
                                        </div>

                                        {slot.options && expandedSlot === slot.title && (
                                            <div className="space-y-3 pb-4 pl-2">
                                                {slot.options.map((time, idx) => (
                                                    <div
                                                        key={idx}
                                                        onClick={() => {
                                                            const chosenSlot = { ...slot, selectedTime: time };
                                                            setSelectedSlot(chosenSlot);
                                                            setDeliverySlot(chosenSlot);
                                                            setShowSlotDropdown(false);
                                                        }}
                                                        className="bg-[#f4f5f7] rounded-full py-3 px-5 cursor-pointer hover:bg-[#ececec]"
                                                    >
                                                        {time}
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {index !== getFilteredSlots().length - 1 && (
                                            <hr className="border-gray-200 my-1" />
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* CONTINUE BUTTON */}
            <button
                className="w-full mt-10 py-3 rounded-full text-white text-lg font-medium
                    bg-gradient-to-r from-[#b89bff] to-[#d6b8ff]
                    border border-[#bca8ff]
                    shadow-[0_2px_8px_rgba(0,0,0,0.1)]
                    hover:from-[#a27aff] hover:to-[#cda5ff]
                    hover:shadow-[0_4px_14px_rgba(107,70,193,0.3)]
                    transition-all duration-300 cursor-pointer"
                onClick={() => {
                    if (validateForm()) {
                        saveAddress();
                    }
                    window.scrollTo(0, 0);
                }}
            >
                Continue to Payment
            </button>

        </div>
    );
};

export default ShippingStep;
