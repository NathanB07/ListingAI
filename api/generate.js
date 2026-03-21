// api/generate.js
// This file lives at: listingai/api/generate.js
// Vercel automatically makes this a serverless function at /api/generate
// Your API key NEVER leaves this file - it never touches the browser

const rateLimit = new Map();

export default async function handler(req, res) {

  // ── 1. CORS — only allow your own domain ──────────────────────────────────
  const allowedOrigins = [
    "https://listingai.co",
    "https://www.listingai.co",
    "https://listing-ai-lake.vercel.app",
    "http://localhost:5173",
    "http://localhost:4173",
  ];

  const origin = req.headers.origin || "";
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  } else {
    // Block requests from unknown origins
    return res.status(403).json({ error: "Forbidden" });
  }

  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // ── 2. Only allow POST ────────────────────────────────────────────────────
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // ── 3. Rate limiting — 10 requests per IP per hour ───────────────────────
  const forwarded = req.headers["x-forwarded-for"];
  const ip = (forwarded ? forwarded.split(",")[0] : req.socket?.remoteAddress) || "unknown";
  const now = Date.now();
  const windowMs = 60 * 60 * 1000; // 1 hour
  const limit = 10;

  const record = rateLimit.get(ip);
  if (record) {
    // Clean up old entries outside the window
    const recent = record.filter(t => now - t < windowMs);
    if (recent.length >= limit) {
      return res.status(429).json({
        error: "Too many requests. Please wait before generating again."
      });
    }
    recent.push(now);
    rateLimit.set(ip, recent);
  } else {
    rateLimit.set(ip, [now]);
  }

  // ── 4. Validate request body ──────────────────────────────────────────────
  const { messages, system, max_tokens } = req.body || {};

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "Missing messages" });
  }
  if (!system || typeof system !== "string") {
    return res.status(400).json({ error: "Missing system prompt" });
  }

  // Cap tokens — prevents someone crafting a huge request to drain your credits
  const safeTokens = Math.min(typeof max_tokens === "number" ? max_tokens : 1000, 1500);

  // ── 5. Call Anthropic — API key stays here on the server ─────────────────
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_KEY,   // ← server env var only
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
