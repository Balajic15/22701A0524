const urls = new Map();
exports.has = (shortcode) => urls.has(shortcode);
exports.add = (originalUrl, shortcode, validityMinutes) => {
  const now = new Date();
  const expiry = new Date(now.getTime() + validityMinutes * 60000);
  const newUrl = {
    shortcode,
    originalUrl,
    createdAt: now.toISOString(),
    expiry: expiry.toISOString(),
    clicks: []
  };
  urls.set(shortcode, newUrl);
  return newUrl;
};
exports.getByShortcode = (shortcode) => {
  return urls.get(shortcode);
};
exports.incrementClicks = (shortcode, clickData) => {
  const url = urls.get(shortcode);
  if (url) {
    url.clicks.push(clickData);
  }
};
exports.getAll = () => {
  return Array.from(urls.values());
};
