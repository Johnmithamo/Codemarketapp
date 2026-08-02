import React, { useState, useEffect, useRef } from "react";
import SideNav from "./side_bar_page"; // adjust path
import "./style.css";
import { useNavigate } from "react-router-dom";
import { useTourRegister } from "./tour_context";
import { useToast } from "./toast_context";
import {
  Menu,
  Bell,
  Settings,
  Home,
  LayoutGrid,
  MessageCircle,
  User,
  Search,
  Heart,
  Star,
  Clock,
  Tag,
  ShieldCheck,
  ArrowUpDown,
} from "lucide-react";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "trending", label: "Trending" },
  { value: "rating", label: "Top Rated" },
  { value: "popular", label: "Most Ordered" },
  { value: "favorites", label: "Most Favorited" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
];

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("All");
  const [activeNav, setActiveNav] = useState("Home");
  const [services, setServices] = useState([]);
  const [topServices, setTopServices] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { toast } = useToast();
  useTourRegister("sidebar", setIsSidebarOpen);
  const scrollRef = useRef(null);
  const toggleFavorite = async (serviceId) => {
  try {
    const res = await fetch(
      "https://movie-nova-5.onrender.com/favorites/toggle",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ serviceId })
      }
    );

    const data = await res.json();

    if (!res.ok) {
      toast(data.error || "Couldn't update favorites", "error");
      return;
    }

    const nowFavorited = data.favorites.map(String).includes(String(serviceId));
    setFavorites(data.favorites.map(String)); // 🔥 FORCE STRING
    toast(nowFavorited ? "Added to favorites" : "Removed from favorites");
  } catch (err) {
    console.log(err);
    toast("Couldn't update favorites", "error");
  }
};
const rateService = async (serviceId, rating) => {
  try {
    const res = await fetch(
      `https://movie-nova-5.onrender.com/services/${serviceId}/rate`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ rating })
      }
    );

    const data = await res.json();

    if (!res.ok) {
      toast(data.error || "Couldn't submit rating", "error");
      return;
    }

    toast("Thanks for rating this service!");
    fetchServices(activeTab, search, sort); // ✅ refresh AFTER backend success
  } catch (err) {
    console.log(err);
    toast("Couldn't submit rating", "error");
  }
};
  const fetchServices = async (tab = activeTab, query = "", sortValue = sort) => {
    try {
        let url = `https://movie-nova-5.onrender.com/services?category=${tab}&sort=${sortValue}`;

        if (query) {
            url += `&search=${query}`;
        }
        const res = await fetch(url);
        const data = await res.json();

        const formatted = (data.services || []).map((item) => ({
            id: item._id || item.id,// serviceId
            userId: item.userId,   // ✅ ADD THIS
            title: item.title,
            price: item.price,
            image: item.image || "https://via.placeholder.com/150",
            seller: item.userId?.username || "Unknown",
            avatar: item.userId?.profilePic || "https://via.placeholder.com/50",
            rating: item.rating ? Number(item.rating).toFixed(1) : "New",
            description: item.description || "",
            category: item.category || "General",
            reviewCount: item.reviewCount ?? null,
            deliveryDays: item.deliveryDays ?? null,
            supportDays: item.supportDays ?? null,
            favoritesCount: item.favoritesCount ?? null,
        }));

        setServices(formatted);
        setLoading(false);
    } catch (error) {
        console.log(error);
        setLoading(false);
    }
 };
 // Powers the "Top Services" carousel — ranked by rating + favorites +
 // order count (see backend's trending sort), not just whatever the main
 // list happens to be sorted by right now.
 const fetchTopServices = async () => {
    try {
        const res = await fetch("https://movie-nova-5.onrender.com/services/top");
        const data = await res.json();
        const formatted = (data.services || []).map((item) => ({
            id: item._id || item.id,
            title: item.title,
            price: item.price,
            image: item.image || "https://via.placeholder.com/150",
            seller: item.userId?.username || "Unknown",
            rating: item.rating ? Number(item.rating).toFixed(1) : "New",
        }));
        setTopServices(formatted);
    } catch (error) {
        console.log(error);
    }
 };
 useEffect(() => {
    fetchTopServices();
 }, []);
 useEffect(() => {
    setLoading(true);
    fetchServices(activeTab, search, sort);
 }, [activeTab, sort]);
 useEffect(() => {
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const container = scrollRef.current;

        if (
          container.scrollLeft + container.clientWidth >=
          container.scrollWidth
        ) {
          container.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          container.scrollBy({ left: 270, behavior: "smooth" });
        }
      }
    }, 3000);
    return () => clearInterval(interval);
 }, []);
 useEffect(() => {
  const loadFavorites = async () => {
    try {
      const res = await fetch("https://movie-nova-5.onrender.com/favorites", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      const data = await res.json();
      setFavorites(data.favorites || []);
    } catch (err) {
      console.log(err);
    }
  };

  loadFavorites();
}, []);
const tabs = ["All", "Web", "App", "AI", "Data"];
const navigate = useNavigate();
  return (
    <div className="h-screen bg-[#F4F6F9] flex flex-col max-w-[430px] mx-auto overflow-hidden">
      {/* SIDEBAR */}
      <SideNav
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      {/* ===== HEADER ===== */}
      <div className="bg-white px-6 pt-8 pb-5 shadow-sm rounded-b-3xl">
        <div className="flex justify-between items-center">
          <button data-tour-id="home-menu" onClick={() => setIsSidebarOpen(true)}>
            <Menu size={22} />
          </button>

          <div className="flex items-center gap-2">
            <img
              src="https://res.cloudinary.com/dvvl4i8q9/image/upload/v1772129188/piggybank-HE75OJUXOFE-unsplash_q3meen.jpg"
              alt="Logo"
              className="w-6 h-6 object-contain"
            />
            <h1 className="text-[18px] font-semibold">
              CodeMarket
            </h1>
          </div>

          <button className="relative" onClick={() => navigate("/notifications")}>
            <Bell size={22} />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </div>

        <div className="mt-5 flex gap-2">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-4 top-3 text-gray-400"
            />
            <input
              type="text"
              data-tour-id="home-search"
              placeholder="Search Services..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setLoading(true);
                  fetchServices(activeTab, search, sort);
                }
              }}
              className="w-full h-12 pl-10 pr-4 bg-[#F1F3F6] rounded-xl text-sm focus:outline-none"
            />
          </div>

          <div className="relative">
            <button
              onClick={() => setShowSortMenu((v) => !v)}
              className="h-12 px-3 bg-[#F1F3F6] rounded-xl flex items-center gap-1 text-sm text-gray-600"
            >
              <ArrowUpDown size={16} />
            </button>
            {showSortMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowSortMenu(false)} />
                <div className="absolute right-0 top-14 z-20 bg-white rounded-xl shadow-lg py-2 w-48">
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setSort(opt.value);
                        setShowSortMenu(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm ${
                        sort === opt.value ? "text-blue-600 font-semibold" : "text-gray-700"
                      } hover:bg-gray-50`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ===== SCROLLABLE AREA ===== */}
      <div className="flex-1 overflow-y-auto">

        {/* ===== TABS ===== */}
        <div className="px-6 mt-5 flex gap-3 overflow-x-auto" data-tour-id="home-tabs">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition ${
                activeTab === tab
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-500"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ===== CAROUSEL ===== */}
        <div className="px-6 mt-6">
          <h2 className="text-sm font-semibold mb-4">
            Top Services
          </h2>

          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scroll-smooth"
          >
            {topServices.map((item) => (
              <div
                key={item.id}
                className="min-w-[260px] bg-white rounded-2xl p-4 shadow-md"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-24 w-full rounded-xl object-cover"
                />

                <h3 className="mt-3 text-sm font-semibold">
                  {item.title}
                </h3>

                <p className="text-blue-600 font-bold">
                  ${item.price}
                </p>

                <p className="text-xs text-gray-500">
                  {item.seller} • ⭐ {item.rating}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ===== SERVICE LIST ===== */}
 
        <div className="px-6 mt-6 space-y-5 pb-6">
            {loading ? (
                <div className="flex justify-center items-center mt-10 gap-2">
                    <span className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce"></span>
                    <span className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce delay-150"></span>
                    <span className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce delay-300"></span>
                    <span className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce delay-450"></span>
                </div>
            ) : (
                services.map((service, index) => (
                    <div
                        key={service.id}
                        onClick={() => {
                            if (service.userId?._id) {
                                navigate(`/buyer/${service.userId._id}`);
                            }
                        }}// seller page
                        className="bg-white rounded-3xl p-4 shadow-sm cursor-pointer"
                    >
                        {/* TOP ROW */}
                        <div className="flex gap-4 relative">
                            <img
                                src={service.image}
                                alt={service.title}
                                className="w-24 h-[7.5rem] rounded-2xl object-cover flex-shrink-0"
                            />

                            <div className="flex-1 min-w-0 pr-10">
                                <h2 className="text-base font-bold text-gray-900 truncate">
                                    {service.title}
                                </h2>

                                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                    {service.description || "No description provided yet"}
                                </p>

                                <div className="flex items-center gap-2 mt-2">
                                    <p className="text-blue-600 font-bold text-lg">
                                        ${Number(service.price).toLocaleString()}
                                    </p>

                                    <div className="flex items-center gap-0.5">
                                        {[1,2,3,4,5].map((star) => {
                                            const numericRating = Number(service.rating) || 0;
                                            const filled = star <= Math.round(numericRating);
                                            return (
                                                <Star
                                                    key={star}
                                                    size={13}
                                                    className={
                                                        filled
                                                            ? "cursor-pointer text-yellow-400 fill-yellow-400"
                                                            : "cursor-pointer text-gray-300 fill-gray-300"
                                                    }
                                                    onClick={async (e) => {
                                                        e.stopPropagation();
                                                        if (!service.id) return;

                                                        await rateService(service.id, star);
                                                    }}
                                                />
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* SELLER ROW */}
                                <div className="flex items-center gap-0.5 mt-0.5 flex-wrap">
                                    <img
                                        src={service.avatar}
                                        alt={service.seller}
                                        className="w-6 h-6 rounded-full object-cover"
                                    />
                                    <span className="text-xs text-gray-800 truncate">{service.seller}</span>
                                    <span className="text-gray-300">•</span>
                                    <Star size={13} className="text-yellow-400 fill-yellow-400" />
                                    <span className="text-xs text-gray-800">{service.rating}</span>
                                    <span className="text-xs text-gray-400">
                                        ({service.reviewCount != null ? `${service.reviewCount} reviews` : "No reviews yet"})
                                    </span>
                                </div>
                            </div>

                            <div
                                data-tour-id={index === 0 ? "home-fav-0" : undefined}
                                className="absolute top-0 right-0 cursor-pointer bg-white rounded-xl w-9 h-9 flex items-center justify-center shadow"
                                onClick={async (e) => {
                                    e.stopPropagation();
                                    if (!service.id) return;

                                    await toggleFavorite(service.id);
                                }}
                            >
                                <Heart
                                    size={18}
                                    className={
                                        favorites.map(String).includes(String(service.id))
                                            ? "text-red-500 fill-red-500"
                                            : "text-gray-300"
                                    }
                                />
                            </div>
                        </div>

                        {/* FOOTER STRIP */}
                        <div className="flex justify-between mt-4 pt-4 border-t border-gray-100">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                                    <Clock size={15} className="text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-800">Delivery</p>
                                    <p className="text-xs text-gray-400">
                                        {service.deliveryDays != null ? `${service.deliveryDays} days` : "Not specified"}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                                    <Tag size={15} className="text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-800">Category</p>
                                    <p className="text-xs text-gray-400">{service.category || "Not specified"}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                                    <ShieldCheck size={15} className="text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-800">Support</p>
                                    <p className="text-xs text-gray-400">
                                        {service.supportDays != null ? `${service.supportDays} days` : "Not specified"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
      </div>
    </div>
  );
}