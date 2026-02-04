import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://tvqxofmmxvptbzlhcwnr.supabase.co";
const SUPABASE_PUBLISHABLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2cXhvZm1teHZwdGJ6bGhjd25yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4MDIwODgsImV4cCI6MjA3NDM3ODA4OH0.iiD6TM19HWJxclUPp_9MK1YDdu_O002pd1iXZiU8524";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
});
