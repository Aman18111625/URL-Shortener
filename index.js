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

if (process.env.MONGODB_URI) {
  connectToDatabase(process.env.MONGODB_URI)
    .then(() => {
      console.log("Database connection established");
    })
    .catch((error) => {
      console.error("Error connecting to the database:", error);
    });
}

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

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;