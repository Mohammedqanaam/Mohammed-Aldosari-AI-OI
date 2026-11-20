const { paypalRequest } = require("../../lib/paypal");
const { supabase } = require("../../lib/leads");

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const { orderID, templateId } = req.body || {};
    if (typeof orderID !== "string" || !/^[A-Z0-9-]{8,80}$/i.test(orderID)) {
      return res.status(400).json({ error: "Invalid PayPal order." });
    }
    let captured = await paypalRequest("/v2/checkout/orders/" + encodeURIComponent(orderID), { method: "GET" });
    if (captured.status !== "COMPLETED") {
      captured = await paypalRequest("/v2/checkout/orders/" + encodeURIComponent(orderID) + "/capture", { method: "POST", body: "{}" });
    }
    const unit = captured.purchase_units && captured.purchase_units[0];
    const capture = unit && unit.payments && unit.payments.captures && unit.payments.captures[0];
    const amount = capture && capture.amount;
    if (
      captured.status !== "COMPLETED" ||
      !unit ||
      (templateId === "cv" ? !/^cv-[a-f0-9]{64}$/i.test(unit.custom_id || "") : unit.custom_id !== templateId) ||
      !capture ||
      capture.status !== "COMPLETED" ||
      !amount ||
      amount.currency_code !== "USD" ||
      amount.value !== "5.00"
    ) {
      return res.status(402).json({ error: "لم يتم تأكيد دفع مكتمل بالقيمة والمنتج الصحيحين." });
    }
    if (templateId === "cv" && typeof unit.invoice_id === "string" && /^[0-9a-f-]{36}$/i.test(unit.invoice_id)) {
      try {
        await supabase("customer_leads?id=eq." + encodeURIComponent(unit.invoice_id), {
          method: "PATCH", headers: { Prefer: "return=minimal" },
          body: JSON.stringify({ status: "paid", last_activity_at: new Date().toISOString() })
        });
      } catch (leadError) { console.error("CV payment lead update failed", leadError.message); }
    }
    return res.status(200).json({ paid: true, orderID: captured.id, templateId, resumeHash: templateId === "cv" ? unit.custom_id.slice(3) : null, captureID: capture.id, leadId: unit.invoice_id || null });
  } catch (error) {
    console.error("PayPal capture:", error.message);
    return res.status(error.statusCode || 500).json({ error: "تعذر تأكيد الدفع. إذا تم الخصم، لا تكرر الدفع وتواصل مع الدعم." });
  }
};
