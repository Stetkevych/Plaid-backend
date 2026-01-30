import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";

const plaid = new PlaidApi(
  new Configuration({
    basePath: PlaidEnvironments[process.env.PLAID_ENV || "sandbox"],
    baseOptions: {
      headers: {
        "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID || "",
        "PLAID-SECRET": process.env.PLAID_SECRET || ""
      }
    }
  })
);

export default async function handler(req, res) {
  // ✅ Browser health check
  if (req.method === "GET") {
    return res.status(200).json({
      ok: true,
      env: {
        PLAID_ENV: process.env.PLAID_ENV || null,
        HAS_CLIENT_ID: Boolean(process.env.PLAID_CLIENT_ID),
        HAS_SECRET: Boolean(process.env.PLAID_SECRET)
      }
    });
  }

  // ✅ Must be POST from browser
  if (req.method !== "POST") return res.status(405).end();

  // ✅ Hard fail fast if env vars are missing
  if (!process.env.PLAID_CLIENT_ID || !process.env.PLAID_SECRET) {
    return res.status(500).json({
      error: "Missing PLAID_CLIENT_ID or PLAID_SECRET in Vercel Environment Variables"
    });
  }

  try {
    const response = await plaid.linkTokenCreate({
      user: { client_user_id: `web-${Date.now()}` },
      client_name: "Connect Your Bank",
      products: ["auth", "transactions"],
      country_codes: ["US"],
      language: "en"
    });

    return res.status(200).json({ link_token: response.data.link_token });
  } catch (err) {
    return res.status(500).json({
      error: err?.response?.data || err?.message || "Unknown error"
    });
  }
}
