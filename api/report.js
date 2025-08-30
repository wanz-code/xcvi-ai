// api/report.js
const { BOT_TOKEN, CHAT_ID } = require("./sistem");

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  try {
    const { title, body } = req.body || {};
    if (!title || !body) return res.status(400).json({ error: "Missing title or body" });

    const msg = `📢 *Laporan Baru dari web XCVI*\n\n*Judul:* ${title}\n*Isi:* ${body}`;

    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: CHAT_ID, text: msg, parse_mode: "Markdown" })
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: err.message || "Internal error" });
  }
};