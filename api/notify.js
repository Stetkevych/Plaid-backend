import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const { user_email, item_id } = req.body || {};
    if (!user_email) return res.status(400).json({ error: "Missing user_email" });
    if (!item_id) return res.status(400).json({ error: "Missing item_id" });

    const to = process.env.NOTIFY_EMAIL_TO;
    const from = process.env.NOTIFY_EMAIL_FROM;
    if (!to || !from) return res.status(500).json({ error: "Missing notify env vars" });

    await resend.emails.send({
      from,
      to,
      subject: `New bank connection: ${user_email}`,
      html: `<p><strong>User:</strong> ${user_email}</p><p><strong>Item ID:</strong> ${item_id}</p>`
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: err?.message || "Email failed" });
  }
}
