import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://prpkerdbfrabzrnzelan.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBycGtlcmRiZnJhYnpybnplbGFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0MDEzMjAsImV4cCI6MjA3Njk3NzMyMH0.yFY75OmLrQxwHSqomO868CfDX44rJ2sDLmyOuRY7Zyo';

// Create Supabase client with better configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Test connection function
export const testSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.log('Supabase connection error:', error.message);
      return false;
    }
    console.log('Supabase connected successfully');
    return true;
  } catch (error) {
    console.log('Supabase connection failed:', error);
    return false;
  }
};