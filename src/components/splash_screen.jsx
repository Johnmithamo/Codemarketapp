import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './style.css';

export default function SplashScreen() {
  const navigate = useNavigate();
  useEffect(() => {
    // 1. Set a timer for 3000 milliseconds (3 seconds)
    const timer = setTimeout(() => {
      navigate("/register"); // 2. Navigate to the register path
    }, 5000);

    // 3. Cleanup the timer if the component unmounts before the 3s is up
    return () => clearTimeout(timer);
  }, [navigate]);
  return (
    <div className="relative h-screen w-full overflow-hidden">

      {/* Background Image */}
      <img
        src="https://res.cloudinary.com/dvvl4i8q9/image/upload/v1773327621/file_000000005ea47246899ee3046b4a8881_xm5ybo.png"
        alt="splash background"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Overlay Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center mt-64">
     
        {/* App Name */}
        <h1 className="text-white text-4xl font-bold tracking-wide drop-shadow-lg">
          CodeMarket
        </h1>

        {/* Subtitle */}
        <p className="text-blue-200 mt-2 text-lg drop-shadow-md">
          Buy & Sell Coding Services
        </p>

        {/* Loading Dots */}
        <div className="flex gap-2 mt-8">
          <span className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce"></span>
          <span className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce delay-150"></span>
          <span className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce delay-300"></span>
          <span className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce delay-450"></span>
        </div>

      </div>

    </div>
  );
}
