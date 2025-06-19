const express = require("express");
const axios = require("axios");
const app = express();
app.use(express.json());

const consumerKey = "YOUR_CONSUMER_KEY";
const consumerSecret = "YOUR_CONSUMER_SECRET";

const shortcode = "174379"; // Sandbox shortcode
const passkey = "YOUR_PASSKEY";
const callbackUrl = "https://yourdomain.com/callback";
const authUrl =
  "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";

let accessToken = "";

// Get access token
async function getAccessToken() {
  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString(
    "base64"
  );

  const response = await axios.get(authUrl, {
    headers: {
      Authorization: `Basic ${auth}`,
    },
  });

  accessToken = response.data.access_token;
}

app.post("/pay", async (req, res) => {
  const { phone, amount } = req.body;
  await getAccessToken();

  const timestamp = new Date()
    .toISOString()
    .replace(/[-:.TZ]/g, "")
    .slice(0, 14);
  const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString(
    "base64"
  );

  const response = await axios.post(
    "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
    {
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: amount,
      PartyA: phone,
      PartyB: shortcode,
      PhoneNumber: phone,
      CallBackURL: callbackUrl,
      AccountReference: "Order123",
      TransactionDesc: "Payment for a watch",
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  res.json(response.data);
});

app.listen(3000, () => console.log("✅ M-Pesa backend running on port 3000"));
