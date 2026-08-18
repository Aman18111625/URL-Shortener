require("dotenv").config();

const express = require("express");
const { connectToDatabase } = require("./connect");
const ejs = require("ejs");
const path = require("path");
const cookieParser = require("cookie-parser");
const { restrictToLoggedInUserOnly, restrictTo } = require("./middlewares/authMiddleware");
const urlRoutes = require("./routes/url");
const staticRouter = require("./routes/staticRouter");
const userRoutes = require("./routes/user");

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Public routes (no auth required)
app.use("/", userRoutes);

// Protected routes - auth required + role check
app.use("/url", restrictToLoggedInUserOnly, restrictTo(["NORMAL", "ADMIN"]), urlRoutes);
app.use("/", restrictToLoggedInUserOnly, restrictTo(["NORMAL", "ADMIN"]), staticRouter);

async function startServer() {
  if (process.env.MONGODB_URI) {
    await connectToDatabase(process.env.MONGODB_URI);
    console.log("Database connection established");
  } else {
    console.warn("MONGODB_URI is not defined. Starting without database connection.");
  }

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

if (require.main === module) {
  startServer().catch((error) => {
    console.error("Error starting the server:", error);
    process.exit(1);
  });
}

module.exports = { app, startServer };