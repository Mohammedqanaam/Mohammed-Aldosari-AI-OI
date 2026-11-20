const { paypalRequest } = require("../../lib/paypal");

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
      unit.custom_id !== templateId ||
      !capture ||
      capture.status !== "COMPLETED" ||
      !amount ||
      amount.currency_code !== "USD" ||
      amount.value !== "5.00"
    ) {
      return res.status(402).json({ error: "لم يتم تأكيد دفع مكتمل بالقيمة والمنتج الصحيحين." });
    }
    return res.status(200).json({ paid: true, orderID: captured.id, templateId, captureID: capture.id });
  } catch (error) {
    console.error("PayPal capture:", error.message);
    return res.status(error.statusCode || 500).json({ error: "تعذر تأكيد الدفع. إذا تم الخصم، لا تكرر الدفع وتواصل مع الدعم." });
  }
};
