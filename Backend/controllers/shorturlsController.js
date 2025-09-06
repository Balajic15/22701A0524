const urlStore = require("../models/urlStore");
const crypto = require("crypto");

function generateShortCode() {
  let attempt = 0;
  while (attempt < 5) {
    const code = crypto.randomBytes(3).toString("hex");
    if (!urlStore.has(code)) return code;
    attempt++;
  }
  return Date.now().toString(36);
}

function isvalidurl(str) {
  try {
    const u = new URL(str);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch (e) {
    return false;
  }
}

function isvalidshortcode(code) {
  return typeof code === "string" && /^[a-zA-Z0-9]+$/.test(code) && code.length >= 4 && code.length <= 20;
}

function coarsegeofromip(ip) {
  if (!ip) return "unknown";
  if (ip === "::1" || ip === "127.0.0.1") return "local";
  if (ip.startsWith("10.") || ip.startsWith("192.168.") || ip.startsWith("172.16.")) return "private";
  return "unknown";
}
exports.createShortUrl = (req, res) => {
  try {
    const { url, validity = 30, shortcode } = req.body || {};

    if (!url || typeof url !== "string" || !isvalidurl(url)) {
      return res.status(400).json({ error: "Invalid URL. Provide a valid http/https URL string." });
    }

    if (shortcode && urlStore.has(shortcode)) {
      return res.status(409).json({ error: "Shortcode already exists" });
    }

    const minutes = Number.isFinite(validity) ? validity : Number(validity);
    const code = shortcode || generateShortCode();

    const newUrl = urlStore.add(url, code, minutes);
    const shortLink = `${req.protocol}://${req.get("host")}/${newUrl.shortcode}`;

    return res.status(201).json({ shortLink, expiry: newUrl.expiry });
  } catch (err) {
    console.error("createShortUrl error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.getStats = (req, res) => {
  try {
    const { shortcode } = req.params;
    const data = urlStore.getByShortcode(shortcode);

    if (!data) return res.status(404).json({ error: "Shortcode not found" });

    const lastClick = data.clicks.length > 0 ? data.clicks[data.clicks.length - 1].timestamp : null;
    const source = data.clicks.length > 0 ? data.clicks[data.clicks.length - 1].referrer : null;

    return res.json({
      totalClicks: data.clicks.length,
      originalUrl: data.originalUrl,
      createdAt: data.createdAt,
      expiry: data.expiry,
      lastClick,
      source,
      clicks: data.clicks
    });
  } catch (err) {
    console.error("getStats error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.getAllStats = (req, res) => {
  try {

    const allUrls = urlStore.getAll().map(u => ({
      shortLink: `${req.protocol}://${req.get("host")}/${u.shortcode}`, // must exist
      originalUrl: u.originalUrl,
      expiry: u.expiry,
      totalClicks: u.clicks.length,
      lastClick: u.clicks.length ? u.clicks[u.clicks.length - 1].timestamp : null,
      source: u.clicks.length ? u.clicks[u.clicks.length - 1].referrer : null,
      clicks: u.clicks
    }));

    res.json(allUrls);
  } catch (err) {
    console.error("getAllStats error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.redirectUrl = (req, res) => {
  try {
    const { shortcode } = req.params;
    const data = urlStore.getByShortcode(shortcode);

    if (!data) return res.status(404).json({ error: "Shortcode not found" });
    if (new Date() > new Date(data.expiry)) return res.status(410).json({ error: "Link expired" });

    const ipRaw = req.ip || req.connection?.remoteAddress || "";
    const ip = Array.isArray(ipRaw) ? ipRaw[0] : ipRaw;

    urlStore.incrementClicks(shortcode, {
      timestamp: new Date().toISOString(),
      referrer: req.get("Referer") || "direct",
      ip,
      location: coarsegeofromip(ip)
    });

    return res.redirect(data.originalUrl);
  } catch (err) {
    console.error("redirectUrl error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
