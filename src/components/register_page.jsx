import React, { useState } from "react";
import { useEffect } from "react";
import { User, Mail, Lock } from "lucide-react";
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import './style.css';

export default function Register() {
  const [role, setRole] = useState("buyer"); // for Buyer/Seller selection
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
        navigate("/home");
    }
  }, []);
  const handleRegister = async () => {
    setError("");
    setSuccess("");

    if (!fullName || !email || !password) {
      setError("All fields are required");
      return;
    }

    try {
      const res = await fetch("https://movie-nova-3.onrender.com/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: fullName,
          email,
          password,
          role
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed");
        return;
      }
      const userRole = data.role || role;
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", userRole);
      if (userRole === "seller") {
        navigate("/creation");
      } else {
        navigate("/creation1");
      }
    } catch (err) {
      console.error(err);
      setError("Server error");
    }
  };
  return (
    <div className="min-h-screen w-full bg-gray-100 flex items-center justify-center">

   {/* Mobile container */}  
   <div className="w-full max-w-md bg-white min-h-screen px-6 pt-10">  

    {/* Title */}  
    <h1 className="text-2xl font-bold text-center text-gray-800">  
      Create Account  
    </h1>  

    <p className="text-center text-gray-500 mt-1 mb-8">  
      Join as Buyer or Seller  
    </p>  

    {/* Role Selection */}  
    <div className="flex gap-4 mb-8">  

      {/* Buyer */}  
      <div  
        onClick={() => setRole("buyer")}  
        className={`flex-1 cursor-pointer rounded-xl p-4 text-center transition shadow-sm  
        ${role === "buyer"  
          ? "bg-blue-600 text-white"  
          : "bg-white border border-gray-200"}  
        `}  
      >  
        <div className="flex justify-center mb-2">  
          <User className={`${role === "buyer" ? "text-white" : "text-gray-400"}`} />  
        </div>  

        <p className="font-medium">Buyer</p>  
      </div>  

      {/* Seller */}  
      <div  
        onClick={() => setRole("seller")}  
        className={`flex-1 cursor-pointer rounded-xl p-4 text-center transition shadow-sm  
        ${role === "seller"  
          ? "bg-blue-600 text-white"  
          : "bg-white border border-gray-200"}  
        `}  
      >  
        <div className="flex justify-center mb-2">  
          <User className={`${role === "seller" ? "text-white" : "text-gray-400"}`} />  
        </div>  

        <p className="font-medium">Seller</p>  
      </div>  

    </div>  

    {/* Full Name */}  
    <div className="flex items-center bg-gray-100 rounded-xl px-4 py-3 mb-4">  
      <User className="text-gray-400 mr-2" size={18} />  
      <input  
        type="text"  
        placeholder="Full Name"  
        className="bg-transparent outline-none w-full" 
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
      />  
    </div>  

    {/* Email */}  
    <div className="flex items-center bg-gray-100 rounded-xl px-4 py-3 mb-4">  
      <Mail className="text-gray-400 mr-2" size={18} />  
      <input  
        type="email"  
        placeholder="Email"  
        className="bg-transparent outline-none w-full" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />  
    </div>  

    {/* Password */}  
    <div className="flex items-center bg-gray-100 rounded-xl px-4 py-3 mb-8">  
      <Lock className="text-gray-400 mr-2" size={18} />  
      <input  
        type="password"  
        placeholder="Password"  
        className="bg-transparent outline-none w-full"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />  
    </div>  
    
    {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
    {success && <p className="text-green-500 mb-4 text-center">{success}</p>}

    {/* Register Button */}  
    <button onClick={handleRegister} className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition">  
      Register  
    </button>  

    {/* Login */}  
    <p className="text-center text-gray-500 mt-6">  
      Already have an account?{" "}  
      <Link to="/login" className="text-blue-600 font-medium cursor-pointer">  
        Login  
      </Link>  
    </p>  

  </div>  

</div>

);
}