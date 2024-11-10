const express = require("express");
const app = express();

app.get("/get", async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    const response = await fetch(url);
    const html = await response.text();

    const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
    const title = titleMatch ? titleMatch[1] : "No title found";
    const faviconMatch = html.match(/<link.*?rel=["']icon["'].*?href=["']([^"']+)["']/i);
    let favicon = faviconMatch ? faviconMatch[1] : "";

    if (favicon && !favicon.startsWith("http")) {
      const urlObj = new URL(url);
      favicon = `${urlObj.origin}/${favicon}`;
    }

    res.json({ title, favicon });
  } catch (e) {
    res.status(500).json({ error: e});
  }
});

const PORT = 7777;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
