const PAYPAL_BASE = process.env.PAYPAL_ENV === "sandbox" ? "https://api-m.sandbox.paypal.com" : "https://api-m.paypal.com";

async function getAccessToken() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_CLIENT_SECRET;
  if (!clientId || !secret) {
    const error = new Error("PayPal is not configured. Add PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET in Vercel Environment Variables.");
    error.statusCode = 503;
    throw error;
  }
  const credentials = Buffer.from(clientId + ":" + secret).toString("base64");
  const response = await fetch(PAYPAL_BASE + "/v1/oauth2/token", {
    method: "POST",
    headers: {
      Authorization: "Basic " + credentials,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: "grant_type=client_credentials"
  });
  const data = await response.json();
  if (!response.ok || !data.access_token) {
    const error = new Error("Unable to authenticate with PayPal.");
    error.statusCode = 502;
    throw error;
  }
  return data.access_token;
}

async function paypalRequest(path, options = {}) {
  const token = await getAccessToken();
  const response = await fetch(PAYPAL_BASE + path, {
    ...options,
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.message || "PayPal request failed.");
    error.statusCode = response.status >= 500 ? 502 : 400;
    throw error;
  }
  return data;
}

module.exports = { paypalRequest };
