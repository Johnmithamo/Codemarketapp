import React, { useState } from "react";
import { ArrowLeft, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./style.css";

export default function OtpPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSendOtp = async () => {
    setError("");

    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }

    setLoading(true);

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
        setError(data.error || "Failed to send OTP");
        return;
      }

      // Save email for reset verification page
      localStorage.setItem("resetEmail", email);

      navigate("/verify-reset-otp");

    } catch (err) {
      console.error(err);
      setError("Server error or server waking up...");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">

      {/* Background Image */}
      <img
        src="https://res.cloudinary.com/dvvl4i8q9/image/upload/v1773550793/Gemini_Generated_Image_e31p3de31p3de31p_krob6i.png"
        alt="background"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">

        {/* Back Button */}
        <div className="p-6">
          <button
            onClick={() => navigate(-1)}
            className="text-white hover:opacity-80 transition"
          >
            <ArrowLeft size={28} />
          </button>
        </div>

        {/* Main Card */}
        <div className="flex-1 flex items-center justify-center px-6">

          <div className="w-full max-w-md">

            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">

              {/* Icon */}
              <div className="w-20 h-20 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-6">
                <Mail className="text-white" size={36} />
              </div>

              {/* Title */}
              <h1 className="text-3xl font-bold text-white text-center mb-3">
                Reset Password
              </h1>

              <p className="text-gray-300 text-center mb-8">
                Enter your email address and we'll send you a verification code.
              </p>

              {/* Email Input */}
              <div className="relative mb-5">

                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
                  size={20}
                />

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="
                    w-full
                    h-14
                    pl-12
                    pr-4
                    rounded-xl
                    bg-white/10
                    text-white
                    placeholder-gray-300
                    border border-white/20
                    focus:outline-none
                    focus:ring-2
                    focus:ring-blue-500
                  "
                />
              </div>

              {/* Error */}
              {error && (
                <p className="text-red-400 text-center mb-4">
                  {error}
                </p>
              )}

              {/* Send Button */}
              <button
                onClick={handleSendOtp}
                disabled={loading}
                className="
                  w-full
                  h-14
                  rounded-xl
                  bg-gradient-to-r
                  from-blue-600
                  to-cyan-500
                  text-white
                  font-semibold
                  transition
                  hover:opacity-90
                  disabled:opacity-60
                  flex
                  items-center
                  justify-center
                "
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                    Sending OTP...
                  </>
                ) : (
                  "Send OTP"
                )}
              </button>

              {/* Footer */}
              <p className="text-center text-gray-300 mt-6 text-sm">
                Remember your password?{" "}
                <span
                  onClick={() => navigate("/login")}
                  className="text-cyan-400 cursor-pointer hover:underline"
                >
                  Sign In
                </span>
              </p>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
