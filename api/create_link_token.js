import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";

const client = new PlaidApi(
  new Configuration({
    basePath: PlaidEnvironments[process.env.PLAID_ENV],
    baseOptions: {
      headers: {
        "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID,
        "PLAID-SECRET": process.env.PLAID_SECRET,
      },
    },
  })
);

export default async function handler(req, res) {
  const response = await client.linkTokenCreate({
    user: { client_user_id: "user-id-123" },
    client_name: "Your App",
    products: ["auth", "transactions"],
    country_codes: ["US"],
    language: "en",
  });

  res.json(response.data);
}
