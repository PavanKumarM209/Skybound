"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { useRouter } from "next/navigation";

interface Booking {
  _id: string;
  student_name: string;
  student_age: number;
  phone: string;
  program: string;
  date: string;
  status: string;
  instructor_id: string;
  created_at: string;
}

interface Instructor {
  _id: string;
  name: string;
  email: string;
  rank: string;
}

export default function AdminDashboard() {
  const [adminId, setAdminId] = useState<string | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in as admin
    const userId = localStorage.getItem("user_id");
    const userRole = localStorage.getItem("user_role");

    if (!userId || userRole !== "admin") {
      router.push("/login");
      return;
    }

    setAdminId(userId);
    fetchData();
  }, [router]);

  const fetchData = async () => {
    try {
      // Fetch all bookings
      const bookingsRes = await fetch("http://localhost:5000/api/bookings");
      const bookingsData = await bookingsRes.json();
      setBookings(bookingsData);

      // Fetch all instructors
      const instructorsRes = await fetch("http://localhost:5000/api/instructors");
      const instructorsData = await instructorsRes.json();
      setInstructors(instructorsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getInstructorName = (instructorId: string) => {
    const instructor = instructors.find((i) => i._id === instructorId);
    return instructor?.name || "Unknown";
  };

  const pendingBookings = bookings.filter((b) => b.status === "pending");
  const acceptedBookings = bookings.filter((b) => b.status === "accepted");
  const rejectedBookings = bookings.filter((b) => b.status === "rejected");

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="mb-12">
            <h1 className="text-4xl font-black text-foreground mb-2">Admin Dashboard</h1>
            <p className="text-muted">Manage all academy operations</p>
          </div>

          {loading ? (
            <div className="text-center text-muted">Loading data...</div>
          ) : (
            <div className="space-y-12">
              {/* Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-card border border-border rounded-xl p-6">
                  <p className="text-muted text-sm">Total Bookings</p>
                  <p className="text-3xl font-black text-foreground">{bookings.length}</p>
                </div>
                <div className="bg-card border border-amber-500/30 rounded-xl p-6">
                  <p className="text-muted text-sm">Pending</p>
                  <p className="text-3xl font-black text-amber-500">{pendingBookings.length}</p>
                </div>
                <div className="bg-card border border-emerald-500/30 rounded-xl p-6">
                  <p className="text-muted text-sm">Accepted</p>
                  <p className="text-3xl font-black text-emerald-500">{acceptedBookings.length}</p>
                </div>
                <div className="bg-card border border-red-500/30 rounded-xl p-6">
                  <p className="text-muted text-sm">Instructors</p>
                  <p className="text-3xl font-black text-red-500">{instructors.length}</p>
                </div>
              </div>

              {/* All Bookings Table */}
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">All Bookings</h2>
                <div className="bg-card border border-border rounded-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border bg-background">
                          <th className="px-6 py-3 text-left font-bold text-foreground">Student</th>
                          <th className="px-6 py-3 text-left font-bold text-foreground">Instructor</th>
                          <th className="px-6 py-3 text-left font-bold text-foreground">Phone</th>
                          <th className="px-6 py-3 text-left font-bold text-foreground">Program</th>
                          <th className="px-6 py-3 text-left font-bold text-foreground">Date</th>
                          <th className="px-6 py-3 text-left font-bold text-foreground">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.map((booking) => (
                          <tr key={booking._id} className="border-b border-border hover:bg-background transition">
                            <td className="px-6 py-4 text-foreground font-semibold">
                              {booking.student_name} ({booking.student_age}y)
                            </td>
                            <td className="px-6 py-4 text-muted">{getInstructorName(booking.instructor_id)}</td>
                            <td className="px-6 py-4 text-muted">{booking.phone}</td>
                            <td className="px-6 py-4 text-muted">{booking.program}</td>
                            <td className="px-6 py-4 text-muted">{booking.date}</td>
                            <td className="px-6 py-4">
                              <span
                                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                                  booking.status === "pending"
                                    ? "bg-amber-500/20 text-amber-400"
                                    : booking.status === "accepted"
                                    ? "bg-emerald-500/20 text-emerald-400"
                                    : "bg-red-500/20 text-red-400"
                                }`}
                              >
                                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Instructors */}
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">Instructors ({instructors.length})</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {instructors.map((instructor) => (
                    <div key={instructor._id} className="bg-card border border-border rounded-xl p-6">
                      <h3 className="font-bold text-foreground">{instructor.name}</h3>
                      <p className="text-sm text-muted mb-2">{instructor.rank}</p>
                      <p className="text-xs text-muted">{instructor.email}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
