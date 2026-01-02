import React, { useEffect, useState } from "react";
import axios from "axios";
import { serverUrl } from "../../urls";

import {
    LineChart, Line,
    BarChart, Bar,
    PieChart, Pie, Cell,
    XAxis, YAxis, Tooltip, CartesianGrid,
    ResponsiveContainer,
    Legend
} from "recharts";

const COLORS = [
    "#6366F1", "#EC4899", "#10B981", "#F59E0B", "#3B82F6", "#EF4444", "#8B5CF6"
];

const OrderAnalytics = () => {
    const [orders, setOrders] = useState([]);
    const [revenueData, setRevenueData] = useState([]);
    const [ordersPerDay, setOrdersPerDay] = useState([]);
    const [ordersByEmirate, setOrdersByEmirate] = useState([]);

    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");


    const fetchOrders = async () => {
        const res = await axios.get(`${serverUrl}/orders/admin/all`, { withCredentials: true });
        const all = res.data.orders;
        setOrders(all);
        processAnalytics(all); // <-- IMPORTANT
    };

    const processAnalytics = (all) => {
        const filtered = filterByDateRange(all);

        // Orders per day
        const ordersGroupedByDate = {};
        filtered.forEach(order => {
            const date = order.createdAt?.split("T")[0];
            ordersGroupedByDate[date] = (ordersGroupedByDate[date] || 0) + 1;
        });

        setOrdersPerDay(
            Object.keys(ordersGroupedByDate).map(date => ({
                date,
                count: ordersGroupedByDate[date]
            }))
        );

        // Revenue per day
        const revenuePerDay = {};
        filtered.forEach(order => {
            const date = order.createdAt?.split("T")[0];
            const total = order.totals?.grandTotal || 0;
            revenuePerDay[date] = (revenuePerDay[date] || 0) + total;
        });

        setRevenueData(
            Object.keys(revenuePerDay).map(date => ({
                date,
                revenue: revenuePerDay[date]
            }))
        );

        // Orders by Emirate
        const emirateMap = {};
        filtered.forEach(order => {
            const emirate = order.shipping?.emirate || "Unknown";
            emirateMap[emirate] = (emirateMap[emirate] || 0) + 1;
        });

        setOrdersByEmirate(
            Object.keys(emirateMap).map(name => ({
                name,
                value: emirateMap[name]
            }))
        );
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const filterByDateRange = (orders) => {
        if (!fromDate && !toDate) return orders;

        return orders.filter(order => {
            const orderDate = new Date(order.createdAt);
            const start = fromDate ? new Date(fromDate) : null;
            const end = toDate ? new Date(toDate) : null;

            if (start && orderDate < start) return false;
            if (end && orderDate > end) return false;

            return true;
        });
    };

    return (
        <div className="p-6">

            <h1 className="text-3xl font-semibold mb-8">Order Analytics</h1>
            {/* Date Range Filter */}
            <div className="bg-white p-4 rounded-xl shadow-md border border-gray-300 mb-8 flex flex-col md:flex-row gap-4 md:items-end">

                <div className="flex flex-col w-full md:w-1/3">
                    <label className="text-sm text-gray-600 mb-1 font-Poppins">From Date</label>
                    <input
                        type="date"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                        className="border border-gray-300 px-3 py-2 rounded-lg cursor-pointer outline-0"
                    />
                </div>

                <div className="flex flex-col w-full md:w-1/3">
                    <label className="text-sm text-gray-600 mb-1 font-Poppins">To Date</label>
                    <input
                        type="date"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                        className="border border-gray-300 px-3 py-2 rounded-lg cursor-pointer outline-0"
                    />
                </div>

                <button
                    onClick={() => processAnalytics(orders)}
                    className="bg-[#2F3746] text-white px-6 py-2 rounded-lg md:w-auto w-full cursor-pointer"
                >
                    Apply
                </button>

            </div>

            {/* Revenue Line Chart */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-300 mb-10">
                <h2 className="text-xl font-semibold mb-4">Revenue Trend</h2>

                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="revenue" stroke="#7C3AED" strokeWidth={3} />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Orders Per Day */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-300 mb-10">
                <h2 className="text-xl font-semibold mb-4">Orders Per Day</h2>

                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={ordersPerDay}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" fill="#60A5FA" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Orders by Emirate */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-300 mb-10">
                <h2 className="text-xl font-semibold mb-4">Orders by Emirate</h2>

                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Tooltip />
                        <Legend />
                        <Pie
                            data={ordersByEmirate}
                            dataKey="value"
                            nameKey="name"
                            outerRadius={120}
                            label
                        >
                            {ordersByEmirate.map((entry, index) => (
                                <Cell key={index} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
            </div>

        </div>
    );
};

export default OrderAnalytics;
