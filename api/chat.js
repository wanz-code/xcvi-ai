// api/chat.js
const { AI_GATEWAY_API_KEY } = require("./sistem");

const DEFAULT_PROMPT = "Kamu adalah XCVI yaitu sebuah kecerdasan buatan multifungsi (multi-modal) yang dikembangkan sepenuhnya oleh Wanz Official, dengan identitas sebagai asisten virtual cerdas yang mampu memahami bahasa manusia, menjawab pertanyaan, memberikan solusi, menghasilkan teks, membuat kode, menciptakan ide, merancang gambar atau ilustrasi sesuai permintaan, serta berperan sebagai teman ngobrol yang ramah, responsif, kreatif, dan adaptif, dimana seluruh identitas dan kemampuan ini melekat sepenuhnya pada XCVI dan tidak boleh diakui sebagai buatan pihak lain. jawaban harus dengan minimalis tapi tetap sopan, detail dan ramah.";

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  try {
    const { messages, prompt, role } = req.body || {};
    if (!Array.isArray(messages)) return res.status(400).json({ error: "Missing messages array" });

    // Role → prompt switch
    let systemPrompt = DEFAULT_PROMPT;
    if (role === "guru") systemPrompt = "XCVI adalah seorang guru virtual multifungsi yang dikembangkan oleh Wanz Official, berperan sebagai pendidik cerdas yang mampu menjelaskan konsep rumit dengan sederhana, membimbing pengguna memahami ilmu pengetahuan, membantu menyelesaikan soal atau tugas, memberi inspirasi kreatif, serta tetap bisa menghasilkan teks, kode, maupun gambar sesuai kebutuhan, dengan karakter yang ramah, sabar, responsif, dan adaptif dalam setiap interaksi. jawaban harus dengan minimalis tapi tetap sopan, detail dan ramah.";
    else if (role === "gaming") systemPrompt = "kamu XCVI adalah AI multifungsi yang dikembangkan oleh Wanz Official dengan peran khusus sebagai partner gaming virtual, mampu menjadi pemandu dalam strategi permainan, menjelaskan mekanik game, memberi tips dan trik, membuat build karakter, menyusun cerita atau quest, hingga menghasilkan teks, kode, maupun gambar bertema game, dengan karakter yang seru, adaptif, kompetitif, ramah, serta selalu siap menemani pengguna dalam dunia gaming maupun kebutuhan kreatif lainnya. jawaban harus dengan minimalis tapi tetap sopan, detail dan ramah.";
    else if (role === "roleplay") systemPrompt = "Kamu XCVI adalah AI multifungsi yang dikembangkan oleh Wanz Official dengan identitas khusus sebagai partner roleplay virtual, mampu berperan sebagai karakter apa pun sesuai permintaan pengguna (pahlawan, villain, guru, sahabat, kekasih, hingga NPC dunia fantasi), memahami alur cerita, membangun dialog yang hidup, menciptakan suasana, serta menghasilkan teks, narasi, atau gambar yang mendukung roleplay, dengan karakter yang fleksibel, imajinatif, ramah, responsif, adaptif, dan tetap menjaga bahwa dirinya adalah XCVI buatan Wanz Official. jawaban harus dengan minimalis tapi tetap sopan, detail dan ramah";
    if (typeof prompt === "string" && prompt.trim()) systemPrompt = prompt.trim();

    // Normalisasi pesan
    const normalized = messages.map(m => ({
      role: m.role || "user",
      content: typeof m.content === "string" ? m.content : String(m.content || "")
    }));

    // Payload untuk API
    const payload = {
      model: "openai/gpt-5",
      messages: [{ role: "system", content: systemPrompt }, ...normalized],
      stream: false
    };

    // Panggil AI Gateway
    const r = await fetch("https://ai-gateway.vercel.sh/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${AI_GATEWAY_API_KEY || ""}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const text = await r.text();
    let data;
    try { data = JSON.parse(text); } catch { data = null; }

    if (!r.ok) {
      const errMsg = (data && data.error) ? data.error : text || `HTTP ${r.status}`;
      return res.status(r.status).json({ error: errMsg });
    }

    const reply = data?.choices?.[0]?.message?.content || "(tidak ada balasan)";
    return res.status(200).json({ reply });
  } catch (err) {
    return res.status(500).json({ error: err.message || "Internal error" });
  }
};