"use client";

import React, { useState, useEffect } from "react";
import { JSX } from "react";
import { useRouter } from "next/navigation";
import { FiMenu, FiX, FiLogOut } from "react-icons/fi";
import { BsRobot } from "react-icons/bs";
import { FaBriefcase, FaUserCheck, FaUpload, FaUser } from "react-icons/fa";
import classNames from "classnames";
import { decodeToken } from "@/app/util/token";
import Jobs from "../job/page";
import JobSuggestions from "../recommendation/page";
import UploadResume from "../upload/page";

const NAV_ITEMS: {
  key: "jobs" | "recommended" | "upload" | "profile";
  label: string;
  icon: JSX.Element;
}[] = [
  { key: "jobs", label: "Jobs", icon: <FaBriefcase /> },
  { key: "recommended", label: "Recommended Jobs", icon: <FaUserCheck /> },
  { key: "upload", label: "Upload Resume", icon: <FaUpload /> },
];

export default function Navbar() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeComponent, setActiveComponent] = useState<
    "jobs" | "recommended" | "upload" | "profile"
  >("jobs");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = sessionStorage.getItem("auth_token");
      if (!token) {
        router.push("/");
        return;
      }
      const decoded = decodeToken(token);
      if (!decoded) {
        router.push("/");
      } else {
        setIsAuthenticated(true);
      }
    }
  }, [router]);

  const handleLogout = () => {
    sessionStorage.removeItem("auth_token");
    setIsAuthenticated(false);
    setActiveComponent("jobs");
    router.push("/");
  };

  return (
    <>
      {/* Navbar */}
      <nav className="bg-gradient-to-r from-violet-500 to-yellow-700 text-white px-6 py-6 text-xl shadow-lg">
        <div className="w-11/12 mx-auto flex justify-between items-center">
          {/* Logo */}
          <button
            onClick={() => setActiveComponent("jobs")}
            className="text-2xl font-bold flex items-center gap-3"
          >
            <BsRobot /> Job Sync
          </button>

          {/* Desktop Navigation */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center space-x-6">
              {NAV_ITEMS.map(({ key, label, icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveComponent(key)}
                  className={classNames(
                    "flex items-center gap-2 hover:text-yellow-300",
                    {
                      "text-yellow-300": activeComponent === key,
                    }
                  )}
                >
                  {icon} {label}
                </button>
              ))}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-inherit text-white px-2 py-1 rounded-lg hover:text-yellow-300"
              >
                <FiLogOut size={18} />
                Logout
              </button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white focus:outline-none"
          >
            {isMenuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && isAuthenticated && (
          <div className="md:hidden flex flex-col items-start bg-inherit text-white py-2 px-2">
            {NAV_ITEMS.map(({ key, label, icon }) => (
              <button
                key={key}
                onClick={() => {
                  setActiveComponent(key);
                  setIsMenuOpen(false);
                }}
                className="flex items-center gap-2 w-full text-left px-2 py-2 hover:bg-inherit"
              >
                {icon} {label}
              </button>
            ))}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-2 py-2 bg-inherit text-white rounded-lg transition hover:text-yellow-300"
            >
              <FiLogOut size={18} />
              Logout
            </button>
          </div>
        )}
      </nav>

      {/* Render Selected Component */}
      <div className="p-6 w-11/12 mx-auto">
        {activeComponent === "jobs" && <Jobs />}
        {activeComponent === "recommended" && <JobSuggestions />}
        {activeComponent === "upload" && <UploadResume />}
      </div>
    </>
  );
}
