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

const percentChange = (current, previous) => {
    if (previous === 0 && current === 0) return 0;
    if (previous === 0 && current > 0) return 100;
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
};

const OrderAnalytics = () => {
    const [orders, setOrders] = useState([]);
    const [revenueData, setRevenueData] = useState([]);
    const [ordersPerDay, setOrdersPerDay] = useState([]);
    const [ordersByEmirate, setOrdersByEmirate] = useState([]);

    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    const [revenueStats, setRevenueStats] = useState({
        today: 0,
        yesterday: 0,
        week: 0,
        month: 0,
        stripe: 0,
        tabby: 0,
        cod: 0,
        delivered: 0,
    });



    const fetchOrders = async () => {
        const res = await axios.get(`${serverUrl}/orders/admin/all`, { withCredentials: true });
        const all = res.data.orders;
        setOrders(all);
        processAnalytics(all); // <-- IMPORTANT
    };

    const processAnalytics = (all) => {
        const filtered = filterByDateRange(all);

        const now = new Date();
        const todayStr = now.toISOString().split("T")[0];

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split("T")[0];

        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());

        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        let stats = {
            today: 0,
            yesterday: 0,
            week: 0,
            month: 0,
            stripe: 0,
            tabby: 0,
            cod: 0,
            delivered: 0,
        };

        // Orders per day
        const ordersGroupedByDate = {};
        const revenuePerDay = {};
        const emirateMap = {};

        filtered.forEach(order => {
            const date = order.createdAt?.split("T")[0];
            const orderDate = new Date(order.createdAt);

            const revenue =
                order.payment?.status === "paid" ||
                    (order.payment?.method === "cod" && order.status === "delivered")
                    ? (order.payment?.amount || order.totals?.grandTotal || 0)
                    : 0;

            // 📆 Time-based revenue
            if (date === todayStr) stats.today += revenue;
            if (date === yesterdayStr) stats.yesterday += revenue;
            if (orderDate >= startOfWeek) stats.week += revenue;
            if (orderDate >= startOfMonth) stats.month += revenue;

            // 💳 Payment-wise
            if (order.payment?.method === "stripe") stats.stripe += revenue;
            if (order.payment?.method === "tabby") stats.tabby += revenue;
            if (order.payment?.method === "cod" && order.status === "delivered") {
                stats.cod += revenue;
            }

            // 📦 Delivered revenue
            if (order.status === "delivered") stats.delivered += revenue;

            // Charts
            ordersGroupedByDate[date] = (ordersGroupedByDate[date] || 0) + 1;
            revenuePerDay[date] = (revenuePerDay[date] || 0) + revenue;

            const emirate = order.shipping?.emirate || "Unknown";
            emirateMap[emirate] = (emirateMap[emirate] || 0) + 1;
        });

        setRevenueStats(stats);

        setOrdersPerDay(
            Object.keys(ordersGroupedByDate).map(date => ({
                date,
                count: ordersGroupedByDate[date]
            }))
        );

        setRevenueData(
            Object.keys(revenuePerDay).map(date => ({
                date,
                revenue: revenuePerDay[date]
            }))
        );

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

    // 📅 Dates
    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

    // 💰 Today Revenue (PAID + COD delivered only)
    const todayRevenue = orders
        .filter(o =>
            o.createdAt?.startsWith(today) &&
            (
                o.payment?.status === "paid" ||
                (o.payment?.method === "cod" && o.status === "delivered")
            )
        )
        .reduce((sum, o) => sum + (o.totals?.grandTotal || 0), 0);

    // 💰 Yesterday Revenue
    const yesterdayRevenue = orders
        .filter(o =>
            o.createdAt?.startsWith(yesterday) &&
            (
                o.payment?.status === "paid" ||
                (o.payment?.method === "cod" && o.status === "delivered")
            )
        )
        .reduce((sum, o) => sum + (o.totals?.grandTotal || 0), 0);

    // 📈 Trend %
    const todayTrend = percentChange(todayRevenue, yesterdayRevenue);

    return (
        <div className="p-6">

            <h1 className="text-3xl font-semibold mb-8">Order Analytics</h1>
            {/* 🔥 Revenue Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 font-Poppins">

                <RevenueCard
                    label="Today Revenue"
                    value={todayRevenue}
                    change={todayTrend}
                />

                <RevenueCard
                    label="Yesterday Revenue"
                    value={yesterdayRevenue}
                    change={-todayTrend}
                />
                <RevenueCard label="This Week Revenue" value={revenueStats.week} />
                <RevenueCard label="This Month Revenue" value={revenueStats.month} />

            </div>

            {/* 💳 Payment Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">

                <RevenueCard label="Stripe Revenue" value={revenueStats.stripe} />
                <RevenueCard label="Tabby Revenue" value={revenueStats.tabby} />
                <RevenueCard label="COD Revenue (Delivered)" value={revenueStats.cod} />

            </div>

            {/* 📦 Delivered Revenue */}
            <div className="grid grid-cols-1 sm:grid-cols-1 gap-6 mb-10">
                <RevenueCard label="Delivered Orders Revenue" value={revenueStats.delivered} />
            </div>

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

import { ArrowUpRight, ArrowDownRight } from "lucide-react";

const RevenueCard = ({ label, value, change }) => {
    const safeChange =
        typeof change === "number" && isFinite(change) ? change : 0;

    const isPositive = safeChange >= 0;

    const formatChange = (current, previous) => {
        if (previous === 0 && current > 0) return "New";
        if (previous === 0 && current === 0) return "0%";
        return `${percentChange(current, previous).toFixed(1)}%`;
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-300">
            <p className="text-gray-500 text-sm">{label}</p>

            <h3 className="text-3xl font-bold mt-2 text-[#2F3746]">
                AED {Number(value || 0).toFixed(2)}
            </h3>

            <div
                className={`mt-2 flex items-center gap-1 text-sm font-medium
                ${isPositive ? "text-green-600" : "text-red-600"}`}
            >
                {isPositive ? (
                    <ArrowUpRight size={18} />
                ) : (
                    <ArrowDownRight size={18} />
                )}

                <span>{formatChange(value, value - safeChange)}</span>
                <span className="text-gray-400 font-normal">vs previous</span>
            </div>
        </div>
    );
};



export default OrderAnalytics;
