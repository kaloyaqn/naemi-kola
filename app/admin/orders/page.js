
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

async function getOrders() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const res = await fetch(`${apiUrl}/api/orders`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Failed to fetch orders");
  }
  return res.json();
}

export default async function Page() {
  let orders = [];
  try {
    orders = await getOrders();
  } catch (error) {
    console.error("Error fetching orders:", error);
    return <div>Error loading orders. Please try again later.</div>;
  }

  function formatDate(dateString) {
    if (!dateString) return "N/A"; // Handle null or undefined dates
    const date = new Date(dateString);
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  }

  return (
    <div className="container mx-auto p-4">
      {orders.length === 0 ? (
        <div>No orders found.</div>
      ) : (
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Номер на поръчка
                </th>
                <th scope="col" className="px-6 py-3">
                  Имена
                </th>
                <th scope="col" className="px-6 py-3">
                  Имейл
                </th>
                <th scope="col" className="px-6 py-3">
                  Телефон
                </th>
                <th scope="col" className="px-6 py-3">
                  Модел
                </th>
                <th scope="col" className="px-6 py-3">
                  Цена на ден
                </th>
                <th scope="col" className="px-6 py-3">
                  Вид резервация
                </th>
                <th scope="col" className="px-6 py-3">
                  дата
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {order.id}
                  </th>
                  <td className="px-6 py-4">{order.full_name || "N/A"}</td>
                  <td className="px-6 py-4">{order.email || "N/A"}</td>
                  <td className="px-6 py-4">{order.phone || "N/A"}</td>
                  <td className="px-6 py-4">{order.brand || "N/A"}</td>
                  <td className="px-6 py-4">{<>{order.price_per_day} лв.</> || "N/A"}</td>
                  <td className="px-6 py-4">
                    {order.reservation_type || "N/A"}
                  </td>
                  <td className="px-6 py-4">
                    {order.start_date && order.end_date
                      ? `от ${formatDate(order.start_date)} до ${formatDate(
                          order.end_date
                        )}`
                      : "N/A"}
                  </td>{" "}
                  {/* <td className="px-6 py-4">{<>
                  <Link href={"/"}>
                    <Button type="secondary">
                        Виж
                    </Button>
                  </Link>
                  </> || "N/A"}</td> */}

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
