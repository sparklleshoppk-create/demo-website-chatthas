import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://oswimqzfbikzufckvhby.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_-WFpyqUojnTAl4TRGqhZRA_w2fgWx3j';

export const supabase = createClient(supabaseUrl, supabaseKey);
