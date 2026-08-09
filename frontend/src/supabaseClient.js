import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

console.log("URL: ", process.env.REACT_APP_SUPABASE_URL);
console.log("KEY", process.env.REACT_APP_SUPABASE_KEY);