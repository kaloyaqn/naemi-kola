import { supabase } from "@/lib/supabase";

export async function GET() {
    try {
      const { data: cars, error } = await supabase
        .from('reservations')
        .select(`
            *
        `)
        .order('id', { ascending: false });

  
      if (error) {
        console.error('Supabase error:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch cars' }), { status: 500 });
      }
  
      return new Response(JSON.stringify(cars));
    } catch (error) {
      console.error('Unexpected error in API route:', error);
      return new Response(JSON.stringify({ error: 'An unexpected error occurred' }), { status: 500 });
    }
}


//profili
// crud na admin i koli
//filtri