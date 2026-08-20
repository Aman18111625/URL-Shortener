const URL = require("../models/url");
const { isValidUrl } = require("../utils/validation");

async function handleGenerateShortURL(req, res) {
  const body = req.body;

  if (!body.url) {
    return res.status(400).json({ error: "Request body is missing" });
  }

  const redirectUrl = String(body.url).trim();
  if (!isValidUrl(redirectUrl)) {
    return res.status(400).json({ error: "Please provide a valid http or https URL." });
  }

  const { nanoid } = await import("nanoid");
  const shortId = nanoid(8);

  await URL.create({
    shortId,
    redirectUrl,
    visitHistory: [],
    createdBy: req.user._id,
  });

  return res.status(200).json({ shortId });
}

async function handleRedirectToOriginalURL(req, res) {
  const shortId = req.params.id;

  const url = await URL.findOne({ shortId: shortId });

  if (!url) return res.status(404).json({ error: "Short URL not found" });

  url.visitHistory.push({ timestamp: Date.now() });
  await url.save();

  return res.redirect(url.redirectUrl);
}

async function handleGetAnalytics(req, res) {
  const shortId = req.params.id;

  const url = await URL.findOne({ shortId: shortId });

  if (!url) return res.status(404).json({ error: "Short URL not found" });

  return res.status(200).json({
    shortId: url.shortId,
    redirectUrl: url.redirectUrl,
    visitHistory: url.visitHistory,
  });
}

module.exports = {
  handleGenerateShortURL,
  handleRedirectToOriginalURL,
  handleGetAnalytics,
};
