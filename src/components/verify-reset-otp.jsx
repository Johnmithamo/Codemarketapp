import React, { useState, useRef, useEffect } from "react";
import { ShieldCheck, ArrowLeft, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function VerifyResetOTP() {
  const navigate = useNavigate();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);

  const inputs = useRef([]);

  const email = localStorage.getItem("resetEmail");

  useEffect(() => {
    if (!email) {
      navigate("/otp");
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

    const updatedOtp = [...otp];
    updatedOtp[index] = value.slice(-1);

    setOtp(updatedOtp);

    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleResetPassword = async () => {
    setError("");
    setSuccess("");

    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      setError("Please enter the complete OTP.");
      return;
    }

    if (!newPassword) {
      setError("Please enter a new password.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        "https://movie-nova-5.onrender.com/auth/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            otp: otpCode,
            newPassword,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to reset password");
        return;
      }

      setSuccess("Password reset successful!");

      localStorage.removeItem("resetEmail");

      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (err) {
      console.error(err);
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      const res = await fetch(
        "https://movie-nova-5.onrender.com/auth/send-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to resend OTP");
        return;
      }

      setTimer(60);
      setError("");

    } catch (err) {
      setError("Failed to resend OTP");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-6">

      <div className="bg-white w-full max-w-md rounded-3xl shadow-xl p-8">

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-500 mb-6 hover:text-gray-700"
        >
          <ArrowLeft size={20} />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-blue-100 p-5 rounded-full">
            <ShieldCheck className="text-blue-600" size={42} />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold text-center text-gray-800">
          Verify OTP
        </h1>

        <p className="text-center text-gray-500 mt-3 mb-8">
          Enter the OTP sent to
          <br />
          <span className="font-semibold text-gray-700">
            {email}
          </span>
        </p>

        {/* OTP Inputs */}
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
              onKeyDown={(e) =>
                handleKeyDown(e, index)
              }
              className="w-12 h-14 border-2 rounded-xl text-center text-2xl font-bold focus:outline-none focus:border-blue-600"
            />
          ))}
        </div>

        {/* New Password */}
        <div className="relative mb-6">
          <Lock
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />

          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full h-14 pl-12 pr-4 border rounded-xl outline-none focus:border-blue-600"
          />
        </div>

        {/* Messages */}
        {error && (
          <p className="text-red-500 text-center mb-4">
            {error}
          </p>
        )}

        {success && (
          <p className="text-green-500 text-center mb-4">
            {success}
          </p>
        )}

        {/* Submit Button */}
        <button
          onClick={handleResetPassword}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-semibold"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>

        {/* Resend OTP */}
        <div className="text-center mt-6">
          {timer > 0 ? (
            <p className="text-gray-500">
              Resend code in
              <span className="text-blue-600 font-semibold">
                {" "}00:{String(timer).padStart(2, "0")}
              </span>
            </p>
          ) : (
            <button
              onClick={handleResendOtp}
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
