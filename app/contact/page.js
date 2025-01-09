'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Login from '@/components/Login'; // Import your login component

const ReservationPage = () => {
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Fetch car details from URL parameters
  const carId = searchParams.get('carId');
  const brand = searchParams.get('brand');
  const price = searchParams.get('price');
  const type = searchParams.get('type');
  const image = searchParams.get('image');
  const description = searchParams.get('description');
  const seats = searchParams.get('seats');

  // State management
  const [user, setUser] = useState(null);
  const [reservationData, setReservationData] = useState({
    start_date: '',
    end_date: '',
    car_id: carId || '',
    price_per_day: price || '',
    brand: brand || '',
    message: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  useEffect(() => {
    async function fetchUserProfile() {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
      } else {
        setShowLoginPopup(true); // Show login popup if not logged in
      }
    }
    fetchUserProfile();
  }, []);

  const handleInputChange = (e) => {
    setReservationData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleReservation = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { error } = await supabase.from('reservations').insert({
        user_id: user?.id,
        ...reservationData,
        car_id: carId,
      });

      if (error) throw error;
      alert('Reservation successful!');
      router.push('/reservations');
    } catch (error) {
      alert('Error creating reservation');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {showLoginPopup ? (
        <Login onClose={() => setShowLoginPopup(false)} />
      ) : (
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
                  <h2 className="text-2xl font-semibold mb-2">Описание</h2>
                  <p className="text-xl">{description}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Reservation Form Card */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Направи резервация</h2>
              {user ? (
                <form onSubmit={handleReservation} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Начало
                    </label>
                    <input
                      type="datetime-local"
                      name="start_date"
                      value={reservationData.start_date}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Край
                    </label>
                    <input
                      type="datetime-local"
                      name="end_date"
                      value={reservationData.end_date}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Допълнително
                    </label>
                    <textarea
                      name="message"
                      value={reservationData.message}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors duration-200 resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 font-medium"
                  >
                    {isLoading ? 'Резервиране...' : 'Наеми'}
                  </Button>
                </form>
              ) : (
                <div>Loading...</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReservationPage;
