const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    name : {
        type : String ,
        required : true,
    },
    email : {
        type : String ,
        required : true,
        unique : true,
    },
    password : {
        type : String ,
        required : true ,
    },
    pic : {
        type : String ,
        default : "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    } ,
    notifications : [{
        type : mongoose.Schema.Types.ObjectId ,
        ref : "Chat",
    }]
} , {timestamps : true});

userSchema.pre("save" , async function(next){
    const user = this;
    if(!user.isModified("password")){
        return next();
    }

    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(user.password , salt);

    next();

})
// this method should be defined before the model is created otherwise wo ispe lagega kese ?

userSchema.methods.matchPassword= async function(enteredPassword){
    // userSchema.statics.matchPasswordAndGenerateToken -> static method ->This is a method attached to the model, not to individual documents.
    // userSchema.methods.matchPassword -> Instance Method -> This is a method attached to each user document (i.e., instance of the model).
    return await bcrypt.compare(enteredPassword , this.password);
}


const User = mongoose.model("User" , userSchema);



module.exports = User;