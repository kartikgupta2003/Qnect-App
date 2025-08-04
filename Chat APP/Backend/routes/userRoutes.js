const express = require("express");
const { registerUser, authUser, allUsers } = require("../controllers/userController.js");
const protect = require("../middlewares/authMiddleware.js");

const router = express.Router();

router.get("/validate", protect, (req, res) => {
    res.status(200).json({ message: "Token valid" });
})
router.post("/", registerUser);
router.post("/login", authUser);
router.get("/", protect, allUsers);
router.post("/logout", (req, res) => {
    res.clearCookie("uid", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
    });
    res.status(200).json({message : "Logged Out Successfully"});
})

module.exports = router;