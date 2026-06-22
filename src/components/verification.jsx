import React, { useState, useRef, useEffect } from "react";
import { ShieldCheck, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function VerifyLoginOTP() {
  const navigate = useNavigate();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(60);

  const inputs = useRef([]);

  const email = localStorage.getItem("pendingEmail");

  useEffect(() => {
    if (!email) {
      navigate("/login");
    }
  }, [email, navigate]);

  // Countdown Timer
  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (value, index) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const handleVerify = async () => {
    setError("");

    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      setError("Please enter the complete OTP.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        "https://movie-nova-5.onrender.com/auth/verify-login-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            otp: otpCode,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Verification failed");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role || "buyer");

      localStorage.removeItem("pendingEmail");

      navigate("/home");

    } catch (err) {
      console.error(err);
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setTimer(60);

      await fetch(
        "https://movie-nova-5.onrender.com/auth/send-login-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-6">

      <div className="bg-white w-full max-w-md rounded-3xl shadow-xl p-8">

        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-500 mb-6 hover:text-gray-700"
        >
          <ArrowLeft size={30} className="mr-2" />
        </button>

        <div className="flex justify-center mb-6">
          <div className="bg-blue-100 p-5 rounded-full">
            <ShieldCheck className="text-blue-600" size={42} />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center text-gray-800">
          Verify Your Account
        </h1>

        <p className="text-center text-gray-500 mt-3 mb-8">
          Enter the 6-digit code sent to
          <br />
          <span className="font-semibold text-gray-700">
            {email}
          </span>
        </p>

        <div className="flex justify-center gap-3 mb-8">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputs.current[index] = el)}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) =>
                handleChange(e.target.value, index)
              }
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-7 h-8 border-2 rounded-xl text-center text-2xl font-bold focus:outline-none focus:border-blue-600"
            />
          ))}
        </div>

        {error && (
          <p className="text-red-500 text-center mb-5">
            {error}
          </p>
        )}

        <button
          onClick={handleVerify}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-semibold transition-all"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        <div className="text-center mt-6">
          {timer > 0 ? (
            <p className="text-gray-500">
              Resend code in
              <span className="font-semibold text-blue-600">
                {" "}00:{String(timer).padStart(2, "0")}
              </span>
            </p>
          ) : (
            <button
              onClick={handleResend}
              className="text-blue-600 font-semibold hover:underline"
            >
              Resend OTP
            </button>
          )}
        </div>

      </div>
    </div>
  );
      }
