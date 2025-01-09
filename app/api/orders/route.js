// /app/api/orders/route.js
import { createClient } from "@/utils/supabase/client";

export const GET = async () => {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("reservations") // Replace with your actual reservations table name
      .select(`
        id,
        car_id,
        brand,
        price_per_day,
        reservation_type,
        start_date,
        end_date,
        user_id,
        profiles (
          full_name,
          username
        )
      `);

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
      });
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch orders" }), {
      status: 500,
    });
  }
};
