import React, { useContext, useEffect, useState } from 'react'
import { MapPin, Mail, Phone, Globe } from "lucide-react";
import axios from 'axios';
import { serverUrl } from '../../../url';
import { ProductContext } from '../../context/ProductContext';
import api from '../../utils/axiosInstance';

const MyAdresses = () => {
    const { user } = useContext(ProductContext)
    const userId = user._id
    const [address, setAddress] = useState([])


    const formatDeliverySlot = (slot) => {
        if (!slot) return "-";
        if (typeof slot === "string") return slot; // old addresses
        return `${slot.title} (${slot.time})`;     // new addresses
    };


    // address

    const fetchUserAddress = async () => {
        try {
            const response = await api.get(serverUrl + `/address/getAddress/${userId}`)
            if (response.data.success) {
                setAddress(response.data.addresses)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchUserAddress()
    }, [userId])
    return (
        <div className="p-6 sm:p-8 font-Poppins">
            <h2 className="text-2xl font-semibold text-gray-800 mb-8">
                My Addresses
            </h2>

            {address.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center text-gray-600 py-20">
                    <MapPin size={60} className="text-gray-300 mb-5" />
                    <p className="text-lg font-medium">You haven't added any addresses yet.</p>

                    <button
                        className="mt-6 px-7 py-3 rounded-full 
        bg-gradient-to-r from-[#b89bff] to-[#d6b8ff]
        border border-[#bca8ff] shadow-[0_2px_10px_rgba(0,0,0,0.08)]
        hover:from-[#a27aff] hover:to-[#cda5ff]
        text-white font-medium transition-all duration-300 cursor-pointer"
                    >
                        Add New Address
                    </button>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 gap-8">
                    {address.slice(0, 1).map((address, index) => (
                        <div
                            key={index}
                            className="bg-white border border-gray-200 rounded-2xl p-7 shadow-md 
                     hover:shadow-lg transition-all duration-300"
                        >
                            {/* Header */}
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#f3ecff]">
                                    <MapPin className="text-[#a27aff]" size={22} />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-800 tracking-wide">
                                    {address.receiverName}
                                </h3>
                            </div>

                            {/* Contact */}
                            <div className="space-y-1">
                                <p className="text-sm text-gray-600 flex items-center gap-2">
                                    <Phone size={16} className="text-[#b89bff]" />
                                    {address.receiverPhone}
                                </p>
                            </div>

                            {/* Address */}
                            <div className="mt-5 text-sm text-gray-700 leading-relaxed space-y-1">
                                <p className="font-medium text-gray-900">
                                    {address.building}, {address.flat}
                                </p>
                                <p>{address.street}</p>
                                <p>{address.area}, {address.emirate}</p>
                                <p>{address.country}</p>
                            </div>

                            {/* Divider */}
                            <div className="border-t border-gray-200 my-5"></div>

                            {/* Delivery Info */}
                            <div className="bg-[#faf9f6] p-4 rounded-xl border border-gray-100 space-y-2">
                                <p className="text-sm">
                                    <span className="font-semibold text-gray-900">Delivery Date:</span>{" "}
                                    {new Date(address.deliveryDate).toLocaleDateString("en-GB").replace(/\//g, "-")}
                                </p>
                                <p className="text-sm">
                                    <span className="font-semibold text-gray-900">Delivery Slot:</span>{" "}
                                    {formatDeliverySlot(address.deliverySlot)}
                                </p>
                                <p className="text-sm">
                                    <span className="font-semibold text-gray-900">Delivery Charge:</span>{" "}
                                    AED {address.deliveryCharge}
                                </p>
                            </div>

                            {/* Button */}
                            <button
                                className="mt-6 w-full py-3 rounded-full bg-gradient-to-r from-[#b89bff] to-[#d6b8ff]
                       border border-[#bca8ff] shadow-[0_2px_10px_rgba(0,0,0,0.08)]
                       hover:from-[#a27aff] hover:to-[#cda5ff]
                       hover:shadow-[0_6px_18px_rgba(107,70,193,0.25)]
                       text-white font-medium transition-all duration-300 cursor-pointer"
                            >
                                Edit Address
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>

    )
}

export default MyAdresses