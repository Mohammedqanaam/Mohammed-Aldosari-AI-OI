# PayPal setup — تنظيم أعمالك

The storefront uses PayPal Orders v2 with server-side order creation, capture, and payment verification at download time. The browser never receives the PayPal secret.

## Required Vercel environment variables

Add these under Vercel → Project → Settings → Environment Variables, for Production (and Preview if you want to test previews):

- `PAYPAL_CLIENT_ID` — PayPal REST app client ID.
- `PAYPAL_CLIENT_SECRET` — PayPal REST app secret. Keep this encrypted; never paste it into browser code or Git.
- `PAYPAL_ENV` — set to `sandbox` for test transactions, then `live` for real sales. If omitted, the API uses Live.

After changing environment variables, redeploy the project.

## PayPal setup steps

1. Open the PayPal Developer Dashboard and create/select a REST API app for the correct merchant account.
2. Copy the Client ID and Secret from the matching environment (Sandbox or Live).
3. Add the values as Vercel environment variables above.
4. Start with `PAYPAL_ENV=sandbox` and use sandbox buyer and seller accounts to test a complete $5 USD payment.
5. Confirm that a successful capture unlocks only the purchased template and that the download endpoint rejects unpaid, wrong-amount, wrong-currency, or wrong-product orders.
6. After testing, switch to `PAYPAL_ENV=live`, add the Live credentials, and redeploy.

## Payment protection

- The server creates the order with a fixed catalog price of USD 5.00 and a server-controlled product ID.
- The server captures the order after buyer approval.
- The download endpoint asks PayPal for the order and capture details again. It requires a completed USD 5.00 capture matching the requested product.
- The client-side enabled/disabled button is only a user interface. The API endpoint is the actual access control.
- The uploaded workbook is currently inspected in the browser for preview and basic data-quality signals. The file itself is not uploaded or retained by the server, and the purchased standard workbook is generated from the selected template rather than transforming the uploaded workbook.

## Important product scope

The current checkout sells the standard generated templates. Upload analysis is a local preview. Paid custom transformation of a customer's uploaded workbook is not yet offered as an automated service; it needs a separate secure upload pipeline, storage/retention policy, field mapping, and custom quote workflow.

## Reference

- PayPal Orders v2: https://developer.paypal.com/api/orders/v2/
- PayPal REST Orders integration: https://developer.paypal.com/api/rest/integration/orders-api
- PayPal Webhooks: https://developer.paypal.com/api/rest/webhooks/
