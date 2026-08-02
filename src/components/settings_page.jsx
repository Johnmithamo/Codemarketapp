import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaUser, FaBell, FaCreditCard, FaLock, FaQuestionCircle, FaSignOutAlt } from "react-icons/fa";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { useToast } from "./toast_context";

const API = "https://movie-nova-5.onrender.com";

/* =========================
   Main App
========================= */
export default function App() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [page, setPage] = useState("settings");
  const [profileData, setProfileData] = useState({ fullName: "", email: "", phone: "" });
  const goBack = () => setPage("settings");
  const [notificationsData, setNotificationsData] = useState({ email: false, push: false });
  const [paymentsData, setPaymentsData] = useState({ card: "**** **** **** 1234", transactions: [] });
  const [privacyData, setPrivacyData] = useState({ twoFA: false });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "" });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [helpData, setHelpData] = useState({ faq: [], contact: "", terms: "" });
  const navigate = useNavigate();
  const { toast } = useToast();
  const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem("token")}` });

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) return;

  if (page === "settings" || page === "profile") {
    axios.get(`${API}/profile`, { headers: authHeaders() })
      .then(res => setProfileData(res.data.profile))
      .catch(err => console.error(err));
  }

  if (page === "notifications") {
    axios.get(`${API}/user/notifications`, { headers: authHeaders() })
      .then(res => setNotificationsData(res.data))
      .catch(err => console.error(err));
  }

  if (page === "payments") {
  setLoading(true);

  axios.get(`${API}/user/payments`, { headers: authHeaders() })
  .then(res => setPaymentsData(res.data))
  .catch(err => console.error(err))
  .finally(() => setLoading(false));
  }

  if (page === "privacy") {
    axios.get(`${API}/user/privacy`, { headers: authHeaders() })
      .then(res => setPrivacyData(res.data))
      .catch(err => console.error(err));
  }

  if (page === "help") {
    axios.get(`${API}/help/faq`, { headers: authHeaders() })
      .then(res => setHelpData({ faq: res.data }))
      .catch(err => console.error(err));
  }

}, [page]);

  /* =========================
     ACTIONS
  ========================= */
  const saveProfile = async () => {
    setSaving(true);
    try {
      await axios.put(`${API}/user/profile`, profileData, { headers: authHeaders() });
      toast("Profile saved successfully");
    } catch (err) {
      toast(err.response?.data?.error || "Couldn't save profile", "error");
    } finally {
      setSaving(false);
    }
  };

  const updateNotification = async (key, value) => {
    const next = { ...notificationsData, [key]: value };
    setNotificationsData(next); // optimistic
    try {
      await axios.put(`${API}/user/notifications`, next, { headers: authHeaders() });
      toast("Notification preferences saved");
    } catch (err) {
      setNotificationsData(notificationsData); // revert on failure
      toast("Couldn't save notification preferences", "error");
    }
  };

  const toggleTwoFA = async () => {
    const next = { ...privacyData, twoFA: !privacyData.twoFA };
    setPrivacyData(next);
    try {
      await axios.put(`${API}/user/privacy`, next, { headers: authHeaders() });
      toast(next.twoFA ? "Two-factor authentication enabled" : "Two-factor authentication disabled");
    } catch (err) {
      setPrivacyData(privacyData);
      toast("Couldn't update two-factor setting", "error");
    }
  };

  const submitPasswordChange = async () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      toast("Enter your current and new password", "error");
      return;
    }
    setSaving(true);
    try {
      await axios.post(`${API}/user/change-password`, passwordForm, { headers: authHeaders() });
      toast("Password changed successfully");
      setPasswordForm({ currentPassword: "", newPassword: "" });
    } catch (err) {
      toast(err.response?.data?.error || "Couldn't change password", "error");
    } finally {
      setSaving(false);
    }
  };

  const confirmDeleteAccount = async () => {
    setSaving(true);
    try {
      await axios.post(`${API}/user/delete-account`, {}, { headers: authHeaders() });
      toast("Account deleted");
      handleLogout();
    } catch (err) {
      toast(err.response?.data?.error || "Couldn't delete account", "error");
    } finally {
      setSaving(false);
      setShowDeleteConfirm(false);
    }
  };

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
            src={profileData.photoUrl || "https://via.placeholder.com/56"}
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
            value={profileData.fullName || ""}
            onChange={e => setProfileData(prev => ({ ...prev, fullName: e.target.value }))}
            placeholder="Full Name"
          />
          <input 
            className="w-full border p-2 rounded-lg" 
            placeholder="Email"
            value={profileData.email || ""}
            onChange={e => setProfileData(prev => ({ ...prev, email: e.target.value }))}
          />
          <input className="w-full border p-2 rounded-lg" 
            value={profileData.phone || ""}
            onChange={e => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
            placeholder="Phone"
          />
          <button
            disabled={saving}
            className="w-full bg-blue-500 text-white py-2 rounded-lg disabled:opacity-60"
            onClick={saveProfile}
          >
            {saving ? "Saving..." : "Save Changes"}
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
            onChange={val => updateNotification("email", val)}
          />
          <Toggle
            label="Push Notifications"
            enabled={notificationsData.push}
            onChange={val => updateNotification("push", val)}
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
        <div className="flex gap-2 mt-8">
          <span className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce"></span>
          <span className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce delay-150"></span>
          <span className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce delay-300"></span>
          <span className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce delay-450"></span>
        </div>

      ) : (
        <div className="bg-white p-4 rounded-xl shadow space-y-3">
          <p><strong>Saved Card:</strong> {paymentsData?.card}</p>

          {paymentsData?.transactions?.length > 0 ? (
            paymentsData.transactions.map((t, i) => (
              <div key={i} className="flex justify-between text-sm border-t pt-2 first:border-t-0 first:pt-0">
                <span className="text-gray-500">{t.date}</span>
                <span className="font-medium text-green-600">${t.amount}</span>
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
        <div className="bg-white p-4 rounded-xl shadow space-y-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Change Password</p>
            <input
              type="password"
              className="w-full border p-2 rounded-lg"
              placeholder="Current password"
              value={passwordForm.currentPassword}
              onChange={e => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
            />
            <input
              type="password"
              className="w-full border p-2 rounded-lg"
              placeholder="New password"
              value={passwordForm.newPassword}
              onChange={e => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
            />
            <button
              disabled={saving}
              className="w-full bg-blue-500 text-white py-2 rounded-lg disabled:opacity-60"
              onClick={submitPasswordChange}
            >
              {saving ? "Updating..." : "Update Password"}
            </button>
          </div>

          <button className="w-full text-left border-t pt-4" onClick={toggleTwoFA}>
            {privacyData.twoFA ? "Disable 2FA" : "Enable 2FA"}
          </button>

          <button
            className="w-full text-left text-red-500 border-t pt-4"
            onClick={() => setShowDeleteConfirm(true)}
          >
            Delete Account
          </button>
        </div>

        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-6">
            <div className="bg-white rounded-2xl p-5 w-full max-w-sm">
              <h3 className="font-semibold text-gray-900">Delete your account?</h3>
              <p className="text-sm text-gray-500 mt-2">
                This permanently removes your account and profile. This can't be undone.
              </p>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-2 rounded-lg border border-gray-300 text-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteAccount}
                  disabled={saving}
                  className="flex-1 py-2 rounded-lg bg-red-500 text-white disabled:opacity-60"
                >
                  {saving ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
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
        checked={!!enabled}
        onChange={() => onChange(!enabled)}
      />
    </div>
  );
}
