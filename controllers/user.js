const User = require("../models/user");
const { setUser, comparePassword } = require("../service/auth");
const { isValidEmail } = require("../utils/validation");

async function handleUserSignUp(req, res) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).render("signup", {
      error: "Name, email, and password are required.",
    });
  }

  const normalizedName = String(name).trim();
  const normalizedEmail = String(email).trim().toLowerCase();

  if (normalizedName.length < 2) {
    return res.status(400).render("signup", {
      error: "Name must contain at least 2 characters.",
    });
  }

  if (!isValidEmail(normalizedEmail)) {
    return res.status(400).render("signup", {
      error: "Please provide a valid email address.",
    });
  }

  if (typeof password !== "string" || password.length < 8) {
    return res.status(400).render("signup", {
      error: "Password must be at least 8 characters long.",
    });
  }

  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    return res.status(409).render("signup", {
      error: "An account with this email already exists.",
    });
  }

  await User.create({
    name: normalizedName,
    email: normalizedEmail,
    password,
  });

  return res.redirect("/login");
}

async function handleLogin(req, res) {
  const { email, password } = req.body;
  const normalizedEmail = String(email || "").trim().toLowerCase();

  const user = await User.findOne({ email: normalizedEmail }).select("+password");
  if (!user) {
    return res.status(401).render("login", {
      error: "Invalid Credentials",
    });
  }

  const passwordMatches = await comparePassword(password, user.password);
  if (!passwordMatches) {
    return res.status(401).render("login", {
      error: "Invalid Credentials",
    });
  }

  const token = setUser(user);
  res.cookie("uuid", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });

  return res.redirect("/");
}

module.exports = {
  handleUserSignUp,
  handleLogin,
};
