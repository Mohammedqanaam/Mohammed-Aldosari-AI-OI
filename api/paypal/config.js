module.exports = (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  const clientId = process.env.PAYPAL_CLIENT_ID;
  if (!clientId) {
    return res.status(503).json({ configured: false, message: "PayPal credentials are not configured yet." });
  }
  return res.status(200).json({ configured: true, clientId, currency: "USD" });
};
