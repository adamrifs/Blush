import React from 'react'
import { RxChevronRight, RxChevronDown } from "react-icons/rx";
import { PiUsersLight } from "react-icons/pi";
import { PiHandbagSimpleLight } from "react-icons/pi";
import { IoCart } from "react-icons/io5";
import { TbFileInvoice } from "react-icons/tb";
import { RiHomeSmile2Line } from "react-icons/ri";
import { VscAccount } from "react-icons/vsc";
import { useState } from 'react';
import { Bolt } from 'lucide-react';
const SideBar = ({ setActivePage, activePage, isSidebarOpen, setIsSideBarOpen }) => {

    const [openCustomers, setOpenCustomers] = useState(false)
    const [openProducts, setOpenProducts] = useState(false)
    const [openOrders, setOpenOrders] = useState(false);

    return (
        <>

            <div
                className={`fixed inset-0  bg-opacity-30 z-10 md:hidden transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
                onClick={() => setIsSideBarOpen(false)}
            />

            <div
                className={`fixed left-0 top-0 min-h-screen w-[240px] md:w-[280px] bg-[#2F3746] z-20 transform transition-transform duration-300
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
                `}
            >
                <div className='p-4 pt-7'>
                    <h1 className='font-chopard text-white text-4xl text-center '>BLUSH</h1>
                </div>

                <div className='text-[#E5E7EB] font-montserrat p-4 flex flex-col items-start gap-4'>
                    {/* Overview =========================*/}
                    <p className={`hover:bg-[#6C737F] transition duration-300 cursor-pointer text-[16px] w-full p-3 rounded-xl flex items-center justify-start gap-2 ${activePage === "overview" ? "bg-[#6C737F]" : ''}`} onClick={() => setActivePage('overview')}>
                        <RiHomeSmile2Line className='text-2xl' />
                        <span className='flex-1 text-left'>Overview</span>
                    </p>

                    {/* Account =============================*/}
                    {/* <p className='hover:bg-[#6C737F] transition duration-300 cursor-pointer text-[16px] w-full p-3 rounded-xl flex items-center justify-start gap-2' onClick={() => setActivePage('account')}>
                        <VscAccount className='text-2xl' />
                        <span className='flex-1 text-left'>Account</span>
                    </p> */}

                    {/* Customers================================== */}
                    <p className={`${openCustomers ? 'bg-[#6C737F] text-white' : 'hover:bg-[#6C737F] transition duration-300'} cursor-pointer text-[16px] w-full p-3 rounded-xl flex items-center justify-start gap-2`} onClick={() => setOpenCustomers(!openCustomers)}>
                        <PiUsersLight className='text-2xl' />
                        <span className='flex-1 text-left'>Customers</span>
                        {openCustomers ? <RxChevronDown className='text-2xl' /> : <RxChevronRight className='text-2xl' />}
                    </p>

                    {openCustomers && (
                        <div className='text-[#E5E7EB] font-montserrat w-full p-1 flex flex-col items-start gap-4'>
                            <p
                                className={`cursor-pointer text-[14px] w-full p-2 rounded-lg flex items-center 
    ${activePage === 'customer-list' ? 'bg-[#6C737F]' : ''}`}
                                onClick={() => setActivePage('customer-list')}
                            >
                                List
                            </p>

                        </div>
                    )}

                    {/* Products ==================================*/}
                    <p className={`${openProducts ? 'bg-[#6C737F]' : "hover:bg-[#6C737F] transition duration-300 "} cursor-pointer text-[16px] w-full p-3 rounded-xl flex items-center justify-start gap-2`} onClick={() => setOpenProducts(!openProducts)}>
                        <PiHandbagSimpleLight className='text-2xl' />
                        <span className='flex-1 text-left'>Products</span>
                        {openProducts ? <RxChevronDown className='text-2xl' /> : <RxChevronRight className='text-2xl' />}
                    </p>

                    {openProducts && (
                        <div className='text-[#E5E7EB] w-full p-1 flex flex-col items-start gap-4'>
                            <p className={`cursor-pointer text-[14px] w-full p-2 rounded-lg flex items-center ${activePage === 'product-list' ? 'bg-[#6C737F]' : ""} hover:bg-[#6C737F] '}`} onClick={() => setActivePage('product-list')}>List</p>

                            <p className={`${activePage === 'product-create' ? 'bg-[#6C737F]' : ""} cursor-pointer text-[14px] w-full p-2 rounded-lg flex items-center hover:bg-[#6C737F] '}`} onClick={() => setActivePage('product-create')}>Create</p>

                            <p className={`${activePage === 'bulk-create' ? 'bg-[#6C737F]' : ""} cursor-pointer text-[14px] w-full p-2 rounded-lg flex items-center hover:bg-[#6C737F] '}`} onClick={() => setActivePage('bulk-create')}>Bulk Create</p>
                        </div>
                    )}

                    {/* Orders ========================================*/}
                    <p
                        className={`${activePage === 'orders' || activePage === 'order-analytics' ? 'bg-[#6C737F]' : 'hover:bg-[#6C737F]'} 
    cursor-pointer text-[16px] w-full p-3 rounded-xl flex items-center justify-start gap-2`}
                        onClick={() => setOpenOrders(prev => !prev)}
                    >
                        <IoCart className='text-2xl' />
                        <span className='flex-1 text-left'>Orders</span>
                        {openOrders ? <RxChevronDown className='text-2xl' /> : <RxChevronRight className='text-2xl' />}
                    </p>

                    {openOrders && (
                        <div className='text-[#E5E7EB] w-full p-1 flex flex-col items-start gap-4'>
                            <p
                                className={`cursor-pointer text-[14px] w-full p-2 rounded-lg flex items-center 
            ${activePage === 'orders' ? 'bg-[#6C737F]' : ''} hover:bg-[#6C737F]'}`}
                                onClick={() => setActivePage('orders')}
                            >
                                All Orders
                            </p>

                            <p
                                className={`cursor-pointer text-[14px] w-full p-2 rounded-lg flex items-center 
            ${activePage === 'order-analytics' ? 'bg-[#6C737F]' : ''} hover:bg-[#6C737F]'}`}
                                onClick={() => setActivePage('order-analytics')}
                            >
                                Orders Analytics
                            </p>
                        </div>
                    )}



                    {/* Invoices ===========================================*/}
                    <p className='hover:bg-[#6C737F] transition duration-300 cursor-pointer text-[16px] w-full p-3 rounded-xl flex items-center justify-start gap-2'>
                        <TbFileInvoice className='text-2xl' />
                        <span className='flex-1 text-left'>Invoices</span>
                        <RxChevronRight className='text-2xl' />
                    </p>

                    {/* Settings ========================================*/}
                    <p
                        className={`${activePage === 'settings' ? 'bg-[#6C737F]' : 'hover:bg-[#6C737F]'
                            } cursor-pointer text-[16px] w-full p-3 rounded-xl flex items-center justify-start gap-2`}
                        onClick={() => setActivePage('settings')}
                    >
                        <Bolt strokeWidth={1} className='text-2xl' />
                        <span className='flex-1 text-left'>Settings</span>
                    </p>

                </div>
            </div>
        </>
    )
}

export default SideBar