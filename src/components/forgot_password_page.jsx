import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import './style.css';

export default function OtpPage() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen">

      {/* Background */}
      <img
        src="https://res.cloudinary.com/dvvl4i8q9/image/upload/v1773550793/Gemini_Generated_Image_e31p3de31p3de31p_krob6i.png"
        alt="background"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Dark Overlay */}
      {/*<div className="absolute inset-0 bg-[#0B1C2D]/80"></div>*/}

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Back Button */}
        <div className="flex items-center p-6">
          <button
            onClick={() => navigate(-1)}
            className="text-white text-2xl"
          >
            <ArrowLeft size={22} className="text-white"/>
          </button>
        </div>
        {/* Center Content */}
        {/*<div className="flex flex-1 flex-col justify-center items-center px-6 text-center">*/}
        <div className="flex flex-1 flex-col justify-start items-center px-6 pt-40 text-center">

          <h1 className="text-3xl font-bold text-white mb-3">
            Reset Password
          </h1>

          <p className="text-gray-300 mb-8">
            Enter your email to receive OTP
          </p>

          {/* Email Input with Icon */}
          <div className="w-full max-w-sm relative">

            {/* Email Icon */}
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 8l9 6 9-6M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>

            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-14 pl-12 pr-4 rounded-xl 
              bg-white/10 text-white placeholder-gray-300 
              border border-white/20 
              focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

          </div>

          {/* Button */}
          <button
            className="w-full max-w-sm mt-6 h-14 rounded-xl 
            font-semibold text-white 
            bg-gradient-to-r from-blue-500 to-cyan-400 
            hover:opacity-90 transition"
          >
            Send OTP
          </button>

        </div>
      </div>
    </div>
  );
}