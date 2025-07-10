import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';
import { env } from './env';

if (!env.supabase.url || !env.supabase.anonKey) {
  throw new Error('Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env file.');
}

export const supabase = createClient<Database>(env.supabase.url, env.supabase.anonKey);

// Helper function to create a new user
export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        email: email,
      },
    },
  });

  if (error) {
    throw error;
  }

  return data;
}

// Helper function to sign in
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  return data;
}