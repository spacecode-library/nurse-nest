import { createClient } from '@supabase/supabase-js'

const supabase_url = "https://hjgspbyckknhoetrifko.supabase.co";
const service_role_key = import.meta.env.VITE_SUPABASE_SERVICE_KEY; 

const supabase = createClient(supabase_url, service_role_key, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Access auth admin api
export const adminAuthClient = supabase.auth.admin