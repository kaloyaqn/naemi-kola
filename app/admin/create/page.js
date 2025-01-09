"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Page() {
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);

  const [isAddingBrand, setIsAddingBrand] = useState(false);
  const [isAddingModel, setIsAddingModel] = useState(false);
  const [newBrandName, setNewBrandName] = useState("");
  const [newModelName, setNewModelName] = useState("");

  const [formData, setFormData] = useState({
    brand_id: "",
    model_id: "",
    year: "",
    price_per_day: "",
    seats: "",
    transmission_type: "",
    type_car: "",
    image_url: "",
    description: "",
    availability_status: true,
  });

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const fetchBrands = async () => {
    const { data, error } = await supabase.from("brands").select("*");
    if (error) {
      console.error("Error fetching brands:", error);
    } else {
      setBrands(data);
    }
  };
  // Fetch brands on load
  useEffect(() => {
    fetchBrands();
  }, []);

  // Fetch models when brand is selected
  useEffect(() => {
    if (formData.brand_id) {
      const fetchModels = async () => {
        const { data, error } = await supabase
          .from("models")
          .select("*")
          .eq("brand_id", formData.brand_id);
        if (error) {
          console.error("Error fetching models:", error);
        } else {
          setModels(data);
        }
      };
      fetchModels();
    }
  }, [formData.brand_id]);

  // Fetch brands on load
  useEffect(() => {
    const fetchBrands = async () => {
      const { data, error } = await supabase.from("brands").select("*");
      if (error) {
        console.error("Error fetching brands:", error);
      } else {
        setBrands(data);
      }
    };
    fetchBrands();
  }, []);

  // Fetch models when brand is selected
  useEffect(() => {
    if (formData.brand_id) {
      fetchModels();
    }
  }, [formData.brand_id]);

  const fetchModels = async () => {
    const { data, error } = await supabase
      .from("models")
      .select("*")
      .eq("brand_id", formData.brand_id);
    if (error) {
      console.error("Error fetching models:", error);
    } else {
      setModels(data);
    }
  };

  // Handle brand and model addition
  const handleBrandChange = (e) => {
    setNewBrandName(e.target.value);
  };

  const handleModelChange = (e) => {
    setNewModelName(e.target.value);
  };

  const handleAddBrand = async () => {
    const { data, error } = await supabase
      .from("brands")
      .insert([{ name: newBrandName }]);
    if (error) {
      console.error("Error adding brand:", error);
      toast.error("Failed to add brand. Please try again.");
    } else {
      setIsAddingBrand(false);
      setNewBrandName("");
      toast.success("Brand added successfully!");
      // Refetch brands to update the dropdown
      fetchBrands();
    }
  };

  const handleAddModel = async () => {
    const { data, error } = await supabase
      .from("models")
      .insert([{ name: newModelName, brand_id: formData.brand_id }]);
    if (error) {
      console.error("Error adding model:", error);
      toast.error("Failed to add model. Please try again.");
    } else {
      setIsAddingModel(false);
      setNewModelName("");
      toast.success("Моделът е добавен успешно!");
      // Refetch models to update the dropdown
      fetchModels();
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Correctly format image_url as a PostgreSQL array
    const payload = {
      ...formData,
      image_url: formData.image_url ? `{${formData.image_url}}` : null,
    };

    const { data, error } = await supabase.from("cars").insert([payload]);

    if (error) {
      console.error("Error adding car:", error);
      alert("Failed to add car. Please try again.");
    } else {
        toast.success("Колата  е добавена успешно!");
        setFormData({
        brand_id: "",
        model_id: "",
        year: "",
        price_per_day: "",
        seats: "",
        transmission_type: "",
        type_car: "",
        image_url: "",
        description: "",
        availability_status: true,
      });
    }
  };

  return (
    <div className="container mx-auto mt-5">
      <ToastContainer />

      <h1 className="text-2xl font-bold mb-4">Добави Нова Кола</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          name="brand_id"
          id="brand_id"
          value={formData.brand_id}
          onChange={handleChange}
          className="border p-2 w-full"
          required
        >
          <option value="">Избери марка</option>
          {brands.map((brand) => (
            <option key={brand.id} value={brand.id}>
              {brand.name}
            </option>
          ))}
          <option value="new">Добави нова марка</option>
        </select>

        <select
          name="model_id"
          id="model_id"
          value={formData.model_id}
          onChange={handleChange}
          className="border p-2 w-full"
          required
        >
          <option value="">Избери модел</option>
          {models.map((model) => (
            <option key={model.id} value={model.id}>
              {model.name}
            </option>
          ))}
          <option value="new">Добави нов модел</option>
        </select>

        {isAddingBrand ? (
          <div className="mb-4">
            <label
              htmlFor="new_brand_name"
              className="block text-sm font-medium"
            >
             Име на нова марка
            </label>
            <div className="flex">
              <input
                type="text"
                name="new_brand_name"
                id="new_brand_name"
                value={newBrandName}
                onChange={handleBrandChange}
                className="border p-2 flex-1 mr-2"
              />
              <button
                onClick={handleAddBrand}
                className="bg-blue-500 text-white py-2 px-4 rounded"
              >
                Добави марка
              </button>
            </div>
          </div>
        ) : (
          <div
            className="text-blue-500 cursor-pointer"
            onClick={() => setIsAddingBrand(true)}
          >
            + Добави нова марка
          </div>
        )}

        {isAddingModel ? (
          <div className="mb-4">
            <label
              htmlFor="new_model_name"
              className="block text-sm font-medium"
            >
             Име на нов модел
            </label>
            <div className="flex">
              <input
                type="text"
                name="new_model_name"
                id="new_model_name"
                value={newModelName}
                onChange={handleModelChange}
                className="border p-2 flex-1 mr-2"
              />
              <button
                onClick={handleAddModel}
                className="bg-blue-500 text-white py-2 px-4 rounded"
              >
                Добави модел
              </button>
            </div>
          </div>
        ) : (
          <div
            className="text-blue-500 cursor-pointer"
            onClick={() => setIsAddingModel(true)}
          >
            + Добави нов модел
          </div>
        )}

        {/* Year */}
        <div>
          <label htmlFor="year" className="block text-sm font-medium">
            Година
          </label>
          <input
            type="number"
            name="year"
            id="year"
            value={formData.year}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </div>

        {/* Price Per Day */}
        <div>
          <label htmlFor="price_per_day" className="block text-sm font-medium">
            Цена на ден
          </label>
          <input
            type="number"
            name="price_per_day"
            id="price_per_day"
            value={formData.price_per_day}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </div>

        {/* Seats */}
        <div>
          <label htmlFor="seats" className="block text-sm font-medium">
            Брой седалки
          </label>
          <input
            type="number"
            name="seats"
            id="seats"
            value={formData.seats}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </div>

        {/* Transmission Type */}
        <div>
          <label
            htmlFor="transmission_type"
            className="block text-sm font-medium"
          >
            Скоростна кутия
          </label>
          <input
            type="text"
            name="transmission_type"
            id="transmission_type"
            value={formData.transmission_type}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </div>

        {/* Type of Car */}
        <div>
          <label htmlFor="type_car" className="block text-sm font-medium">
            Тип кола
          </label>
          <input
            type="text"
            name="type_car"
            id="type_car"
            value={formData.type_car}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </div>

        {/* Image URL */}
        <div>
          <label htmlFor="image_url" className="block text-sm font-medium">
            URL на изображение
          </label>
          <input
            type="url"
            name="image_url"
            id="image_url"
            value={formData.image_url}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium">
            Описание
          </label>
          <textarea
            name="description"
            id="description"
            value={formData.description}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          Добави кола
        </button>
      </form>
    </div>
  );
}
