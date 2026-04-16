import { ArrowLeft, Bell, LayoutGrid, Briefcase } from "lucide-react";
import React, { useState, useEffect } from "react";
import axios from "axios";

export default function SellerDashboard() {
  const [page, setPage] = useState("dashboard");	
  const [services, setServices] = useState([]);
  const [profile, setProfile] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [orders, setOrders] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const toggleStatus = async (id) => {
  const service = services.find(s => s.id === id);
  try {
    await axios.put(`https://movie-nova-3.onrender.com/user/services/${id}`, {
      active: !service.active
    }, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });
    setServices(prev =>
      prev.map(s => s.id === id ? { ...s, active: !s.active } : s)
    );
  } catch (err) {
    console.error(err);
  }
};
  useEffect(() => {
  const token = localStorage.getItem("token"); // your auth token
  if (!token) return;
  const headers = { Authorization: `Bearer ${token}` };
  
  axios.get("https://movie-nova-3.onrender.com/profile", { headers })
  .then(res => {
    console.log("PROFILE:", res.data); // 🔥 IMPORTANT
    setProfile(res.data.profile);
  })
  .catch(err => console.error("PROFILE ERROR:", err));
  // Fetch services
  axios.get("https://movie-nova-3.onrender.com/my/services", { headers })
  .then(res => setServices(res.data.services.map(s => ({
    id: s._id,
    title: s.title,
    price: s.price,
    orders: s.orders,
    active: s.active
  }))))
  .catch(err => console.error(err));
  // Fetch orders
  axios.get("https://movie-nova-3.onrender.com/user/orders", {
    headers: { Authorization: `Bearer ${token}` }
  })
  .then(res => setOrders(res.data))
  .catch(err => console.error(err));

  // Fetch transactions
  axios.get("https://movie-nova-3.onrender.com/user/transactions", {
    headers: { Authorization: `Bearer ${token}` }
  })
  .then(res => setTransactions(res.data))
  .catch(err => console.error(err));

  // Fetch reviews
  axios.get("https://movie-nova-3.onrender.com/user/reviews", {
    headers: { Authorization: `Bearer ${token}` }
  })
  .then(res => setReviews(res.data))
  .catch(err => console.error(err))
  .finally(() => setLoading(false)); // ✅ 
  
}, []); // empty dependency array = run once on mount
 
  return (
    <div className="h-screen w-full max-w-[430px] mx-auto bg-[#0B1220] text-white flex flex-col">

      {/* HEADER */}
      <div className="relative px-5 pt-10 pb-7 rounded-b-[28px] bg-gradient-to-br from-[#0B1220] via-[#0F172A] to-[#1E293B] shadow-lg">
        <div className="flex justify-between items-center">
          <button className="bg-white/10 backdrop-blur-md p-2 rounded-full">
            <ArrowLeft size={18} />
          </button>
          <div className="relative">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-6">
          <img
            src={profile?.photoUrl || "https://i.pravatar.cc/150"}
            className="w-16 h-16 rounded-full border border-white/30"
          />
          <div>
            <h1 className="text-xl font-semibold ">Welcome,</h1>
            <h2 className="text-xl font-semibold leading-none">
              {profile?.fullName || "User"}
            </h2>
          </div>
        </div>

        <div className="mt-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex justify-between h-32">
          <div>
            <p className="text-base text-gray-400">Total Sales</p>
            <h3 className="text-4xl font-semibold mt-1">
                ${transactions.reduce((sum, t) => sum + (t.amount || 0), 0) || "0"}
            </h3>
          </div>
          <div className="w-px bg-white/10 mx-4"></div>
          <div>
            <p className="text-base text-gray-400">Orders</p>
            <h3 className="text-4xl font-semibold mt-1 text-green-400">
                {orders.length || "0"}
            </h3>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex-1 px-5 pt-6 space-y-4 bg-[#0B1220] overflow-y-auto">

        {page === "dashboard" && (
          <>
            {/* DASHBOARD CARDS */}
            <div
              onClick={() => setPage("services")}
              className="bg-[#111827] hover:bg-[#1A2333] transition rounded-2xl p-4 flex items-center justify-between shadow-md cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="bg-blue-500/10 p-2 rounded-lg">
                  <LayoutGrid size={18} className="text-blue-400" />
                </div>
                <span className="text-sm font-medium">My Services</span>
              </div>
              <span className="text-gray-400">›</span>
            </div>

            <div
              onClick={() => setPage("orders")}
              className="bg-[#111827] hover:bg-[#1A2333] transition rounded-2xl p-4 flex items-center justify-between shadow-md cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="bg-yellow-500/10 p-2 rounded-lg">
                  <Briefcase size={18} className="text-yellow-400" />
                </div>
                <span className="text-sm font-medium">Pending Orders</span>
              </div>
              <span className="text-gray-400">›</span>
            </div>

            <div
              onClick={() => setPage("earnings")}
              className="bg-[#111827] hover:bg-[#1A2333] transition rounded-2xl p-4 flex items-center justify-between shadow-md cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="bg-green-500/10 p-2 rounded-lg">💰</div>
                <span className="text-sm font-medium">Earnings</span>
              </div>
              <span className="text-gray-400">›</span>
            </div>

            <div
              onClick={() => setPage("reviews")}
              className="bg-[#111827] hover:bg-[#1A2333] transition rounded-2xl p-4 flex items-center justify-between shadow-md cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="bg-orange-500/10 p-2 rounded-lg">⭐</div>
                <span className="text-sm font-medium">Reviews</span>
              </div>
              <span className="text-gray-400">›</span>
            </div>
          </>
        )}

        {page === "services" && (
          <div>
            <button onClick={() => setPage("dashboard")} className="bg-white/10 backdrop-blur-md p-2 rounded-full">
                <ArrowLeft size={18} />
            </button>
            <h1 className="text-xl font-semibold mb-4">My Services</h1>
            {services.map((service) => (
              <div key={service.id} className="bg-[#111827] p-4 rounded-xl mb-4">
                <h2 className="font-medium">{service.title}</h2>
                <p className="text-sm text-gray-400">${service.price} • {service.orders} orders</p>
                <div className="flex justify-between mt-3">
                  <button
                    onClick={() => toggleStatus(service.id)}
                    className={`px-3 py-1 rounded ${
                      service.active ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {service.active ? "Active" : "Paused"}
                  </button>
                  <button className="text-blue-400 text-sm">Edit</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {page === "orders" && (
          <div>
            <button onClick={() => setPage("dashboard")} className="bg-white/10 backdrop-blur-md p-2 rounded-full">
                <ArrowLeft size={18} />
            </button>
            <h1 className="text-xl font-semibold mb-4">Orders</h1>
            <pre className="text-xs text-green-400">
                {JSON.stringify(profile, null, 2)}
            </pre>
            {orders.map((order) => (
              <div key={order.id} className="bg-[#111827] p-4 rounded-xl mb-3 flex justify-between items-center">
                <div>
                  <h2>{order.client}</h2>
                  <p className="text-sm text-gray-400">{order.service}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${
                  order.status === "Completed" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"
                }`}>
                  {order.status}
                </span>
              </div>
            ))}
          </div>
        )}

        {page === "earnings" && (
          <div>
            <button onClick={() => setPage("dashboard")} className="bg-white/10 backdrop-blur-md p-2 rounded-full">
                <ArrowLeft size={18} />
            </button>
            <h1 className="text-xl font-semibold mb-4">Earnings</h1>
            <div className="bg-[#111827] p-4 rounded-xl mb-4">
              <h2>Total Balance</h2>
              <p className="text-2xl font-bold mt-1">$5,060</p>
            </div>
            {transactions.map((t) => (
              <div key={t.id} className="flex justify-between bg-[#111827] p-3 rounded-lg mb-2">
                <span>{t.date}</span>
                <span className="text-green-400">+${t.amount}</span>
              </div>
            ))}
          </div>
        )}

        {page === "reviews" && (
          <div>
            <button onClick={() => setPage("dashboard")} className="bg-white/10 backdrop-blur-md p-2 rounded-full">
                <ArrowLeft size={18} />
            </button>
            <h1 className="text-xl font-semibold mb-4">Reviews</h1>
            {reviews.map((r) => (
              <div key={r.id} className="bg-[#111827] p-4 rounded-xl mb-3">
                <h2>{r.name}</h2>
                <p className="text-yellow-400">{"⭐".repeat(r.rating)}</p>
                <p className="text-sm text-gray-400">{r.comment}</p>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}