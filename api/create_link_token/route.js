import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";

export async function POST() {
  try {
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

    const response = await client.linkTokenCreate({
      user: {
        client_user_id: "user-1",
      },
      client_name: "My App",
      products: ["auth", "transactions"],
      country_codes: ["US"],
      language: "en",
    });

    return new Response(JSON.stringify(response.data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: err.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
