"use client"
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FiLock, FiUser } from "react-icons/fi";
import Link from "next/link";
// import Cookies from "js-cookie";


const Login = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });

  const [error, setError] = useState("");
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value }: any = e.target;
    if (name === "password") {
      setError("");
    }
    
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch(`${apiUrl}/api/login`, {
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
        
        // Cookies.set("token", token, { httpOnly: true });
        localStorage.setItem("token", token);
        localStorage.setItem("username", username);
        router.push("/view-expenses");
        console.log("Login Successful");
      } else {
        const data = await response.json();

        if (response.status === 401 && data.error) {
          setError("Invalid username or password");
        } else {
          console.error("Login failed, Please try again.");
        }
      }

    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  return (
    <div className="container mx-auto mt-6">
      <div className="max-w-md mx-auto bg-white rounded p-8 shadow-xl border-2 border-gray-300">
        <h2 className="text-3xl font-semibold mb-4">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4 mt-6">
            <label htmlFor="username" className="block text-gray-700 text-lg font-bold mb-2">Username</label>
            <div className="flex items-center border rounded-2xl p-2">
              <FiUser className="text-gray-600 mr-2" />
              <input type="text" id="username" name="username" placeholder="Enter your username" aria-label="Username" className="w-full outline-none focus:outline-none" onChange={handleChange} value={formData.username} required />
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 text-lg font-bold mb-2">Password</label>
            <div className="flex items-center border rounded-2xl p-2">
              <FiLock className="text-gray-600 mr-2" />
              <input type="password" id="password" name="password" placeholder="Enter your password" className="w-full outline-none focus:outline-none" onChange={handleChange} value={formData.password} required />
            </div>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex justify-center mt-6">
            <button className="bg-blue-500 text-white text-lg px-4 py-1 rounded-xl hover:bg-blue-600 hover:text-xl transition-all duration-300 border-2 border-black">Submit</button>
          </div>
        </form>
        <div className="block mt-4"><Link href="/register">New User? Click here</Link></div>
      </div>
    </div>
  );
};

export default Login;