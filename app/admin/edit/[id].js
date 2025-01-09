"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabase";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function EditCarPage() {
  const router = useRouter();
  const { id } = router.query; // Extract the car ID from the URL

  const [car, setCar] = useState(null); // Store car details
  const [brands, setBrands] = useState([]); // Store available car brands
  const [models, setModels] = useState([]); // Store available car models
  const [loading, setLoading] = useState(true); // Loading state for data fetching
  const [error, setError] = useState(null); // For error handling

  // Fetch car data, brands, and models
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch car details
        const { data: carData, error: carError } = await supabase
          .from("cars")
          .select("*")
          .eq("id", id)
          .single(); // Fetch the specific car by ID
        if (carError) throw carError;

        // Fetch brands
        const { data: brandData, error: brandError } = await supabase.from("brands").select("*");
        if (brandError) throw brandError;

        // Fetch models
        const { data: modelData, error: modelError } = await supabase.from("models").select("*");
        if (modelError) throw modelError;

        setCar(carData); // Set the car details
        setBrands(brandData); // Set the brands
        setModels(modelData); // Set the models
        setLoading(false); // Set loading to false after data is fetched
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message || "Failed to load data");
        setLoading(false);
      }
    };

    if (id) fetchData(); // Fetch data only if the ID is available
  }, [id]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { error } = await supabase
        .from("cars")
        .update({
          brand_id: car.brand_id,
          model_id: car.model_id,
          year: car.year,
          price_per_day: car.price_per_day,
        })
        .eq("id", id); // Update the car with the specified ID

      if (error) throw error;

      toast.success("Колата беше успешно обновена!");
      router.push("/admin/cars"); // Redirect to the cars list page after successful update
    } catch (err) {
      console.error("Error updating car:", err);
      toast.error("Неуспешно обновяване на кола");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl mb-4">Редактирай Кола</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="brand" className="block text-sm font-medium">Марка</label>
          <select
            id="brand"
            value={car?.brand_id || ""}
            onChange={(e) => setCar({ ...car, brand_id: e.target.value })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="model" className="block text-sm font-medium">Модел</label>
          <select
            id="model"
            value={car?.model_id || ""}
            onChange={(e) => setCar({ ...car, model_id: e.target.value })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            {models.map((model) => (
              <option key={model.id} value={model.id}>
                {model.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="year" className="block text-sm font-medium">Година</label>
          <input
            type="number"
            id="year"
            value={car?.year || ""}
            onChange={(e) => setCar({ ...car, year: e.target.value })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="price_per_day" className="block text-sm font-medium">Цена на ден</label>
          <input
            type="number"
            id="price_per_day"
            value={car?.price_per_day || ""}
            onChange={(e) => setCar({ ...car, price_per_day: e.target.value })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-md"
          >
            Запази промените
          </button>
        </div>
      </form>

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
}
