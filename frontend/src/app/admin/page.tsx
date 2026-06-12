"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Instructor {
  _id?: string;
  name: string;
  rank: string;
  role: string;
  location: string;
  phone: string;
  email: string;
  image_url: string;
}

interface Booking {
  _id: string;
  student_name: string;
  student_age: number;
  phone: string;
  program: string;
  date: string;
  status: string;
}

const SIDEBAR_ITEMS = [
  { id: "instructors", label: "Instructors", icon: "👨‍🏫" },
  { id: "payments", label: "Payments", icon: "💳" },
  { id: "settings", label: "Settings", icon: "⚙️" },
];

function InputField({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-slate-700 mb-2">{label}</label>
      <input
        {...props}
        className="w-full px-4 py-2.5 rounded-lg bg-white border border-slate-200 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 text-slate-800 text-sm outline-none transition-all"
      />
    </div>
  );
}

function Header({ onLogout }: { onLogout: () => void }) {
  return (
    <header className="bg-white border-b border-slate-200 shadow-sm">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
            S
          </div>
          <span className="text-xl font-bold text-slate-800">Sky Bound Martial Arts</span>
        </div>
        <button
          onClick={onLogout}
          className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
        >
          Logout
        </button>
      </div>
    </header>
  );
}

function Sidebar({ activeTab, onTabChange }: { activeTab: string; onTabChange: (tab: string) => void }) {
  return (
    <aside className="w-64 bg-slate-900 text-white h-screen border-r border-slate-800 overflow-y-auto">
      <nav className="p-4 space-y-2">
        {SIDEBAR_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 font-medium transition-all ${
              activeTab === item.id
                ? "bg-red-600 text-white"
                : "text-slate-300 hover:bg-slate-800"
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("instructors");
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Instructor form states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [instName, setInstName] = useState("");
  const [instRank, setInstRank] = useState("");
  const [instRole, setInstRole] = useState("Head Coach");
  const [instLocation, setInstLocation] = useState("");
  const [instPhone, setInstPhone] = useState("");
  const [instEmail, setInstEmail] = useState("");
  const [instImage, setInstImage] = useState("");
  const [instSubmitting, setInstSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Settings form states
  const [acctUsername, setAcctUsername] = useState("");
  const [acctPhoto, setAcctPhoto] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [settingsSubmitting, setSettingsSubmitting] = useState(false);
  const [settingsMessage, setSettingsMessage] = useState("");

  useEffect(() => {
    const verifyUserToken = async () => {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        router.push("/login?redirect=/admin");
        return;
      }

      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const uObj = JSON.parse(storedUser);
        setCurrentUser(uObj);
        setAcctUsername(uObj.username || "");
        setAcctPhoto(uObj.profile_photo || "");
      }

      try {
        const res = await fetch("/api/verify-token", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          setIsAuthenticated(true);
          loadData();
        } else {
          localStorage.removeItem("auth_token");
          localStorage.removeItem("user");
          router.push("/login?redirect=/admin");
        }
      } catch (err) {
        console.error("Token verification failed", err);
        router.push("/login?redirect=/admin");
      } finally {
        setAuthChecking(false);
      }
    };

    verifyUserToken();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [instRes, bookRes] = await Promise.all([
        fetch("/api/instructors").catch(() => null),
        fetch("/api/bookings").catch(() => null),
      ]);

      if (instRes?.ok) setInstructors(await instRes.json());
      if (bookRes?.ok) setBookings(await bookRes.json());
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const handleAddInstructor = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setInstSubmitting(true);
      const payload = {
        name: instName,
        rank: instRank,
        role: instRole,
        location: instLocation,
        phone: instPhone,
        email: instEmail,
        image_url: instImage || undefined,
      };

      const url = editingId ? `/api/instructors/${editingId}` : "/api/instructors";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        if (editingId) {
          const updated = await res.json();
          setInstructors((p) => p.map((i) => (i._id === editingId ? updated : i)));
        } else {
          const newInst = await res.json();
          setInstructors((p) => [...p, newInst]);
        }
        resetForm();
        setShowForm(false);
      } else {
        alert("Failed to save instructor.");
      }
    } finally {
      setInstSubmitting(false);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setInstName("");
    setInstRank("");
    setInstRole("Head Coach");
    setInstLocation("");
    setInstPhone("");
    setInstEmail("");
    setInstImage("");
  };

  const handleEditInstructor = (instructor: Instructor) => {
    setEditingId(instructor._id || null);
    setInstName(instructor.name);
    setInstRank(instructor.rank);
    setInstRole(instructor.role);
    setInstLocation(instructor.location);
    setInstPhone(instructor.phone);
    setInstEmail(instructor.email);
    setInstImage(instructor.image_url);
    setShowForm(true);
  };

  const handleDeleteInstructor = async (id: string) => {
    if (!confirm("Are you sure you want to delete this instructor?")) return;
    try {
      const res = await fetch(`/api/instructors/${id}`, { method: "DELETE" });
      if (res.ok) {
        setInstructors((p) => p.filter((i) => i._id !== id));
      } else {
        alert("Failed to delete instructor.");
      }
    } catch (err) {
      alert("Error deleting instructor.");
    }
  };

  const handleUpdateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsMessage("");

    if (newPassword && newPassword !== confirmPassword) {
      setSettingsMessage("Passwords do not match!");
      return;
    }

    try {
      setSettingsSubmitting(true);
      const token = localStorage.getItem("auth_token");
      const payload: any = { username: acctUsername, profile_photo: acctPhoto };
      if (newPassword) payload.new_password = newPassword;

      const res = await fetch("/api/update-account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSettingsMessage("Account updated successfully!");
        setNewPassword("");
        setConfirmPassword("");
        const data = await res.json();
        localStorage.setItem("user", JSON.stringify(data.user));
      } else {
        const err = await res.json();
        setSettingsMessage(err.error || "Failed to update account.");
      }
    } finally {
      setSettingsSubmitting(false);
    }
  };

  if (authChecking) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-slate-600 font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen bg-slate-100">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 flex flex-col">
        <Header onLogout={handleLogout} />
        <main className="flex-1 overflow-y-auto">
          <div className="p-8">
            {/* INSTRUCTORS TAB */}
            {activeTab === "instructors" && (
              <div>
                <div className="flex justify-between items-center mb-8">
                  <h1 className="text-3xl font-bold text-slate-800">Instructors</h1>
                  {!showForm && (
                    <button
                      onClick={() => {
                        resetForm();
                        setShowForm(true);
                      }}
                      className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
                    >
                      + Add Instructor
                    </button>
                  )}
                </div>

                {showForm && (
                  <div className="bg-white rounded-lg border border-slate-200 p-6 mb-8 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-bold text-slate-800">
                        {editingId ? "Edit Instructor" : "Add New Instructor"}
                      </h2>
                      <button
                        onClick={() => {
                          setShowForm(false);
                          resetForm();
                        }}
                        className="text-slate-400 hover:text-slate-600 text-2xl"
                      >
                        ×
                      </button>
                    </div>
                    <form onSubmit={handleAddInstructor}>
                      <div className="grid grid-cols-2 gap-4">
                        <InputField
                          label="Name"
                          value={instName}
                          onChange={(e) => setInstName(e.target.value)}
                          required
                        />
                        <InputField
                          label="Rank"
                          value={instRank}
                          onChange={(e) => setInstRank(e.target.value)}
                          placeholder="e.g., Black Belt 1st Dan"
                          required
                        />
                        <InputField
                          label="Role"
                          value={instRole}
                          onChange={(e) => setInstRole(e.target.value)}
                          placeholder="e.g., Head Coach"
                          required
                        />
                        <InputField
                          label="Location"
                          value={instLocation}
                          onChange={(e) => setInstLocation(e.target.value)}
                          required
                        />
                        <InputField
                          label="Phone"
                          value={instPhone}
                          onChange={(e) => setInstPhone(e.target.value)}
                          required
                        />
                        <InputField
                          label="Email"
                          type="email"
                          value={instEmail}
                          onChange={(e) => setInstEmail(e.target.value)}
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Photo URL
                        </label>
                        <input
                          type="file"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => setInstImage(reader.result as string);
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="w-full px-4 py-2.5 rounded-lg bg-white border border-slate-200 focus:border-red-500"
                        />
                      </div>
                      <div className="flex gap-4">
                        <button
                          type="submit"
                          disabled={instSubmitting}
                          className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                        >
                          {instSubmitting ? "Saving..." : "Save"}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowForm(false);
                            resetForm();
                          }}
                          className="px-6 py-2 bg-slate-300 text-slate-800 font-semibold rounded-lg hover:bg-slate-400 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
                  </div>
                ) : (
                  <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                            S.N.
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                            Name
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                            Rank
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                            Role
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                            Email
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                            Phone
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {instructors.map((inst, idx) => (
                          <tr
                            key={inst._id}
                            className="border-b border-slate-200 hover:bg-slate-50 transition-colors"
                          >
                            <td className="px-6 py-4 text-sm font-semibold text-slate-600">
                              {idx + 1}
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-800 font-medium">
                              {inst.name}
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-600">
                              {inst.rank}
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-600">
                              {inst.role}
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-600">
                              {inst.email}
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-600">
                              {inst.phone}
                            </td>
                            <td className="px-6 py-4 text-sm">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleEditInstructor(inst)}
                                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs font-semibold"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteInstructor(inst._id || "")}
                                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs font-semibold"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* PAYMENTS TAB */}
            {activeTab === "payments" && (
              <div>
                <h1 className="text-3xl font-bold text-slate-800 mb-8">Payment History</h1>
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
                  </div>
                ) : (
                  <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                            Student Name
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                            Program
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                            Amount
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                              No payment records found.
                            </td>
                          </tr>
                        ) : (
                          bookings.map((booking) => (
                            <tr
                              key={booking._id}
                              className="border-b border-slate-200 hover:bg-slate-50 transition-colors"
                            >
                              <td className="px-6 py-4 text-sm text-slate-800 font-medium">
                                {booking.student_name}
                              </td>
                              <td className="px-6 py-4 text-sm text-slate-600">
                                {booking.program}
                              </td>
                              <td className="px-6 py-4 text-sm text-slate-600">
                                ₹5,000 {/* Placeholder - integrate with Razorpay */}
                              </td>
                              <td className="px-6 py-4 text-sm text-slate-600">
                                {new Date(booking.date).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 text-sm">
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                    booking.status === "Confirmed"
                                      ? "bg-green-100 text-green-700"
                                      : booking.status === "Pending"
                                      ? "bg-yellow-100 text-yellow-700"
                                      : "bg-red-100 text-red-700"
                                  }`}
                                >
                                  {booking.status}
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* SETTINGS TAB */}
            {activeTab === "settings" && (
              <div className="max-w-2xl">
                <h1 className="text-3xl font-bold text-slate-800 mb-8">Settings</h1>
                <div className="bg-white rounded-lg border border-slate-200 p-8 shadow-sm">
                  <h2 className="text-xl font-bold text-slate-800 mb-6">Account Settings</h2>
                  <form onSubmit={handleUpdateAccount}>
                    <InputField
                      label="Username"
                      value={acctUsername}
                      onChange={(e) => setAcctUsername(e.target.value)}
                    />
                    <div className="mb-4">
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Profile Photo
                      </label>
                      <input
                        type="file"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => setAcctPhoto(reader.result as string);
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="w-full px-4 py-2.5 rounded-lg bg-white border border-slate-200 focus:border-red-500"
                      />
                    </div>
                    <InputField
                      label="New Password (optional)"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Leave blank to keep current password"
                    />
                    <InputField
                      label="Confirm Password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Leave blank to keep current password"
                    />
                    {settingsMessage && (
                      <div
                        className={`mb-4 p-4 rounded-lg ${
                          settingsMessage.includes("successfully")
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {settingsMessage}
                      </div>
                    )}
                    <button
                      type="submit"
                      disabled={settingsSubmitting}
                      className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                    >
                      {settingsSubmitting ? "Saving..." : "Save Changes"}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
