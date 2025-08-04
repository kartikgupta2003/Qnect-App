const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");


const accessChat = asyncHandler(async(req,res)=>{
    const {userId} = req.body ;

    if(!userId){
        console.log("UserId param not sent with request");
        return res.sendStatus(400);
        // It's shorthand for: res.status(code).send(statusText)
        // Same as res.status(401).send("Unauthorized")
    }
    
    var isChat = await Chat.find({
        isGroupChat : false ,
        $and : [
            {users : {$elemMatch : {$eq : req.user._id}}},
            {users : {$elemMatch : {$eq : userId}}},
        ]
    }).populate("users" ,"-password")
    .populate("latestMessage")
    .populate({
        path : "latestMessage.sender",
        select: "name pic email"
    });
    // latestMessage already hum populate kar chuke hai 
    // latestMessage me ab message docs pade hai to unke andar hamare pass sender field hoga
    // us sender field ko populate kardo

    if(isChat.length >0){
        res.send(isChat[0]);
        // obviously it is going tobe only one document
    }

    else{
        var chatData = {
            chatName : "sender" ,
            isGroupChat : false ,
            users : [req.user._id , userId],
        };
        try{
            const createdChat = await Chat.create(chatData);
            // why didn't we use insertOne bcz it is a native MongoDb method , not part of Mongoose's model API
            const FullChat = await Chat.findById(createdChat._id).populate("users" , "-password")
            // FindById is shorthand for findOne so it also returns a single doc

            res.status(200).send(FullChat);
        }
        catch(error){
            res.status(400);
            throw new Error(error.message);
        }
    }
})


const fetchChats = asyncHandler( async(req,res)=>{
    try{
        const allChats = await Chat.find({users : {$elemMatch : {$eq : req.user._id}}})
        .populate("users" , "-password")
        .populate("groupAdmin" , "-password")
        .populate("latestMessage")
        .populate({
            path : "latestMessage.sender" ,
            select : "name pic email",
        })
        .sort({updatedAt : -1});
        res.status(200).send(allChats);
    }
    catch(error){
        res.status(400);
        throw new Error(error.message);
    }
})


const createGroupChats = asyncHandler(async(req,res)=>{
    if(!req.body.users || !req.body.name){
        return res.status(400).send({message : "Please fill all the fields"});
    }
    var users = req.body.users;

    if(users.length < 2){
        return res.status(400).send("More than 2 users are required to form a group chat");
    }

    users.push(req.user);

    try{
        const groupChat = await Chat.create({
            chatName : req.body.name ,
            users : users ,
            isGroupChat : true,
            groupAdmin : req.user,
        });

        const fullGroupChat = await Chat.findOne({
            _id : groupChat._id
        })
        .populate("users" , "-password")
        .populate("groupAdmin" , "-password");

        res.status(200).json(fullGroupChat);
    }
    catch(error){
        res.status(400);
        throw new Error(error.message);
    }
})


const renameGroup = asyncHandler(async(req,res)=>{
    const {chatId , newChatName} = req.body ;
    const updatedChat = await Chat.findOneAndUpdate({_id : chatId} , {$set : {chatName : newChatName}} , {new : true})
    .populate("users" , "-password")
    .populate("groupAdmin" , "-password");
    // updateOne doesn't return back the document 
    // this new: true → returns the updated document (not the old one)

    if(!updatedChat){
        res.status(400);
        throw new Error("Chat not found");
    }
    else{
        res.json(updatedChat);
    }
})

const addToGroup = asyncHandler(async(req,res)=>{
    const {chatId , userId} = req.body ;
    const added = await Chat.findOneAndUpdate({_id : chatId} ,{
        $push : {users : userId}} ,
        {new : true},
    )
    .populate("users" , "-password")
    .populate("groupAdmin" , "-password")

    if(!added){
        res.status(400);
        throw new Error("Chat not found");
    }
    else{
        res.json(added);
    }
})

const removeFromGroup = asyncHandler(async(req,res)=>{
    const {chatId , userId} = req.body ;
    const removed = await Chat.findOneAndUpdate({_id : chatId} ,{
        $pull : {users : userId}} ,
        {new : true},
    )
    .populate("users" , "-password")
    .populate("groupAdmin" , "-password")

    if(!removed){
        res.status(400);
        throw new Error("Chat not found");
    }
    else{
        res.json(removed);
    }
})

module.exports = {accessChat , fetchChats , createGroupChats , renameGroup , addToGroup , removeFromGroup};