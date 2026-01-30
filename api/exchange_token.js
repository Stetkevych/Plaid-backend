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
  if (req.method !== "POST") return res.status(405).end();

  if (!process.env.PLAID_CLIENT_ID || !process.env.PLAID_SECRET) {
    return res.status(500).json({
      error: "Missing PLAID_CLIENT_ID or PLAID_SECRET in Vercel Environment Variables"
    });
  }

  try {
    const { public_token, user_email } = req.body || {};
    if (!public_token) return res.status(400).json({ error: "Missing public_token" });

    const exchange = await plaid.itemPublicTokenExchange({ public_token });

    // NOTE: In production you store access_token server-side (DB).
    return res.status(200).json({
      ok: true,
      item_id: exchange.data.item_id,
      user_email: user_email || null
    });
  } catch (err) {
    return res.status(500).json({
      error: err?.response?.data || err?.message || "Unknown error"
    });
  }
}
