"use client"
import React from "react";
import useAuth from "../hooks/useAuth";


const ViewExpenses = () => {
    useAuth();
    return <div>View Expenses</div>;
};

export default ViewExpenses;