"use client";

import React, { useState } from "react";

export default function PasswordManagement() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailSubmit = async () => {
    // Call API to send OTP
    const res = await fetch("/api/auth/otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (res.ok) setStep(2);
  };

  const handleOtpSubmit = async () => {
    // Call API to verify OTP
    const res = await fetch("/api/auth/otp/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });
    if (res.ok) setStep(3);
  };

  const handlePasswordSubmit = async () => {
    // Call API to update password
    const res = await fetch("/api/auth/password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) alert("Password updated successfully");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-yellow-200 to-violet-400">
      <div className="p-8 rounded-2xl w-96 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Reset Your Password</h2>
        <p className="text-gray-600 mt-2">
          Enter your email and the OTP you received to reset your password. Make sure to choose a strong password.
        </p>
  
        <div className="flex flex-col items-center gap-4 mt-6">
          {step === 1 && (
            <div className="w-full">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
              <button
                onClick={handleEmailSubmit}
                className="w-full mt-3 bg-yellow-400 text-white font-semibold p-3 rounded-lg hover:bg-yellow-600 transition"
              >
                Send OTP
              </button>
            </div>
          )}
  
          {step === 2 && (
            <div className="w-full">
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
              <button
                onClick={handleOtpSubmit}
                className="w-full mt-3 bg-yellow-500 text-white font-semibold p-3 rounded-lg hover:bg-yellow-600 transition"
              >
                Verify OTP
              </button>
            </div>
          )}
  
          {step === 3 && (
            <div className="w-full">
              <input
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
              <button
                onClick={handlePasswordSubmit}
                className="w-full mt-3 bg-green-500 text-white font-semibold p-3 rounded-lg hover:bg-green-600 transition"
              >
                Update Password
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}  