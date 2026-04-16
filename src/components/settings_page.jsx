import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaUser, FaBell, FaCreditCard, FaLock, FaQuestionCircle, FaSignOutAlt } from "react-icons/fa";
import { ArrowLeft, ChevronRight } from "lucide-react";

/* =========================
   Main App
========================= */
export default function App() {
  const [loading, setLoading] = useState(false);	
  const [page, setPage] = useState("settings");
  const [profileData, setProfileData] = useState({ fullName: "", email: "", phone: "" });
  const goBack = () => setPage("settings");
  const [notificationsData, setNotificationsData] = useState({ email: false, push: false });
  const [paymentsData, setPaymentsData] = useState({ card: "**** **** **** 1234", transactions: [] });
  const [privacyData, setPrivacyData] = useState({ twoFA: false });
  const [helpData, setHelpData] = useState({ faq: [], contact: "", terms: "" });
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  useEffect(() => {
  const token = localStorage.getItem("token"); // or your auth method
  if (!token) return;

  if (page === "settings" || page === "profile") {
    axios.get("https://movie-nova-3.onrender.com/profile",  { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setProfileData(res.data.profile))
      .catch(err => console.error(err));
  }

  if (page === "notifications") {
    axios.get("https://movie-nova-3.onrender.com/user/notifications", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setNotificationsData(res.data))
      .catch(err => console.error(err));
  }

  if (page === "payments") {
  setLoading(true);

  axios.get("https://movie-nova-3.onrender.com/user/payments", {
    headers: { Authorization: `Bearer ${token}` }
  })
  .then(res => setPaymentsData(res.data))
  .catch(err => console.error(err))
  .finally(() => setLoading(false));
  }

  if (page === "privacy") {
    axios.get("https://movie-nova-3.onrender.com/user/privacy", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setPrivacyData(res.data))
      .catch(err => console.error(err));
  }

  if (page === "help") {
    axios.get("https://movie-nova-3.onrender.com/help/faq", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setHelpData({ faq: res.data }))
      .catch(err => console.error(err));
  }

}, [page]);

  /* =========================
     Back Header (Lucide)
  ========================= */
  const BackHeader = ({ title }) => (
    <div className="flex items-center gap-3 mb-4">
      <button onClick={goBack}>
        <ArrowLeft size={22} />
      </button>
      <h1 className="text-xl font-bold">{title}</h1>
    </div>
  );

  /* =========================
     Settings Item
  ========================= */
  const SettingsItem = ({ icon, title, target, color }) => (
    <div
      onClick={() => setPage(target)}
      className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm mb-3 cursor-pointer hover:shadow-md transition"
    >
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${color}`}>
          {icon}
        </div>
        <span className="text-gray-700 font-medium">{title}</span>
      </div>
      <ChevronRight size={20} className="text-gray-400" />
    </div>
  );

  /* =========================
     SETTINGS PAGE
  ========================= */
  if (page === "settings") {
    return (
      <div className="bg-gray-100 min-h-screen max-w-md mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Settings</h1>
        <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow mb-5">
          <img
            src={profileData.photoUrl}
            alt="profile"
            className="w-14 h-14 rounded-full"
          />
          <div>
          	<h2 className="font-semibold">{profileData.fullName}</h2>
            <p className="text-sm text-gray-500">{profileData.email}</p>
          </div>
        </div>
        <SettingsItem icon={<FaUser className="text-white" />} title="Profile" target="profile" color="bg-blue-500" />
        <SettingsItem icon={<FaBell className="text-white" />} title="Notifications" target="notifications" color="bg-yellow-400" />
        <SettingsItem icon={<FaCreditCard className="text-white" />} title="Payments" target="payments" color="bg-blue-400" />
        <SettingsItem icon={<FaLock className="text-white" />} title="Privacy" target="privacy" color="bg-green-500" />
        <SettingsItem icon={<FaQuestionCircle className="text-white" />} title="Help & Support" target="help" color="bg-orange-400" />
        
        <div className="mt-6" onClick={handleLogout}>
          <SettingsItem icon={<FaSignOutAlt className="text-white" />} title="Logout" color="bg-red-500"/>
        </div>
      </div>
    );
  }

  /* =========================
     PROFILE PAGE
  ========================= */
  if (page === "profile") {
    return (
      <div className="bg-gray-100 min-h-screen max-w-md mx-auto p-4">
        <BackHeader title="Profile" />

        <div className="bg-white p-4 rounded-xl shadow space-y-3">
          <input className="w-full border p-2 rounded-lg"
            value={profileData.fullName}
            onChange={e => setProfileData(prev => ({ ...prev, fullName: e.target.value }))}
            placeholder="Full Name"
          />
          <input 
            className="w-full border p-2 rounded-lg" 
            placeholder="Email"
            value={profileData.email}
            onChange={e => setProfileData(prev => ({ ...prev, email: e.target.value }))}
          />
          <input className="w-full border p-2 rounded-lg" 
            value={profileData.phone}
            onChange={e => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
            placeholder="Phone"
          />
          <button className="w-full bg-blue-500 text-white py-2 rounded-lg"
            onClick={() => axios.put("https://movie-nova-3.onrender.com/user/profile", profileData, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } })}>
            Save Changes
          </button>
        </div>
      </div>
    );
  }

  /* =========================
     NOTIFICATIONS PAGE
  ========================= */
  if (page === "notifications") {
    return (
      <div className="bg-gray-100 min-h-screen max-w-md mx-auto p-4">
        <BackHeader title="Notifications" />

        <div className="bg-white p-4 rounded-xl shadow space-y-4">
          <Toggle
            label="Email Notifications"
            enabled={notificationsData.email}
            onChange={val => setNotificationsData(prev => ({ ...prev, email: val }))}
          />
          <Toggle
            label="Push Notifications"
            enabled={notificationsData.push}
            onChange={val => setNotificationsData(prev => ({ ...prev, push: val }))}
          />
        </div>
      </div>
    );
  }

  /* =========================
     PAYMENTS PAGE
  ========================= */
  if (page === "payments") {
  return (
    <div className="bg-gray-100 min-h-screen max-w-md mx-auto p-4">
      <BackHeader title="Payments" />

      {loading ? (
        <p>Loading payments...</p>
      ) : (
        <div className="bg-white p-4 rounded-xl shadow space-y-3">
          <p><strong>Saved Card:</strong> {paymentsData?.card}</p>

          {paymentsData?.transactions?.length > 0 ? (
            paymentsData.transactions.map((t, i) => (
              <div key={i}>
                <p>{t.date}</p>
                <p>{t.amount}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No recent transactions</p>
          )}
        </div>
      )}
    </div>
  );
}
  /* =========================
     PRIVACY PAGE
  ========================= */
  if (page === "privacy") {
    return (
      <div className="bg-gray-100 min-h-screen max-w-md mx-auto p-4">
        <BackHeader title="Privacy" />
        <div className="bg-white p-4 rounded-xl shadow space-y-3">
          <button className="w-full text-left" onClick={() => axios.post("https://movie-nova-3.onrender.com/user/change-password")}>Change Password</button>
          <button className="w-full text-left" onClick={() => setPrivacyData(prev => ({ ...prev, twoFA: !prev.twoFA }))}>
            {privacyData.twoFA ? "Disable 2FA" : "Enable 2FA"}
          </button>
          <button className="w-full text-left text-red-500" onClick={() => axios.post("https://movie-nova-3.onrender.com/user/delete-account")}>Delete Account</button>
        </div>
      </div>
    );
  }

  /* =========================
     HELP PAGE
  ========================= */
  if (page === "help") {
    return (
      <div className="bg-gray-100 min-h-screen max-w-md mx-auto p-4">
        <BackHeader title="Help & Support" />

        <div className="bg-white p-4 rounded-xl shadow space-y-3">
            {helpData.faq.map((q, i) => (
                <button key={i} className="w-full text-left">
                    {q.question || q}
                </button>
            ))}
            {/*<button className="w-full text-left">{helpData.contact}</button>
            <button className="w-full text-left">{helpData.terms}</button>*/}
        </div>
      </div>
    );
  }
}

/* =========================
   Toggle Component
========================= */
function Toggle({ label, enabled, onChange }) {
  return (
    <div className="flex justify-between items-center">
      <span>{label}</span>
      <input
        type="checkbox"
        checked={enabled}
        onChange={() => onChange(!enabled)}
      />
    </div>
  );
}
