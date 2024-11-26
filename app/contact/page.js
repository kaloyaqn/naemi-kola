"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function ReservationPage() {
  const searchParams = useSearchParams();
  
  // Get car details from URL parameters
  const carId = searchParams.get('carId');
  const brand = searchParams.get('brand');
  const price = searchParams.get('price');
  const type = searchParams.get('type');
  const image = searchParams.get('image');
  const description = searchParams.get('description');
  const seats = searchParams.get('seats');

  // State to manage form input values
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [reservationType, setReservationType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Submit the reservation to the Supabase database
    const { data, error } = await supabase
      .from("reservations")
      .insert([
        {
          full_name: fullName,
          email: email,
          phone: phone,
          car_id: carId,
          brand: brand,
          price_per_day: price,
          reservation_type: reservationType,
          start_date: startDate,
          end_date: endDate,
          message: message,
          status: "pending", // Default status
        },
      ]);

    if (error) {
      console.error("Error submitting reservation:", error);
      alert("Error submitting your reservation. Please try again.");
    } else {
      alert("Reservation submitted successfully!");
      // Clear form fields after submission
      setFullName("");
      setEmail("");
      setPhone("");
      setReservationType("");
      setStartDate("");
      setEndDate("");
      setMessage("");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Car Details Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Избран Автомобил</h2>
            <div className="space-y-4">
              {image && (
                <img 
                  src={image} 
                  alt={brand} 
                  className="w-full h-48 object-cover rounded-lg"
                />
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Модел</p>
                  <p className="font-medium text-gray-800">{brand}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Вид</p>
                  <p className="font-medium text-gray-800">{type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Цена на ден</p>
                  <p className="font-medium text-gray-800">{price}лв.</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Брой места</p>
                  <p className="font-medium text-gray-800">{seats}</p>
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-semibold mb-2 ">Описание</h2>
              <p className="text-xl">
              {description}

              </p>
              </div>
            </div>
          </div>
        </div>

        {/* Reservation Form Card */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Направи резервация</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Име и фамилия</label>
                <input
                  type="text"
                  placeholder="Въведи име и фамилия"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Имейл</label>
                <input
                  type="email"
                  placeholder="Въведи имейл"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Телефонен номер</label>
                <input
                  type="tel"
                  placeholder="Въведи телефонен номер"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Вид резервация</label>
                <select
                  required
                  value={reservationType}
                  onChange={(e) => setReservationType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors duration-200"
                >
                  <option value="">Избери вид</option>
                  <option value="daily">Дневен</option>
                  <option value="weekly">Седмичен</option>
                  <option value="monthly">Месечен</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Начало</label>
                <input
                  type="datetime-local"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Край</label>
                <input
                  type="datetime-local"
                  required
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Допълнително</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Any additional requests or information..."
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors duration-200 resize-none"
                />
              </div>

              <Button
                type="primary"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 font-medium"
              >
                Наеми
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
