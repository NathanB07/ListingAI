// api/user.js
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
  // FIX 1: Allow x-user-email header
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, x-user-email");
  if (req.method === "OPTIONS") return res.status(200).end();

  const userId = getUserIdFromToken(req.headers.authorization);
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // FIX 2: Read email from header
  const email = req.headers['x-user-email'] || '';

  let { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error && error.code === 'PGRST116') {
    // New user — create
    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert({ id: userId, email, plan: 'free', generation_count: 0, generation_reset_date: new Date().toISOString() })
      .select()
      .single();
    if (createError) return res.status(500).json({ error: 'Failed to create user' });
    user = newUser;
  } else if (!error && user) {
    // FIX 3: Update email if it was empty
    if (!user.email && email) {
      await supabase.from('users').update({ email }).eq('id', userId);
      user.email = email;
    }
  } else if (error) {
    return res.status(500).json({ error: 'Failed to fetch user' });
  }

  return res.status(200).json({ user });
}
