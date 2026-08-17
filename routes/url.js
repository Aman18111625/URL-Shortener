const express = require("express");
const {handleGenerateShortURL, handleRedirectToOriginalURL, handleGetAnalytics} = require("../controllers/url");
const router = express.Router();

const URL = require("../models/url");

router.post("/", handleGenerateShortURL);

router.get("/:id", handleRedirectToOriginalURL);

router.get("/analytics/:id", handleGetAnalytics);

module.exports = router;