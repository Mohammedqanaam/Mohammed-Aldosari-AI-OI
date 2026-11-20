const { supabase } = require("../lib/leads");

const clean = (v, n) => typeof v === "string" ? v.trim().slice(0, n) : "";
module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const body = req.body || {};
    const nameAr = clean(body.nameAr, 90);
    const phone = clean(body.phone, 20);
    const email = clean(body.email, 160).toLowerCase();
    if (!nameAr || (!phone && !email) || body.dataConsent !== true) return res.status(400).json({ error: "بيانات التواصل وموافقة المعالجة مطلوبة." });
    if (phone && !/^\+?[0-9\s()-]{8,20}$/.test(phone)) return res.status(400).json({ error: "رقم الجوال غير صالح." });
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: "البريد الإلكتروني غير صالح." });
    const now = new Date().toISOString();
    const rows = await supabase("customer_leads", {
      method: "POST",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({
        name_ar: nameAr, phone: phone || null, email: email || null,
        data_consent: true, data_consent_at: now, data_consent_version: "2026-11-20-v1",
        marketing_consent: body.marketingConsent === true,
        marketing_consent_at: body.marketingConsent === true ? now : null,
        source: "cv-builder", status: "started", last_activity_at: now
      })
    });
    return res.status(201).json({ ok: true, id: rows && rows[0] && rows[0].id });
  } catch (error) {
    console.error("lead capture failed", error.message);
    return res.status(503).json({ error: "خدمة حفظ بيانات التواصل غير مفعّلة حالياً." });
  }
};
