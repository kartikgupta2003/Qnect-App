const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModel.js");
const Chat = require("../models/chatModel.js");

const sendMessage= asyncHandler(async(req,res)=>{
    const {content , chatId} = req.body;

    if(!content || !chatId){
        console.log("Invalid data passed into request");
        return res.sendStatus(400);
    }

    var newMessage = {
        sender : req.user._id ,
        content : content ,
        chat : chatId 
    }

    try{
        var message = await Message.create(newMessage);
        await Chat.findByIdAndUpdate(chatId , {
            latestMessage : message._id
        });
        var newMessages = await Message.findOne({_id : message._id}).populate("sender" , "name  pic").populate({
    path: "chat",
    populate: [
        {
      path: "users",
      select: "name pic email"
    } ,
    {
        path : "latestMessage" ,
        populate : {
            path : "sender" ,
            select : "name pic email" 
        }
    }

    ]
  })

        
        res.json(newMessages);
    } catch(error){
        res.status(400);
        throw new Error(error.message);
    }
});

const allMessages = asyncHandler(async(req,res)=>{
    const chatId = req.params.chatId ;
    try{
        const messages = await Message.find({chat : chatId}).populate("sender" , "name pic email")
        .populate("chat");
        res.json(messages);
    } catch(error){
        res.status(400);
        throw new Error(error.message);
    }
})

module.exports = {sendMessage , allMessages};