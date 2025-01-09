"use client";

import { createClient } from "@supabase/supabase-js";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Import useRouter for navigation

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function ReservationsPage() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter(); // Hook to navigate

  // Fetch reservations function
  const fetchReservations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('reservations')
        .select(`
          id,
          car_id,
          brand,
          price_per_day,
          reservation_type,
          start_date,
          end_date,
          user_id,
          profiles:profiles!user_id (
            full_name,
            username
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setReservations(data || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching reservations:", err);
      setError(err.message || "Failed to fetch reservations");
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchReservations();
  }, []);

  // Date formatting utility
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  };

  // Render loading state
  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center">Loading reservations...</div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      {/* Back Button */}
      <button
        onClick={() => router.back()} // Navigate back on click
        className="bg-gray-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-gray-700 transition duration-300 mb-6"
      >
        Върни се назад
      </button>

      {reservations.length === 0 ? (
        <div>No reservations found.</div>
      ) : (
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">Reservation ID</th>
                <th scope="col" className="px-6 py-3">Car ID</th>
                <th scope="col" className="px-6 py-3">Full Name</th>
                <th scope="col" className="px-6 py-3">Username</th>
                <th scope="col" className="px-6 py-3">Brand</th>
                <th scope="col" className="px-6 py-3">Price per Day</th>
                <th scope="col" className="px-6 py-3">Reservation Type</th>
                <th scope="col" className="px-6 py-3">Dates</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((reservation) => {
                const profile = reservation.profiles; // Access profiles object

                return (
                  <tr
                    key={reservation.id}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                  >
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      {reservation.id}
                    </th>
                    <td className="px-6 py-4">{reservation.car_id}</td>
                    <td className="px-6 py-4">
                      {profile?.full_name || "N/A"}
                    </td>
                    <td className="px-6 py-4">
                      {profile?.username || "N/A"}
                    </td>
                    <td className="px-6 py-4">{reservation.brand || "N/A"}</td>
                    <td className="px-6 py-4">
                      {reservation.price_per_day
                        ? `${reservation.price_per_day} лв.`
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4">
                      {reservation.reservation_type || "N/A"}
                    </td>
                    <td className="px-6 py-4">
                      {reservation.start_date && reservation.end_date
                        ? `From ${formatDate(reservation.start_date)} to ${formatDate(
                            reservation.end_date
                          )}`
                        : "N/A"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
