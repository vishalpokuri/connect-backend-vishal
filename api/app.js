require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const connectDB = require("./config/db");
const verifyToken = require("./middleware/authMiddleware");

// Routes
const authRoutes = require("./routes/authRoutes");
const socialMediaRoutes = require("./routes/socialMediaRoutes");
const userPhotoRoutes = require("./routes/userPhotoRoutes");

const app = express();

connectDB();

app.use(
  cors({
    origin: "*",
  })
);
// hello {-_-}
app.use(bodyParser.json());

app.use("/api/auth", authRoutes);
app.use("/api/sociallinks", socialMediaRoutes);
app.use("/api/userphoto", userPhotoRoutes);

app.get("/api/protected", verifyToken, (req, res) => {
  res.json({
    message: "You have accessed a protected route!",
    userId: req.userId,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
