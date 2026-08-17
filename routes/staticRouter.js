const express = require("express");
const URL = require("../models/url");

const router = express.Router();

router.get("/", async (req, res) => {
  const allUrls = await URL.find({});
  return res.render("home", { allUrls });
})

router.get("/signup", async (req, res) => {
    return res.render("signup")
})

module.exports = router;