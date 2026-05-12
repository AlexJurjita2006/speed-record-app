import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sgnmqtyckewnzrjsedcc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNnbm1xdHlja2V3bnpyanNlZGNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5MTQ5NjIsImV4cCI6MjA5MzQ5MDk2Mn0.eJ3lvrIK0WOi9DVWhvY8vChfGVUlHoHgNnFcpUqFdss'; // ← aici trebuie cheia ta reală

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
