"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { BsRobot } from "react-icons/bs";
import API_ROUTES from "./constants/constants";
import { ToastContainer, toast } from "react-toastify";
import { decodeToken } from "./util/token";
import Link from "next/link";

export default function Home() {
  const router = useRouter();
  const [isSignup, setIsSignup] = useState(true);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem("auth_token");

    if (token) {
      const decoded = decodeToken(token);
      console.log("Decoded Token:", decoded);

      if (decoded) {
        router.push("/components/dashboard");
      } else {
        console.warn("Token is expired or invalid. Staying on login page.");
        sessionStorage.removeItem("auth_token");
      }
    }
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = isSignup
        ? API_ROUTES.USER_MANAGEMENT.SIGNUP
        : API_ROUTES.AUTH_LOGIN.LOGIN;

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          isSignup
            ? {
                fullName: formData.fullName,
                email: formData.email,
                password: formData.password,
              }
            : {
                email: formData.email,
                password: formData.password,
              }
        ),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Something went wrong");
      }

      if (!isSignup) {
        sessionStorage.setItem("auth_token", result.token);
        setTimeout(() => router.push("/components/dashboard"), 1000);
      } else {
        toast.success("Signup successful! Please log in.");
      }

      setFormData({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-violet-600 lg:bg-gradient-to-r from-yellow-500 to-violet-600">
      <nav className="w-full bg-transparent py-4 px-6 lg:px-16 flex justify-between items-center border-b border-white/20">
        <div className="flex items-center space-x-3">
          <BsRobot className="text-white text-3xl" />
          <h1 className="text-white text-2xl font-bold">JobSync</h1>
        </div>
      </nav>

      <div className="flex flex-col lg:flex-row items-center justify-center flex-grow w-full max-w-7xl mx-auto p-6">
        <motion.div
          className="hidden lg:flex flex-col items-start text-left space-y-6 w-1/2 pr-12"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <BsRobot className="text-white text-8xl" />
          <h1 className="text-white font-extrabold text-4xl lg:text-5xl leading-tight">
            Your Dream Job, <br className="hidden lg:block" /> Just a Click
            Away!
          </h1>
          <p className="text-white text-lg lg:text-xl opacity-90">
            Get AI-powered job recommendations tailored just for you.
          </p>
        </motion.div>

        <motion.div
          className="flex items-center justify-center w-full lg:w-1/2"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="p-8 w-full max-w-lg bg-white/10 border border-white/20 backdrop-blur-lg">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-semibold text-white">
                {isSignup ? "Sign Up" : "Login"}
              </h2>
              <button
                className="px-4 py-2 text-sm font-medium text-white border border-white/50 rounded-full hover:bg-white hover:text-violet-600 transition"
                onClick={() => setIsSignup(!isSignup)}
              >
                {isSignup ? "Switch to Login" : "Switch to Signup"}
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {isSignup && (
                <div>
                  <label className="block text-white font-medium mb-2">
                    Full Name
                  </label>
                  <input
                    required
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-white/30 bg-white/10 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400 placeholder-white/70"
                    placeholder="Enter your full name"
                  />
                </div>
              )}

              <div>
                <label className="block text-white font-medium mb-2">
                  Email
                </label>
                <input
                  required
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-white/30 bg-white/10 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400 placeholder-white/70"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">
                  Password
                </label>
                <input
                  required
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-white/30 bg-white/10 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400 placeholder-white/70"
                  placeholder="Enter your password"
                />
              </div>

              {isSignup && (
                <div>
                  <label className="block text-white font-medium mb-2">
                    Confirm Password
                  </label>
                  <input
                    required
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-white/30 bg-white/10 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400 placeholder-white/70"
                    placeholder="Confirm your password"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full px-5 py-3 bg-white text-violet-500 font-semibold rounded-full shadow-md hover:bg-violet-600 hover:text-white transition duration-300"
              >
                {loading
                  ? "Processing..."
                  : isSignup
                  ? "Create Account"
                  : "Login"}
              </button>

              <Link href="/password">
              <p className="text-pretty text-white py-2 text-center text-lg"> Reset password or Forgot password</p>
              </Link>
              
            </form>
          </div>
        </motion.div>
      </div>

      <ToastContainer />
    </div>
  );
}
