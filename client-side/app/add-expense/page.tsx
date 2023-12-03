"use client";
import React from "react";
import useAuth from "../hooks/useAuth";


const AddExpense = () => {
    useAuth();
    return <div>Add Expense</div>;
};

export default AddExpense;