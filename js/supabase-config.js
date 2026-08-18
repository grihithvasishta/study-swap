/* ===================================================
   StudySwap — Supabase Configuration & Client
   =================================================== */

const SUPABASE_CONFIG = {
  url: 'https://trhoixblmzpgpoowtovr.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRyaG9peGJsbXpwZ3Bvb3d0b3ZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcwNjI1MDEsImV4cCI6MjEwMjYzODUwMX0.--ZLYjRy7zAtBgI6iJy5Yo4UiCqV7Crl0UDI8eEmW3Y'
};

// Initialize Supabase Client
let supabaseClient = null;

function getSupabaseClient() {
  if (!supabaseClient && window.supabase && SUPABASE_CONFIG.url && SUPABASE_CONFIG.anonKey) {
    try {
      supabaseClient = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
      console.log('[StudySwap] Supabase client connected successfully.');
    } catch (err) {
      console.warn('[StudySwap] Supabase initialization failed:', err);
    }
  }
  return supabaseClient;
}
