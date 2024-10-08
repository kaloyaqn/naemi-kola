import { supabase } from "@/lib/supabase";

export async function GET(req, { params }) {
    const { id } = params;  // Destructure the id from params

    try {
      const { data: cars, error } = await supabase
        .from('cars')
        .select(`
          id,
          year,
          price_per_day,
          image_url,
          description,
          created_at,
          availability_status,
          brand_id,
          brands (name),
          models (name),
          seats
        `)
        .eq('id', id);  // Add the where clause to filter by car id
  
      if (error) {
        console.error('Supabase error:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch car' }), { status: 500 });
      }
  
      console.log('levskar',JSON.stringify(cars))
      return new Response(JSON.stringify(cars));
    } catch (error) {
      console.error('Unexpected error in API route:', error);
      return new Response(JSON.stringify({ error: 'An unexpected error occurred' }), { status: 500 });
    }
}
