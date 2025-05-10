import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL = "https://wrmulptnhbswyebikglj.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndybXVscHRuaGJzd3llYmlrZ2xqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc2MjkwMDYsImV4cCI6MjA1MzIwNTAwNn0.oisfRVLENbj0A2W3GMj4FVQyiNyshR-Exb1xewl6olk"

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);