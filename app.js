require("dotenv").config();

const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const { connectToDatabase } = require("./connect");
const { restrictToLoggedInUserOnly, restrictTo } = require("./middlewares/authMiddleware");
const urlRoutes = require("./routes/url");
const staticRouter = require("./routes/staticRouter");
const userRoutes = require("./routes/user");

const app = express();
const PORT = Number(process.env.PORT) || 3000;

if (!process.env.JWT_SECRET && process.env.NODE_ENV === "production") {
  throw new Error("JWT_SECRET must be configured in production.");
}

app.disable("x-powered-by");
app.set("trust proxy", 1);
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
});

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: false, limit: "1mb" }));
app.use(cookieParser());

app.use("/", userRoutes);
app.use("/url", restrictToLoggedInUserOnly, restrictTo(["NORMAL", "ADMIN"]), urlRoutes);
app.use("/", restrictToLoggedInUserOnly, restrictTo(["NORMAL", "ADMIN"]), staticRouter);

async function startServer() {
  if (process.env.NODE_ENV === "production") {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI must be configured in production.");
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET must be configured in production.");
    }
  }

  if (process.env.MONGODB_URI) {
    await connectToDatabase(process.env.MONGODB_URI);
    console.log("Database connection established");
  } else {
    console.warn("MONGODB_URI is not defined. Starting without database connection.");
  }

  return new Promise((resolve) => {
    const server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      resolve(server);
    });
  });
}

if (require.main === module) {
  startServer().catch((error) => {
    console.error("Error starting the server:", error);
    process.exit(1);
  });
}

module.exports = { app, startServer };