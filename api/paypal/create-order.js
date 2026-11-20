const { paypalRequest } = require("../../lib/paypal");

const PRODUCTS = {
  cv: "ATS Resume Builder - Professional CV",
  customers: "Premium Customer & Order Tracker",
  sales: "Sales & Targets Tracker",
  leads: "CRM & Leads Tracker",
  commissions: "Commissions & Team KPI Tracker",
  tasks: "Tasks & Projects Tracker",
  hr: "HR & Attendance Tracker",
  procurement: "Procurement & Vendors Tracker",
  documents: "Administrative Transactions Tracker",
  budget: "Budget & Expenses Tracker",
  invoices: "Invoices & Collections Tracker",
  cashflow: "Cash Flow Tracker",
  inventory: "Inventory Control Tracker",
  maintenance: "Maintenance & Assets Tracker",
  quality: "Quality & Operations Tracker",
  reservations: "Hotel Reservations & Front Office Tracker",
  guestservice: "Guest Service & Complaints Tracker",
  callcenter: "Call Center & Agent Performance Tracker"
};

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const { templateId, resumeHash } = req.body || {};
    if (!Object.prototype.hasOwnProperty.call(PRODUCTS, templateId) || (templateId === "cv" && (typeof resumeHash !== "string" || !/^[a-f0-9]{64}$/i.test(resumeHash)))) {
      return res.status(400).json({ error: "Please select a valid template." });
    }
    const order = await paypalRequest("/v2/checkout/orders", {
      method: "POST",
      headers: { "PayPal-Request-Id": "excel-" + require("crypto").randomUUID() },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [{
          reference_id: templateId,
          custom_id: templateId === "cv" ? "cv-" + resumeHash.toLowerCase() : templateId,
          description: PRODUCTS[templateId],
          amount: { currency_code: "USD", value: "5.00" }
        }],
        application_context: {
          brand_name: "تنظيم أعمالك",
          user_action: "PAY_NOW",
          shipping_preference: "NO_SHIPPING"
        }
      })
    });
    return res.status(200).json({ id: order.id });
  } catch (error) {
    console.error("PayPal create order:", error.message);
    return res.status(error.statusCode || 500).json({ error: error.statusCode === 503 ? error.message : "تعذر إنشاء عملية الدفع. حاول مجدداً." });
  }
};
