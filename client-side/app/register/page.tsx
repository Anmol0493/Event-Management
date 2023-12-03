"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FiLock, FiUser } from "react-icons/fi";
import { AiOutlineHome } from "react-icons/ai";
import Link from "next/link";

const Register = () => {
    const router = useRouter();

    const [formData, setFormData] = useState({
        username: "",
        house: "",
        password: "",
        confirmPassword: "",
    });

    const [passwordError, setPasswordError] = useState("");
    const [usernameError, setUsernameError] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        const checkAuthentication = async () => {
            try {
                // const token = Cookies.get("token");
                const token = localStorage.getItem("token");
                if (!token) {
                    setIsAuthenticated(false);
                    return;
                }
                const response = await fetch(`${apiUrl}/api/check-auth`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    }
                });

                if (response.ok) {
                    router.push("/view-expenses");
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error('Error checking authentication status:', error);
            }
        };
        checkAuthentication();
    }, []);

    if (isAuthenticated) {
        return <div>Redirecting page...</div>;
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        if (name === "password" || name === "confirmPassword") {
            setPasswordError("");
        }
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setPasswordError("Passwords do not match");
        }
        try {
            const response = await fetch(`${apiUrl}/api/register`, {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const data = await response.json();
                const token = data.token;
                const username = data.user.username;

                localStorage.setItem('token', token);
                localStorage.setItem('usernames', username);
                router.push("/view-expenses");
                console.log("Registration Successful");
            } else {
                const data = await response.json();
                if (response.status === 400 && data.error === "User already registered") {
                    setUsernameError("Username already taken");
                } else {
                    console.error("Registration failed");
                }
            }

        } catch (error) {
            console.error('Error during registration:', error);
        }
    };

    return (
        <div className="container mx-auto mt-6">
            <div className="max-w-md mx-auto bg-white rounded p-8 shadow-xl border-2 border-gray-300">
                <h2 className="text-3xl font-semibold mb-4">Register</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4 mt-6">
                        <label htmlFor="username" className="block text-gray-700 text-lg font-bold mb-2">Username</label>
                        <div className="flex items-center border rounded-2xl p-2">
                            <FiUser className="text-gray-600 mr-2" />
                            <input type="text" id="username" name="username" placeholder="Enter your username" aria-label="Username" className="w-full outline-none focus:outline-none" onChange={handleChange} value={formData.username} required />
                        </div>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="house" className="block text-gray-700 text-lg font-bold mb-2">House No.</label>
                        <div className="flex items-center border rounded-2xl p-2">
                            <AiOutlineHome className="text-gray-600 mr-2" />
                            <input type="text" id="house" name="house" placeholder="Enter your house number" aria-label="house" className="w-full outline-none focus:outline-none" onChange={handleChange} value={formData.house} required />
                        </div>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-gray-700 text-lg font-bold mb-2">Password</label>
                        <div className="flex items-center border rounded-2xl p-2">
                            <FiLock className="text-gray-600 mr-2" />
                            <input type="password" id="password" name="password" placeholder="Enter your password" className="w-full outline-none focus:outline-none" onChange={handleChange} value={formData.password} required />
                        </div>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="confirmPassword" className="block text-gray-700 text-lg font-bold mb-2">Confirm Password</label>
                        <div className="flex items-center border rounded-2xl p-2">
                            <FiLock className="text-gray-600 mr-2" />
                            <input type="password" id="confirmPassword" name="confirmPassword" placeholder="Enter your password again" className="w-full outline-none focus:outline-none" onChange={handleChange} value={formData.confirmPassword} required />
                        </div>
                        {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
                        {usernameError && <p className="text-red-500 text-sm mt-1">{usernameError}</p>}
                    </div>
                    <div className="flex justify-center mt-6">
                        <button className="bg-blue-500 text-white text-lg px-4 py-1 rounded-xl hover:bg-blue-600 hover:text-xl transition-all duration-300 border-2 border-black">Submit</button>
                    </div>
                </form>
                <div className="block mt-4"><Link href="/">Already registered? Click here</Link></div>
            </div>
        </div>
    )
};

export default Register;