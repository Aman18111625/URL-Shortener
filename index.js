const express = require("express");
const urlRoutes = require("./routes/url");
const { connectToDatabase } = require("./connect");
const app = express();
const PORT = 3000;

connectToDatabase("mongodb://localhost:27017/url-shortener")
.then(() => {
  console.log("Database connection established");
})
.catch((error) => {
  console.error("Error connecting to the database:", error);
});

app.use(express.json());

app.use("/url", urlRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});