export default async function handler(req, res) {
  let bodyData = null;
  try {
    if (req.method !== "GET" && req.method !== "HEAD" && req.method !== "OPTIONS") {
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      const raw = Buffer.concat(chunks).toString();
      bodyData = raw ? JSON.parse(raw) : null;
    }
  } catch {
    bodyData = null;
  }

  const target = "https://taskflow-api.istad.co" + req.url.replace("/api/proxy", "");

  try {
    const response = await fetch(target, {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
        ...(req.headers.authorization ? { Authorization: req.headers.authorization } : {}),
      },
      body: req.method === "GET" || req.method === "HEAD" || req.method === "OPTIONS"
        ? undefined
        : JSON.stringify(bodyData),
    });

    const text = await response.text();

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

    if (req.method === "OPTIONS") return res.status(200).end();

    res.status(response.status).send(text);
  } catch (err) {
    console.error("❌ Proxy error:", err);
    res.status(500).json({ message: "Proxy request failed", error: err.message });
  }
}
