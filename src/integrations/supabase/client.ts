import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vttozwaoksrlgqlimilt.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0dG96d2Fva3NybGdxbGltaWx0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2MDM1NjUsImV4cCI6MjA2NjE3OTU2NX0.iR5SICaRKGdkO5-NXo0hZZgJjck3VNX-yDv56A-KBH4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);