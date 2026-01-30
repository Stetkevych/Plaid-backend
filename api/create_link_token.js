import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";

const plaidClient = new PlaidApi(
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
  if (req.method !== "POST") return res.status(405).end();

  try {
    const response = await plaidClient.linkTokenCreate({
      user: { client_user_id: "user-1" },
      client_name: "Secure Bank Connection",
      products: ["auth", "transactions"],
      country_codes: ["US"],
      language: "en",
    });

    return res.status(200).json(response.data);
  } catch (err) {
    return res.status(500).json({
      error: err?.response?.data || err?.message || "Unknown error",
    });
  }
}
