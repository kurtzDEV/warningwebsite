
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://knsuygwxuoqbkdpzdcqd.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtuc3V5Z3d4dW9xYmtkcHpkY3FkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxMDExNjcsImV4cCI6MjA3MDY3NzE2N30.BoanuIdIIdZJKxunsQfwA9MWCJg6DUYyD_O91QFEqo4";

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
      debug: false,
    },
    global: {
      headers: {
        'X-Client-Info': 'warningweb-app',
      },
    },
  }
);
