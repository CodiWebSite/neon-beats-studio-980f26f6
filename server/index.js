import express from "express";
import nodemailer from "nodemailer";

const app = express();
app.use(express.json());

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 465);
  const secure = port === 465; // SSL/TLS
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({ host, port, secure, auth: { user, pass } });
}

app.post("/api/contact", async (req, res) => {
  const { name, email, phone, eventType, date, message } = req.body || {};

  if (!name || !email || !phone || !eventType) {
    return res.status(400).json({ error: "Câmpuri obligatorii lipsă" });
  }

  const transporter = getTransporter();
  if (!transporter) {
    return res.status(500).json({ error: "Server email neconfigurat" });
  }

  const to = process.env.CONTACT_TO || "contact@djfunkyevents.ro";
  const subject = `Solicitare ofertă: ${eventType}${date ? ` – ${date}` : ""}`;

  const text = `Nume: ${name}
Email: ${email}
Telefon: ${phone}
Tip eveniment: ${eventType}
Data: ${date || "-"}

Mesaj:
${message || "-"}`;

  const html = `
    <div style="font-family:system-ui,Segoe UI,Arial,sans-serif;line-height:1.5;color:#111">
      <h2 style="margin:0 0 12px">Solicitare ofertă</h2>
      <p><strong>Nume:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Telefon:</strong> ${phone}</p>
      <p><strong>Tip eveniment:</strong> ${eventType}</p>
      <p><strong>Data:</strong> ${date || "-"}</p>
      <hr style="border:none;border-top:1px solid #ddd;margin:16px 0" />
      <p style="white-space:pre-wrap"><strong>Mesaj:</strong><br/>${(message || "-")}</p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: { name: "Neon Beats – Contact", address: to },
      to,
      replyTo: email,
      subject,
      text,
      html,
    });
    return res.json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: "Eroare trimitere email" });
  }
});

const port = Number(process.env.PORT || 3001);
app.listen(port, () => {
  console.log(`API server on http://localhost:${port}`);
});
