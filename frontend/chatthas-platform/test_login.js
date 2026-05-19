import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://oswimqzfbikzufckvhby.supabase.co';
const supabaseKey = 'sb_publishable_-WFpyqUojnTAl4TRGqhZRA_w2fgWx3j';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testLogin() {
  const email = 'admin@chatthas.pk';
  const password = 'password123'; // Guessing or assuming some simple password
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('Login error:', error.message);
  } else {
    console.log('Login successful for:', data.user.email);
  }
}

testLogin();
