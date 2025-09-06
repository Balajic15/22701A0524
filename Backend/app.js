
const express = require("express");
const bodyParser = require("body-parser");
const loggingMiddleware = require("./middleware/logging");
const shortUrlRoutes = require("./routes/shorturls");
const cors = require("cors");
const controller = require("./controllers/shorturlsController");
const { getAllStats, getStats, createShortUrl, redirectUrl } = require('./controllers/shorturlsController');
const app = express();
app.set("trust proxy", true); 
app.use(bodyParser.json());
app.use(loggingMiddleware);
app.use(cors());  
app.use("/api", shortUrlRoutes);
app.get("/:shortcode", redirectUrl);
app.get('/api/:shortcode/stats', getStats);

app.get('/api/stats', getAllStats);

app.get("/", (req, res) => {
  res.send(`<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><title>HTTP URL Shortener </title></head>
<body style="font-family:system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; margin:40px">
  <h1>HTTP URL Shortener by 22701A0524</h1>
  Using PostMan u can make a trail on it in backend.</p>
  <small>Running on <code>${req.protocol}://${req.get('host')}</code></small>
</body>
</html>`);
});
app.use((req, res, next) => {
  return res.status(404).json({ error: "Not found" });
});
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error is there , please check once ." });
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`server is running on http://localhost:${PORT}`));
