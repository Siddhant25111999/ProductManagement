// app/routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/adminController");

// Admin Dashboard
router.get("/", dashboardController.dashboard);

module.exports = router;
