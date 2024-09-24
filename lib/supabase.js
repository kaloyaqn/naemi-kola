import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Този клиент ще се използва само на сървъра
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
