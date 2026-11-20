const { supabase, verifySession } = require("../../lib/leads");
module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  if (!verifySession(req)) return res.status(401).json({ error: "Unauthorized" });
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const id = typeof (req.body || {}).id === "string" ? req.body.id : "";
  if (!/^[0-9a-f-]{36}$/i.test(id)) return res.status(400).json({ error: "Invalid lead ID" });
  try {
    await supabase("customer_leads?id=eq." + encodeURIComponent(id), {
      method: "PATCH",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({ marketing_consent: false, marketing_channels: [], marketing_revoked_at: new Date().toISOString() })
    });
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("marketing opt-out failed", error.message);
    return res.status(503).json({ error: "تعذر تحديث حالة الموافقة." });
  }
};
