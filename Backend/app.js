const express = require("express");
const bodyParser = require("body-parser");
const loggingMiddleware = require("./middleware/logging");
const shortUrlRoutes = require("./routes/shorturls");
const cors = require("cors");
const { redirectUrl } = require('./controllers/shorturlsController');
const app = express();
app.set("trust proxy", true);
app.use(bodyParser.json());
app.use(loggingMiddleware);
app.use(cors());
app.use("/api", shortUrlRoutes);
app.get("/:shortcode", redirectUrl);
app.get("/", (req, res) => {
  res.send(`<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><title>AffordMed URL Shortener</title></head>
<body style="font-family:system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; margin:40px">
  <h1>URL Shortener by 22701A0524</h1>
  <p>Use Postman to test the API endpoints.</p>
  <small>Running on <code>${req.protocol}://${req.get('host')}</code></small>
</body>
</html>`);
});
app.use((req, res) => {
  return res.status(404).json({ error: "Not found" });
});
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
