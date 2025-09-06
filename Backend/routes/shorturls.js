const express = require("express");
const router = express.Router();
const {
  createShortUrl,
  redirectUrl,
  getStats,
  getAllStats
} = require("../controllers/shorturlsController");

router.post("/", createShortUrl);

router.get("/stats", getAllStats);

router.get("/:shortcode/stats", getStats);

module.exports = router;
