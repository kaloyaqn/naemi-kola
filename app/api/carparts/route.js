import { supabase } from "@/lib/supabase";

export async function GET() {
    try {
      const { data: carParts, error } = await supabase
        .from('cars')
        .select('*');
  
      if (error) {
        console.error('Supabase error:', error);
        return Response.json({ error: 'Failed to fetch car parts' }, { status: 500 });
      }
  
      return Response.json(carParts);
    } catch (error) {
      console.error('Unexpected error in API route:', error);
      return Response.json({ error: 'An unexpected error occurred' }, { status: 500 });
    }
  }