const express = require("express");
const urlRoutes = require("./routes/url");
const { connectToDatabase } = require("./connect");
const ejs = require("ejs");
const path = require("path");
const staticRouter = require("./routes/staticRouter");

const app = express();
const PORT = 3000;

connectToDatabase("mongodb://localhost:27017/url-shortener")
.then(() => {
  console.log("Database connection established");
})
.catch((error) => {
  console.error("Error connecting to the database:", error);
});

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/url", urlRoutes);

app.use("/", staticRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});