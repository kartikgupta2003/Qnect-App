const User = require("../models/userModel.js");
const asyncHandler = require("express-async-handler"); 

const addNotification = asyncHandler(async (req, res) => {
    const user = req.user;
    const { chatId } = req.body;
    try {
        const updatedUser = await User.findOneAndUpdate(
            { _id: user._id },
            { $addToSet: { notifications: chatId } },
            { new: true }
        ).populate({
    path: "notifications",
    populate: {
      path: "users",
      select: "name pic email",
    },
  });

        res.json(updatedUser);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }

})

const deleteNotification = asyncHandler(async (req, res) => {
    const user = req.user;
    const { chatId } = req.body;
    try {
        const {data}= await User.updateOne({ _id: user._id },
            { $pull: { notifications: chatId } }
        );

        res.status(200).json({ success: true });
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
})

module.exports = { addNotification, deleteNotification };