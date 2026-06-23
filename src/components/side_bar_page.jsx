import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Settings,
  Shield,
  FileText,
  Info,
  Home,
  User,
  X
} from "lucide-react";

export default function SideNav({ isOpen, onClose }) {
  const navigate = useNavigate();

  // Get user role from localStorage
  const role = localStorage.getItem("role");

  const navItems = [
    {
      label: "Home",
      icon: <Home size={20} className="text-blue-500" />,
      path: "/home",
    },
    {
      label: "Settings",
      icon: <Settings size={20} className="text-green-500" />,
      path: "/settings",
    },
    {
      label: "Privacy Policy",
      icon: <Shield size={20} className="text-purple-500" />,
      path: "/policy",
    },
    {
      label: "Terms & Conditions",
      icon: <FileText size={20} className="text-yellow-500" />,
      path: "/terms",
    },
    {
      label: "Profile",
      icon: <User size={20} className="text-pink-500" />,
      path: role === "seller"
        ? "/seller-profile"
        : "/buyer-profile",
    },
    {
      label: "About",
      icon: <Info size={20} className="text-cyan-500" />,
      path: "/about",
    },
  ];

  const handleClick = (item) => {
    // Close sidebar first
    onClose();

    // Open external links if they exist
    if (item.url) {
      window.open(item.url, "_blank");
      return;
    }

    // Navigate internally
    if (item.path) {
      navigate(item.path);
    }
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-white shadow-xl z-50 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } w-64 max-w-[75%]`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            Menu
          </h2>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <X size={22} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col mt-4">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleClick(item)}
              className="
                flex items-center gap-4
                px-6 py-4
                text-gray-700 font-medium
                hover:bg-gray-100
                transition-all
              "
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </>
  );
}
