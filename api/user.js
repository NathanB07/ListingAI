// api/user.js
// Gets or creates a user record in Supabase
// Called when user signs in to get their plan and generation count

import { createClient } from '@supabase/supabase-js';
import { getAuth } from '@clerk/express';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  // CORS
  const allowedOrigins = [
    "https://listingai.dev",
    "https://www.listingai.dev",
    "https://listingai.co",
    "https://listing-ai-lake.vercel.app",
    "http://localhost:5173",
    "http://localhost:4173",
  ];
  const origin = req.headers.origin || "";
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "GET" && req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Get Clerk user from token
  const { userId } = getAuth(req);
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Get or create user in Supabase
  let { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error && error.code === 'PGRST116') {
    // User doesn't exist yet - create them
    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert({
        id: userId,
        email: req.body?.email || '',
        plan: 'free',
        generation_count: 0,
        generation_reset_date: new Date().toISOString()
      })
      .select()
      .single();

    if (createError) {
      console.error('Error creating user:', createError);
      return res.status(500).json({ error: 'Failed to create user' });
    }
    user = newUser;
  } else if (error) {
    console.error('Error fetching user:', error);
    return res.status(500).json({ error: 'Failed to fetch user' });
  }

  return res.status(200).json({ user });
}
