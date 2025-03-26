const express = require("express");
const router = express.Router();
const { getfitnessplan } = require("../controllers/chatbotController");
const { getDietplan } = require("../controllers/chatbotController");

router.post("/fitness-plan", getfitnessplan);
router.post("/diet-plan", getDietplan);

module.exports = router;
