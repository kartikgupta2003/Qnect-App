const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

const protect = asyncHandler( async(req , res , next)=>{
    const tokenCookieValue = req.cookies?.uid;
    if(!tokenCookieValue){
        res.status(401);
        throw new Error("Not authorized , no token");
    }
    try{
        const decoded = jwt.verify(tokenCookieValue , process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password");
        next();
    }
    catch(error){
        res.status(401);
        throw new Error("Not authorized , token failed");
    }
})

module.exports = protect;