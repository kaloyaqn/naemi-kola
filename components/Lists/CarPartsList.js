import ProductCard from "../Cards/ProductCard";

export default function CarsList({ cars }) {
  if (!cars || cars.length === 0) {
    return <div>No car parts available.</div>;
  }

  return (
    <ul>
      {cars.map((part, index) => (
        <ProductCard key={part.id || index} cars={part} />
      ))}
    </ul>
  );
}