const express = require("express");
const protect = require("../middlewares/authMiddleware.js");
const {addNotification , deleteNotification} =require("../controllers/notifController.js");

const router = express.Router();

router.post("/add" , protect , addNotification);
router.post("/delete" , protect , deleteNotification);

module.exports = router ;