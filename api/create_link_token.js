import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";

const client = new PlaidApi(
  new Configuration({
    basePath: PlaidEnvironments[process.env.PLAID_ENV || "sandbox"],
    baseOptions: {
      headers: {
        "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID,
        "PLAID-SECRET": process.env.PLAID_SECRET,
      },
    },
  })
);

export default async function handler(req, res) {
  if (req.method === "GET") return res.status(200).json({ ok: true });
  if (req.method !== "POST") return res.status(405).end();

  try {
    const response = await client.linkTokenCreate({
      user: { client_user_id: `web-${Date.now()}` },
      client_name: "Connect Your Bank",
      products: ["auth", "transactions"],
      country_codes: ["US"],
      language: "en",
    });

    return res.status(200).json({ link_token: response.data.link_token });
  } catch (err) {
    return res.status(500).json({
      error: err?.response?.data || err?.message || "Unknown error",
    });
  }
}
