const express = require("express");
const { createUsername } = require("../controllers/userDataController");
const router = express.Router();

router.post("/createUsername", createUsername);

module.exports = router;
