const { supabase, verifySession } = require("../../lib/leads");
module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  if (!verifySession(req)) return res.status(401).json({ error: "Unauthorized" });
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
  try {
    const rows = await supabase("customer_leads?select=id,name_ar,phone,email,marketing_consent,marketing_channels,marketing_consent_at,source,status,created_at,last_activity_at&order=created_at.desc&limit=500");
    const now = Date.now();
    const leads = (rows || []).map(row => ({
      ...row,
      pipeline_status: row.status === "paid" ? "paid" : (row.status === "started" && now - new Date(row.last_activity_at || row.created_at).getTime() > 60 * 60 * 1000 ? "abandoned" : row.status)
    }));
    return res.status(200).json({ leads });
  } catch (error) {
    console.error("admin leads read failed", error.message);
    return res.status(503).json({ error: "تعذر تحميل بيانات العملاء." });
  }
};
