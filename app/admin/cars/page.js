"use client"

import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";
import Link from "next/link";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CarsPage() {
    const [cars, setCars] = useState([]);
    const [brands, setBrands] = useState([]);
    const [models, setModels] = useState([]);
    const [error, setError] = useState(null);

    // Fetch cars, brands, and models
    useEffect(() => {
        const fetchData = async () => {
            // Fetch cars
            const { data: carData, error: carError } = await supabase.from("cars").select("*");
            if (carError) {
                setError(carError);
                return;
            }

            // Fetch brands
            const { data: brandData, error: brandError } = await supabase.from("brands").select("*");
            if (brandError) {
                setError(brandError);
                return;
            }

            // Fetch models
            const { data: modelData, error: modelError } = await supabase.from("models").select("*");
            if (modelError) {
                setError(modelError);
                return;
            }

            setCars(carData);
            setBrands(brandData);
            setModels(modelData);
        };

        fetchData();
    }, []);

    // Handle car deletion
    const deleteCar = async (carId) => {
        const { error } = await supabase.from("cars").delete().eq("id", carId);

        if (error) {
            console.error("Error deleting car:", error);
            toast.error("Неуспешно изтриване на кола");
        } else {
            setCars(cars.filter((car) => car.id !== carId));
            toast.success("Колата беше успешно изтрита");
        }
    };

    if (error) {
        return <p>Error: {error.message}</p>;
    }

    return (
        <div className="container mx-auto mt-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Преглед на Всички Коли</h1>

            <div className="flex justify-between items-center mb-6">
                <Link href="/admin">
                    <button className="p-2 bg-gray-600 text-white rounded-lg shadow-md hover:bg-gray-700 transition duration-200">
                        Назад към админ панела
                    </button>
                </Link>

                <Link href="/admin/create">
                    <button className="p-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition duration-200">
                        Създай нова кола
                    </button>
                </Link>
            </div>

            {/* Display cars */}
            <div>
                {cars.length === 0 ? (
                    <p className="text-gray-500">Няма коли за показване.</p>
                ) : (
                    <ul>
                        {cars.map((car) => {
                            const brand = brands.find((brand) => brand.id === car.brand_id);
                            const model = models.find((model) => model.id === car.model_id);

                            return (
                                <li key={car.id} className="mb-6 p-4 bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition duration-200">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-800">{model?.name} - {brand?.name}</h3>
                                            <p className="text-gray-600">{car.year} | {car.price_per_day} лв/ден</p>
                                        </div>
                                        <div className="flex space-x-4">
                                            <Link href={`/admin/edit/${car.id}`}>
                                                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200">
                                                    Редактирай
                                                </button>
                                            </Link>
                                            <button
                                                onClick={() => deleteCar(car.id)}
                                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200"
                                            >
                                                Изтрий
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>

            {/* Toast Container */}
            <ToastContainer />
        </div>
    );
}
