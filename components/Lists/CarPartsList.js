import ProductCard from "../Cards/ProductCard";

export default function CarsList({ cars, className }) {
  if (!cars || cars.length === 0) {
    return <div>No car parts available.</div>;
  }

  return (
    <div className={"grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-8 " + className}>
      {cars.map((part, index) => (
        <div key={part.id || index} className="flex">
          <ProductCard cars={part} />
        </div>
      ))}
    </div>
  );
}