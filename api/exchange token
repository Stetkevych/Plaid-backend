// api/exchange_token.js
import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";
import { subMonths, formatISO } from "date-fns";
import sgMail from "@sendgrid/mail";

// Configure Plaid
const config = new Configuration({
  basePath: PlaidEnvironments.sandbox, // switch to development/production later
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID,
      "PLAID-SECRET": process.env.PLAID_SECRET,
    },
  },
});

const plaidClient = new PlaidApi(config);

// Configure SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export default async function handler(req, res) {
  try {
    const { public_token, email } = req.body;

    if (!public_token || !email) {
      return res.status(400).json({ error: "Missing public_token or email" });
    }

    // 1️⃣ Exchange public_token for access_token
    const tokenResponse = await plaidClient.itemPublicTokenExchange({
      public_token,
    });

    const access_token = tokenResponse.data.access_token;

    // 2️⃣ Get last 3 months of transactions
    const startDate = formatISO(subMonths(new Date(), 3), { representation: "date" });
    const endDate = formatISO(new Date(), { representation: "date" });

    const transactionsResponse = await plaidClient.transactionsGet({
      access_token,
      start_date: startDate,
      end_date: endDate,
    });

    const transactions = transactionsResponse.data.transactions;

    // 3️⃣ Format transactions for email
    const emailBody = transactions
      .map(t => `${t.date} | ${t.name} | $${t.amount}`)
      .join("\n");

    // 4️⃣ Send email
    await sgMail.send({
      to: email,
      from: "statements@yourapp.com", // replace with a verified sender
      subject: "Your Bank Statements (Last 3 Months)",
      text: emailBody,
    });

    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err.response?.data || err);
    res.status(500).json({ error: "Failed to process bank data" });
  }
}
