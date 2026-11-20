const crypto = require("crypto");

function config() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Lead database is not configured.");
  return { url: url.replace(/\/$/, ""), key };
}

async function supabase(path, options = {}) {
  const { url, key } = config();
  const response = await fetch(url + "/rest/v1/" + path, {
    ...options,
    headers: {
      apikey: key,
      Authorization: "Bearer " + key,
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });
  const body = await response.text();
  let data = null;
  try { data = body ? JSON.parse(body) : null; } catch (_) {}
  if (!response.ok) throw new Error((data && data.message) || "Database request failed.");
  return data;
}

function sign(value) {
  return crypto.createHmac("sha256", process.env.ADMIN_SESSION_SECRET).update(value).digest("base64url");
}
function createSession() {
  const expires = String(Date.now() + 8 * 60 * 60 * 1000);
  const payload = expires + "." + crypto.randomBytes(16).toString("hex");
  return payload + "." + sign(payload);
}
function verifySession(req) {
  const raw = (req.headers.cookie || "").split(";").map(x => x.trim()).find(x => x.startsWith("admin_session="));
  if (!raw || !process.env.ADMIN_SESSION_SECRET) return false;
  const token = decodeURIComponent(raw.slice("admin_session=".length));
  const parts = token.split(".");
  if (parts.length !== 3 || Number(parts[0]) < Date.now()) return false;
  const payload = parts[0] + "." + parts[1];
  const expected = sign(payload);
  const a = Buffer.from(parts[2]);
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
module.exports = { supabase, createSession, verifySession };
