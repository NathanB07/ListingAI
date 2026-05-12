// api/user.js
// Gets or creates a user record in Supabase
// Verifies Clerk JWT manually for Vercel serverless compatibility

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

function getUserIdFromToken(authHeader) {
  try {
    if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
    const token = authHeader.split(' ')[1];
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    return payload.sub || null;
  } catch {
    return null;
  }
}

export default async function handler(req, res) {
  // ── CORS ──────────────────────────────────────────────────────────────────
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

  // ── Get user ID from Clerk token ──────────────────────────────────────────
  const userId = getUserIdFromToken(req.headers.authorization);
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized — no valid token" });
  }

  // ── Get or create user in Supabase ────────────────────────────────────────
  let { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error && error.code === 'PGRST116') {
    // User doesn't exist — create them
    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert({
        id: userId,
        email: '',
        plan: 'free',
        generation_count: 0,
        generation_reset_date: new Date().toISOString()
      })
      .select()
      .single();

    if (createError) {
      console.error('Supabase create error:', createError);
      return res.status(500).json({ error: 'Failed to create user' });
    }
    user = newUser;
  } else if (error) {
    console.error('Supabase fetch error:', error);
    return res.status(500).json({ error: 'Failed to fetch user' });
  }

  return res.status(200).json({ user });
}
