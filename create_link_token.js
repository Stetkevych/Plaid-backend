// api/create_link_token.js
import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";

const config = new Configuration({
  basePath: PlaidEnvironments.sandbox, // change to "development" or "production" later
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID,
      "PLAID-SECRET": process.env.PLAID_SECRET,
    },
  },
});

const client = new PlaidApi(config);

export default async function handler(req, res) {
  try {
    const response = await client.linkTokenCreate({
      user: {
        client_user_id: "user-id-123", // just a unique id for your user
      },
      client_name: "My Plaid App",
      products: ["transactions"],
      country_codes: ["US"],
      language: "en",
    });

    res.status(200).json({ link_token: response.data.link_token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create link token" });
  }
}
