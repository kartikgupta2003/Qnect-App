const express= require("express");
const protect = require("../middlewares/authMiddleware");
const {accessChat , fetchChats , createGroupChats , renameGroup , addToGroup , removeFromGroup}= require("../controllers/chatController"); 

const router = express.Router();

router.post("/" , protect , accessChat);
router.get("/"  , protect , fetchChats);
router.post("/group" , protect , createGroupChats);
router.put("/rename" , protect , renameGroup);
router.put("/groupremove" , protect , removeFromGroup);
router.put("/groupadd" , protect , addToGroup);

module.exports = router;
