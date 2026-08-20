const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const secret = process.env.JWT_SECRET;

if (!secret) {
  throw new Error("JWT_SECRET is not defined. Set it in your environment before starting the server.");
}

function setUser(user) {
  return jwt.sign(
    {
      _id: user._id,
      email: user.email,
      role: user.role,
    },
    secret,
    { expiresIn: "7d" },
  );
}

function getUser(token) {
  if (!token) return null;
  return jwt.verify(token, secret);
}

async function hashPassword(password) {
  if (!password || typeof password !== "string") {
    throw new Error("Password is required");
  }

  return bcrypt.hash(password, 12);
}

async function comparePassword(password, hash) {
  if (!password || !hash) {
    return false;
  }

  return bcrypt.compare(password, hash);
}

module.exports = {
  setUser,
  getUser,
  hashPassword,
  comparePassword,
};
