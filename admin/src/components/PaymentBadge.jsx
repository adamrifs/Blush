import React from "react";

const PaymentBadge = ({ method }) => {
    if (!method) return null;

    if (method === "cod") {
        return (
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">
                COD
            </span>
        );
    }

    if (method === "card" || method === "applepay") {
        return (
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                Paid
            </span>
        );
    }

    if (method === "tabby" || method === "tamara") {
        return (
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700 capitalize">
                {method}
            </span>
        );
    }

    return (
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 capitalize">
            {method}
        </span>
    );
};

export default PaymentBadge;
