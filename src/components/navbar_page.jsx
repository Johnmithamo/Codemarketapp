import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Home from "./home_screen";
import Profile from "./profile_page";
import Profile1 from "./profile_page1"; // buyer profile
import Messages from "./messages_page";
import Seller from "./seller_seller_page";
import Favorites from "./favorite_page"; // buyer page
import { useTourRegister } from "./tour_context";
import "./style.css";

import {
  Home as HomeIcon,
  Briefcase,
  Heart,
  MessageCircle,
  User,
} from "lucide-react";

export default function HomePage() {
  const [activeNav, setActiveNav] = useState("Home");
  const [role, setRole] = useState("");
  const location = useLocation();
  // Set when another page (e.g. "Chat" on a seller's profile) hands off a
  // specific chat to open — see buyer_seller_page.jsx's handleStartChat.
  const [pendingChat, setPendingChat] = useState(location.state?.openChat || null);

  // ✅ Let the app-wide tour switch tabs on our behalf
  useTourRegister("shell", setActiveNav);

  // If we arrived here with a chat to open, jump straight to Messages.
  useEffect(() => {
    if (location.state?.openChat) {
      setPendingChat(location.state.openChat);
      setActiveNav("Messages");
    }
  }, [location.state]);

  // ✅ Get role from localStorage
  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole || "buyer");
  }, []);

  // ✅ Dynamic nav items
  const navItems = [
    { name: "Home", icon: HomeIcon },

    role === "seller"
      ? { name: "Services", icon: Briefcase }
      : { name: "Favorites", icon: Heart },

    { name: "Messages", icon: MessageCircle },

    { name: "Profile", icon: User },
  ];

  // Guided tour steps now live in tour_steps.js and are driven globally
  // via the TourProvider/TourOverlay mounted once in App.jsx.

  return (
    <div className="h-[100dvh] flex flex-col bg-gray-100">
      {/* ===== PAGE CONTENT ===== */}
      <div className="flex-1 overflow-hidden">
        {activeNav === "Home" && <Home />}

        {activeNav === "Messages" && (
          <Messages initialChat={pendingChat} onInitialChatConsumed={() => setPendingChat(null)} />
        )}

        {/* Seller OR Favorites */}
        {activeNav === "Services" && role === "seller" && <Seller />}
        {activeNav === "Favorites" && role === "buyer" && <Favorites />}

        {/* Profile switching */}
        {activeNav === "Profile" && role === "seller" && <Profile />}
        {activeNav === "Profile" && role === "buyer" && <Profile1 />}
      </div>

      {/* ===== BOTTOM NAV ===== */}
      <div className="bg-white py-3 shadow-lg flex justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.name}
              data-tour-id={item.name}
              onClick={() => setActiveNav(item.name)}
              className={`flex flex-col items-center transition ${
                activeNav === item.name
                  ? "text-blue-600"
                  : "text-gray-400"
              }`}
            >
              <Icon size={22} />
              <span className="text-xs mt-1">{item.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}