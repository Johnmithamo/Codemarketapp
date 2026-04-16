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

  // Updated nav items: use 'path' for internal pages, 'url' for external links
  const navItems = [
    { label: "Home", icon: <Home size={20} className="text-blue-500" />, path: "/home" },
    { label: "Settings", icon: <Settings size={20} className="text-green-500" />, path: "/settings" },
    { label: "Privacy Policy", icon: <Shield size={20} className="text-purple-500" />, path: "/policy" },
    { label: "Terms & Conditions", icon: <FileText size={20} className="text-yellow-500" />, path: "/terms" },
    { label: "Profile", icon: <User size={20} className="text-pink-500" />, path: "/profile" },
    { label: "About", icon: <Info size={20} className="text-cyan-500" />, path: "/about" },
  ];

  const handleClick = (item) => {
    onClose(); // close sidebar first

    if (item.url) {
      window.open(item.url, "_blank"); // open external link
    } else if (item.path) {
      navigate(item.path); // navigate internally
    }
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-white shadow-xl z-50 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } w-64 max-w-[70%]`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Menu</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <X size={20} />
          </button>
        </div>

        <nav className="flex flex-col mt-4">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleClick(item)}
              className="flex items-center gap-3 px-6 py-3 hover:bg-gray-100 transition-colors rounded-md text-gray-700 font-medium"
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