import React, { useState, useEffect } from "react";
import { User, Bookmark, Activity, Settings, Star, ArrowLeft, Search, Bell, Moon, Lock, Globe } from "lucide-react";
const API = "https://movie-nova-3.onrender.com";

export default function BuyerProfilePage() {
  const [page, setPage] = useState("profile");
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetch(`${API}/profile`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setProfile(data.profile))
      .catch(() => setProfile(null));
  }, []);

  return (
    <div className="w-screen h-screen bg-[#f5f6fa] overflow-hidden">
      {page === "profile" && <MainProfile go={setPage} profile={profile} />}
      {page === "saved" && <Saved go={setPage} />}
      {page === "activity" && <ActivityPage go={setPage} />}
      {page === "settings" && <SettingsPage go={setPage} />}
      {page === "search" && <SearchPage go={setPage} />}
    </div>
  );
}

//////////////////////////////////////////////////
// 🔵 MAIN PROFILE
//////////////////////////////////////////////////
function MainProfile({ go, profile }) {
  return (
    <div className="relative h-full">
      <div className="bg-gradient-to-b from-[#0f172a] to-[#1e3a8a] h-44 relative">
        <ArrowLeft onClick={() => go("profile")} className="absolute left-4 top-5 text-white w-5 h-5 cursor-pointer" />
        <Search onClick={() => go("search")} className="absolute right-4 top-5 text-white w-5 h-5 cursor-pointer" />
        <h2 className="absolute top-5 left-1/2 -translate-x-1/2 text-white text-[15px] font-semibold py-10">
          My Profile
        </h2>
      </div>

      {/* PROFILE CARD */}
      <div className="absolute top-[110px] left-1/2 -translate-x-1/2 w-[90%] bg-white rounded-2xl p-5 text-center shadow-md py-10">
        <img
          src={profile?.photoUrl || "https://via.placeholder.com/100"}
          className="w-20 h-20 rounded-full border-[5px] border-white mx-auto -mt-16"
        />
        <h3 className="mt-2 text-sm font-semibold text-gray-800">{profile?.fullName || "No Name"}</h3>
        <p className="text-gray-400 text-xs">{profile?.skills || "No skills"}</p>

        {/* STATS */}
        <div className="flex justify-between mt-5 px-6">
          <Stat label="Projects" value="45" />
          <Stat label="Rating" value="4.8" star />
          <Stat label="Followers" value="1.2k" />
        </div>
      </div>

      {/* MENU */}
      <div className="mt-[150px] px-4 space-y-3 py-16">
        <MenuItem title="Saved Items" icon={<Bookmark size={18} />} onClick={() => go("saved")} />
        <MenuItem title="Activity" icon={<Activity size={18} />} onClick={() => go("activity")} />
        <MenuItem title="Settings" icon={<Settings size={18} />} onClick={() => go("settings")} />
      </div>
    </div>
  );
}

//////////////////////////////////////////////////
// 🟢 SAVED PAGE
//////////////////////////////////////////////////
function Saved({ go }) {
  return (
    <Page title="Saved Items" go={go}>
      <p className="text-gray-400 text-sm">No saved items yet.</p>
    </Page>
  );
}

//////////////////////////////////////////////////
// 🟡 ACTIVITY PAGE
//////////////////////////////////////////////////
function ActivityPage({ go }) {
  const logs = ["New follower", "Completed project", "Got review"];

  return (
    <Page title="Activity" go={go}>
      {logs.map((l, i) => (
        <div key={i} className="bg-white p-4 rounded-xl">
          {l}
        </div>
      ))}
    </Page>
  );
}

//////////////////////////////////////////////////
// 🔴 SETTINGS PAGE
//////////////////////////////////////////////////
function SettingsPage({ go }) {
  const [dark, setDark] = useState(false);
  const [notify, setNotify] = useState(true);

  return (
    <Page title="Settings" go={go}>
      <SettingItem icon={<Bell size={18} />} title="Notifications">
        <input type="checkbox" checked={notify} onChange={() => setNotify(!notify)} />
      </SettingItem>

      <SettingItem icon={<Moon size={18} />} title="Dark Mode">
        <input type="checkbox" checked={dark} onChange={() => setDark(!dark)} />
      </SettingItem>

      <SettingItem icon={<Lock size={18} />} title="Privacy">
        <button className="text-blue-500 text-sm">Manage</button>
      </SettingItem>

      <SettingItem icon={<Globe size={18} />} title="Language">
        <select className="border rounded px-2 py-1 text-sm">
          <option>English</option>
          <option>Swahili</option>
        </select>
      </SettingItem>
    </Page>
  );
}

//////////////////////////////////////////////////
// 🔍 SEARCH PAGE
//////////////////////////////////////////////////
function SearchPage({ go }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!query) return;
    fetch(`${API}/services/search?q=${query}`)
      .then((res) => res.json())
      .then((data) => setResults(data.services || []));
  }, [query]);

  return (
    <Page title="Search" go={go}>
      <input
        placeholder="Search..."
        className="w-full p-3 rounded-lg border outline-none"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {results.map((s) => (
        <div key={s._id} className="bg-white p-3 rounded-lg">
          {s.title}
        </div>
      ))}
    </Page>
  );
}

//////////////////////////////////////////////////
// 🔹 REUSABLE COMPONENTS
//////////////////////////////////////////////////
function Page({ title, children, go }) {
  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-3">
        <ArrowLeft onClick={() => go("profile")} className="cursor-pointer" />
        <h2 className="font-semibold">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function MenuItem({ icon, title, onClick }) {
  return (
    <div
      onClick={onClick}
      className="flex justify-between items-center bg-white px-4 py-3 rounded-xl cursor-pointer"
    >
      <div className="flex gap-3 items-center">
        <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">{icon}</div>
        <span className="text-sm font-medium">{title}</span>
      </div>
      <span className="text-gray-300">›</span>
    </div>
  );
}

function SettingItem({ icon, title, children }) {
  return (
    <div className="flex justify-between items-center bg-white p-4 rounded-xl">
      <div className="flex gap-3 items-center">
        {icon}
        <span>{title}</span>
      </div>
      {children}
    </div>
  );
}

function Stat({ label, value, star }) {
  return (
    <div className="text-center">
      <p className="text-sm font-semibold flex items-center justify-center gap-1">
        {value}
        {star && <Star size={13} className="text-yellow-400 fill-yellow-400" />}
      </p>
      <p className="text-[11px] text-gray-400">{label}</p>
    </div>
  );
}