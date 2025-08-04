const mongoose = require("mongoose");

const chatModel = new mongoose.Schema({
    
        chatName : {
            type : String ,
            trim : true,
            // When a string is saved to the database, trim: true automatically removes any leading and trailing whitespace from the value.
            // Eg:- "     Hello Group     " -> gets saved to "Hello Group"
        },

        isGroupChat : {
            type : Boolean ,
            default : false,
        } ,
        users : [
            {
                type : mongoose.Schema.Types.ObjectId,
                ref : "User",            
            }
        ] ,
        latestMessage : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Message",
        } ,
        groupAdmin : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",  
        }
} , {timestamps : true});

const Chat = mongoose.model("Chat" , chatModel);

module.exports = Chat;