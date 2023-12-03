"use client";
import React, { useState } from "react";
import useAuth from "../hooks/useAuth";
import { FiEdit } from "react-icons/fi";
import { FiLock } from "react-icons/fi";


const Account = () => {

    useAuth();

    const storedUsername = localStorage.getItem("username");

    const [formData, setFormData] = useState({
        originalUsername: storedUsername,
        newUsername: "",
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: ""
    });

    const [usernameError, setUsernameError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [isEditingUsername, setIsEditingUsername] = useState(false);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const handleEditUsername = () => {
        setIsEditingUsername(true);
    };

    const handleChange = (e: any) => {
        const { name, value } = e.target;

        if (name === "newUsername") setUsernameError("");
        if (name === "newPassword" || name === "confirmNewPassword") setPasswordError("");

        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleUsernameUpdate = async () => {

        try {
            const response = await fetch(`${apiUrl}/api/update-username`, {
                method: "PUT",
                headers: {
                    "content-type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ newUsername: formData.newUsername }),
            });

            if (response.ok) {
                console.log("Username updated successfully");
                setIsEditingUsername(false);
                setUsernameError("Username updated successfully");
            } else {
                const data = await response.json();
                setUsernameError(data.error || "Failed to update username");
            }
        } catch (error) {
            console.error("Error updating username:", error);
        }
    };

    const handlePasswordUpdate = async (user: any) => {
        if (formData.oldPassword === user.password) {
            if (user.oldPassword != formData.newPassword) {
                if (formData.newPassword === formData.confirmNewPassword) {
                    const response = await fetch(`${apiUrl}/api/update-password`, {
                        method: "PUT",
                        headers: {
                            "content-type": "application/json",
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                        body: JSON.stringify({ newPassword: formData.newPassword }),
                    });

                    if (response.ok) {
                        console.log("Password updated successfully")
                        setPasswordError("Password updated successfully");
                    } else {
                        const data = await response.json();
                        setPasswordError(data.error || "Failed to update password");
                    }
                } else {
                    setPasswordError("New password does not match");
                }
            } else {
                setPasswordError("You can't use current password as new password");
            }
        } else {
            setPasswordError("Password is incorrect");
        }
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        try {
            const userRequest = await fetch(`${apiUrl}/api/get-user-data`, {
                method: "GET",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({ username: storedUsername })
            });

            const user = await userRequest.json();

            if (isEditingUsername) {
                handleUsernameUpdate();
            } else {
                handlePasswordUpdate(user);
            }

        } catch (error) {
            console.error("Error updating data:", error);
        }
    };

    return (
        <div className="container mx-auto mt-8">
            <div className="max-w-md mx-auto bg-white rounded p-8 shadow-xl border-2 border-gray-300">
                <h2 className="text-3xl font-semibold mb-4">Account Settings</h2>
                <div className="mb-4 mt-6">
                    <label htmlFor="originalUsername" className="block text-gray-700 text-lg font-bold mb-2">Username</label>
                    <div className="flex items-center border rounded-2xl p-2">
                        {isEditingUsername ? (
                            <>
                                <input type="text" id="newUsername" name="newUsername" placeholder="Edit Username" aria-label="New Username" className="w-full outline-none focus:outline-none" onChange={handleChange} value={formData.newUsername} />
                                <FiEdit className="text-gray-500 mr-2" title="Save Username" onClick={handleEditUsername} />
                            </>
                        ) : (
                            <>
                                <div className="mr-2 flex-1">{formData.originalUsername}</div>
                                <FiEdit className="text-gray-500 mr-2" title="Edit Username" onClick={handleEditUsername} />
                            </>
                        )}
                    </div>
                    {usernameError && <p className="text-red-500 text-sm mt-1">{usernameError}</p>}
                </div>
                <form onSubmit={handleSubmit}>
                    {!isEditingUsername && (
                        <div>
                            <div className="mb-4">
                                <label htmlFor="oldPassword" className="block text-gray-700 text-lg font-bold mb-2">Current Password</label>
                                <div className="flex items-center border rounded-2xl p-2">
                                    <input type="password" id="oldPassword" name="oldPassword" placeholder="Enter Old Password" className="w-full outline-none focus:outline-none" onChange={handleChange} value={formData.oldPassword} required />
                                    <FiLock className="text-gray-600 mr-2" />
                                </div>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="newPassword" className="block text-gray-700 text-lg font-bold mb-2">New Password</label>
                                <div className="flex items-center border rounded-2xl p-2">
                                    <input type="password" id="newPassword" name="newPassword" placeholder="Enter new password" className="w-full outline-none focus:outline-none" onChange={handleChange} value={formData.newPassword} required />
                                    <FiLock className="text-gray-600 mr-2" />
                                </div>
                                <div className="flex items-center border rounded-2xl p-2">
                                    <input type="password" id="confirmNewPassword" name="confirmNewPassword" placeholder="Re-enter new password" className="w-full outline-none focus:outline-none" onChange={handleChange} value={formData.confirmNewPassword} required />
                                    <FiLock className="text-gray-600 mr-2" />
                                </div>

                                {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
                            </div>
                        </div>
                    )}
                    <div className="flex justify-center mt-8">
                        <button className="bg-blue-500 text-white text-lg px-4 py-1 rounded-xl hover:bg-blue-600 hover:text-xl transition-all duration-300 border-2 border-black" type="submit">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Account;