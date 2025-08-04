const asyncHandler = require("express-async-handler");
const User = require("../models/userModel.js");
const generateToken = require("../config/generateToken.js");

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, pic } = req.body;
    if (!name || !email || !password) {
        res.status(400);
        throw new Error("Please Enter all the fileds");
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error("User already exists");
    }
    let notifications=[]
    const user = await User.create({
        name,
        email,
        password,
        pic,
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            notifications : user.notifications
        })
    }
    else {
        res.status(400);
        throw new Error("Failed to create the user");
    }
})


const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).populate({
    path: "notifications",
    populate: {
      path: "users",
      select: "name pic email",
    },
  });

    if (user && (await user.matchPassword(password))) {
        const token = generateToken(user._id);
        res.cookie("uid", token , {
            httpOnly: true,
            secure: false, 
            sameSite: "lax" ,
        });
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            notifications : user.notifications,
        });
    }
    else {
        throw new Error("Invalid Email or Password");
    }
})

// /api/user?search=kartik&lastname=gupta in order to access this query part req.query is used juts like for dynamic variables req.params is used
const allUsers = asyncHandler(async (req, res) => {
    const keyword = req.query.search ? {
        $or: [
            { name: { $regex: `${req.query.search}`, $options: "i" } },
            { email: { $regex: `${req.query.search}`, $options: "i" } },
        ]
    } : {}
    // console.log(keyword);
    // [Object: null prototype] { search: 'kartik', lastname: 'gupta' }
    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
    res.send(users);
})
module.exports = { registerUser, authUser, allUsers };