const crypto = require("crypto");
const { createSession } = require("../../lib/leads");
module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const expected = process.env.ADMIN_PASSWORD || "";
  const secret = process.env.ADMIN_SESSION_SECRET || "";
  const supplied = typeof (req.body || {}).password === "string" ? req.body.password : "";
  if (expected.length < 16 || secret.length < 32) return res.status(503).json({ error: "Admin credentials are not configured." });
  const a = Buffer.from(supplied);
  const b = Buffer.from(expected);
  const valid = a.length === b.length && crypto.timingSafeEqual(a, b);
  if (!valid) return res.status(401).json({ error: "بيانات الدخول غير صحيحة." });
  const token = createSession();
  res.setHeader("Set-Cookie", "admin_session=" + encodeURIComponent(token) + "; HttpOnly; Secure; SameSite=Strict; Path=/api/admin; Max-Age=28800");
  return res.status(200).json({ ok: true });
};
