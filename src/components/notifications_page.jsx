import React, { useEffect, useState } from "react";
import { ArrowLeft, Bell, Package, MessageCircle, Star, DollarSign, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "./toast_context";

const API = "https://movie-nova-5.onrender.com";

const ICONS = {
  order: Package,
  payment: DollarSign,
  message: MessageCircle,
  review: Star,
  system: Info,
};

export default function NotificationsPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const res = await fetch(`${API}/notifications`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      setNotifications(data.notifications || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const markRead = async (id) => {
    setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, read: true } : n)));
    try {
      await fetch(`${API}/notifications/${id}/read`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
    } catch (err) {
      console.log(err);
    }
  };

  const markAllRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      await fetch(`${API}/notifications/read-all`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast("All notifications marked as read");
    } catch (err) {
      console.log(err);
    }
  };

  const handleClick = (n) => {
    if (!n.read) markRead(n._id);
    if (n.link) {
      // Chat/order deep-links point at app routes that don't all exist yet
      // (e.g. a dedicated /orders/:id page) — falling back to /home keeps
      // this from being a dead click either way.
      if (n.link.startsWith("/chats/")) navigate("/home");
      else navigate("/home");
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="h-screen bg-gray-100 flex flex-col">
      <div className="sticky top-0 bg-white px-4 py-3 shadow-sm z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ArrowLeft onClick={() => navigate(-1)} className="cursor-pointer" size={20} />
          <h2 className="text-lg font-semibold">Notifications</h2>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="text-xs text-blue-600 font-medium">
            Mark all read
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {loading ? (
          <div className="flex justify-center items-center mt-10 gap-2">
            <span className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce"></span>
            <span className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce delay-150"></span>
            <span className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce delay-300"></span>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <Bell size={40} className="text-gray-300 mb-3" />
            <h3 className="font-semibold text-gray-700">No notifications yet</h3>
            <p className="text-sm text-gray-400 mt-1">
              Orders, messages, and reviews will show up here.
            </p>
          </div>
        ) : (
          notifications.map((n) => {
            const Icon = ICONS[n.type] || Info;
            return (
              <div
                key={n._id}
                onClick={() => handleClick(n)}
                className={`flex items-start gap-3 p-3 rounded-2xl shadow-sm cursor-pointer ${
                  n.read ? "bg-white" : "bg-blue-50"
                }`}
              >
                <div className="bg-blue-100 text-blue-600 p-2 rounded-lg flex-shrink-0">
                  <Icon size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800">{n.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{n.message}</p>
                  <p className="text-[11px] text-gray-400 mt-1">
                    {new Date(n.createdAt).toLocaleString()}
                  </p>
                </div>
                {!n.read && <span className="w-2 h-2 rounded-full bg-blue-500 mt-1 flex-shrink-0" />}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
