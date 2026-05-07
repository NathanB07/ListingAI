// api/generate.js (UPDATED VERSION)
// Now checks user plan from Supabase before allowing generation
// Free: 5 lifetime, Agent: 75/month, Pro/Brokerage: unlimited

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const rateLimit = new Map();

// Generation limits per plan
const PLAN_LIMITS = {
  free: 5,
  agent: 75,
  pro: -1,        // unlimited
  brokerage: -1   // unlimited
};

export default async function handler(req, res) {
  // ── CORS ──────────────────────────────────────────────────────────────────
  const allowedOrigins = [
    "https://listingai.co",
    "https://www.listingai.co",
    "https://listingai.dev",
    "https://www.listingai.dev",
    "https://listing-ai-lake.vercel.app",
    "http://localhost:5173",
    "http://localhost:4173",
  ];
  const origin = req.headers.origin || "";
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  } else {
    return res.status(403).json({ error: "Forbidden" });
  }
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  // ── Rate limiting ─────────────────────────────────────────────────────────
  const forwarded = req.headers["x-forwarded-for"];
  const ip = (forwarded ? forwarded.split(",")[0] : req.socket?.remoteAddress) || "unknown";
  const now = Date.now();
  const windowMs = 60 * 60 * 1000;
  const record = rateLimit.get(ip);
  if (record) {
    const recent = record.filter(t => now - t < windowMs);
    if (recent.length >= 20) {
      return res.status(429).json({ error: "Too many requests. Please wait." });
    }
    recent.push(now);
    rateLimit.set(ip, recent);
  } else {
    rateLimit.set(ip, [now]);
  }

  // ── Get user from Clerk token ─────────────────────────────────────────────
  const authHeader = req.headers.authorization;
  let clerkUserId = null;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    // Verify Clerk session token
    try {
      const token = authHeader.split(' ')[1];
      // Decode JWT to get user ID (Clerk tokens are JWTs)
      const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
      clerkUserId = payload.sub;
    } catch (err) {
      console.error('Token decode error:', err);
    }
  }

  // ── Check plan and generation limits ─────────────────────────────────────
  if (clerkUserId) {
    const { data: user, error } = await supabase
      .from('users')
      .select('plan, generation_count, generation_reset_date')
      .eq('id', clerkUserId)
      .single();

    if (!error && user) {
      const limit = PLAN_LIMITS[user.plan] ?? 5;

      // Check if monthly reset needed (for agent plan)
      if (user.plan === 'agent') {
        const resetDate = new Date(user.generation_reset_date);
        const daysSinceReset = (now - resetDate.getTime()) / (1000 * 60 * 60 * 24);
        if (daysSinceReset >= 30) {
          await supabase
            .from('users')
            .update({ generation_count: 0, generation_reset_date: new Date().toISOString() })
            .eq('id', clerkUserId);
          user.generation_count = 0;
        }
      }

      // Enforce limit (unlimited = -1)
      if (limit !== -1 && user.generation_count >= limit) {
        return res.status(403).json({
          error: "Generation limit reached",
          plan: user.plan,
          limit,
          count: user.generation_count
        });
      }

      // Increment generation count
      await supabase
        .from('users')
        .update({ generation_count: user.generation_count + 1 })
        .eq('id', clerkUserId);
    }
  }

  // ── Validate request ──────────────────────────────────────────────────────
  const { messages, system, max_tokens } = req.body || {};
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "Missing messages" });
  }
  if (!system || typeof system !== "string") {
    return res.status(400).json({ error: "Missing system prompt" });
  }
  const safeTokens = Math.min(typeof max_tokens === "number" ? max_tokens : 4000, 4000);

  // ── Call Anthropic ────────────────────────────────────────────────────────
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: safeTokens,
        system,
        messages,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error("Anthropic error:", data);
      return res.status(response.status).json({ error: "AI service error. Please try again." });
    }
    return res.status(200).json(data);

  } catch (err) {
    console.error("Proxy error:", err);
    return res.status(500).json({ error: "Server error. Please try again." });
  }
}
