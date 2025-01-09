import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { redirect } from "next/navigation";
import { getSession } from "../../utils/supabase/server";

export default async function Page() {
  const session = await getSession();

  // Fetch total orders
  const { data: allOrders, error: allOrdersError } = await supabase
    .from("reservations")
    .select("*");

  // Fetch today's orders
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { data: todayOrders, error: todayOrdersError } = await supabase
    .from("reservations")
    .select("id")
    .gte("created_at", today.toISOString());

  if (allOrdersError || todayOrdersError) {
    console.error("Error fetching data:", allOrdersError || todayOrdersError);
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <h1 className="text-3xl font-semibold text-red-500">Error loading data.</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Админ Панел</h1>
      <p className="text-gray-600 mb-8 text-2xl">
        Добре дошъл,{" "}
        <span className="font-medium text-blue-600">
          {session.profile?.username || session.user.email}
        </span>
        !
      </p>

      {/* Buttons */}
      <div className="flex gap-4 mb-8">
        <Link href="/admin/orders">
          <button className="bg-blue-600 text-white font-medium py-2 px-6 rounded-lg shadow hover:bg-blue-700 transition duration-300">
            Преглед на поръчките
          </button>
        </Link>
        <Link href="/admin/cars">
          <button className="bg-green-600 text-white font-medium py-2 px-6 rounded-lg shadow hover:bg-green-700 transition duration-300">
            Менажиране на коли
          </button>
        </Link>
      </div>

      {/* Info Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Total Orders */}
        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow text-center hover:shadow-lg transition duration-300">
          <h2 className="text-lg font-medium text-gray-600 mb-2">Общо поръчки</h2>
          <p className="text-3xl font-bold text-blue-600">{allOrders.length}</p>
        </div>

        {/* Today's Orders */}
        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow text-center hover:shadow-lg transition duration-300">
          <h2 className="text-lg font-medium text-gray-600 mb-2">Поръчки днес</h2>
          <p className="text-xl font-bold text-green-600">
            {todayOrders.length > 0
              ? todayOrders.map((order) => order.id).join(", ")
              : "Няма поръчки днес"}
          </p>
        </div>
      </div>
    </div>
  );
}
