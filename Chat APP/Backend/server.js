const dotenv = require("dotenv");
const connectDB = require("./config/db.js");
dotenv.config();
connectDB();
const http = require("http");
const express = require('express');
const { Server } = require("socket.io");
const userRoutes = require("./routes/userRoutes.js");
const chatRoutes = require("./routes/chatRoutes.js");
const messageRoutes = require("./routes/messageRoutes.js");
const notifRoutes = require("./routes/notifRoutes.js");
const { notFound, errorHandler } = require("./middlewares/errorMidlleware.js");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");


const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  pingTimeout: 60000,
  // basically ye 60s rukega agar client ki taraf se koi event nahi ata hai to ye 
  // connection ko close kar dega to save bandwidth 
  cors: {
    origin: "http://localhost:3000",
    credentials: true
  }
});

io.on("connection", (socket) => {
  console.log(`${socket.id} connected to socket.io`);

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    console.log(userData._id);
    socket.userData = userData;
    socket.emit("connected");
  })

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User joined room ", room);
  })

  socket.on("new message", (newMessageReceived) => {
    var chat = newMessageReceived.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageReceived.sender._id) return;

      socket.to(user._id).emit("message received", newMessageReceived);
    })

  })

  socket.on("disconnect", () => {
    console.log("user disconnected");
    if (socket.userData?._id) {
      socket.leave(socket.userData._id);
    }
  })
})




app.use(cors({
  origin: "http://localhost:3000",  // ✅ your frontend origin
  credentials: true,                // ✅ allow credentials (cookies)
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api/user', userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/notif", notifRoutes);


// -----------------------------------> deployment
const __dirname1 = path.resolve();
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname1 , '/frontend/build')))
  app.get('*' , (req,res)=>{
    res.sendFile(path.resolve(__dirname1 , "frontend" , "build" , "index.html"));
  })
}
else{
  app.get("/" , (req,res)=>{
    res.send("API is Running Successfully");
  })
}


// --------------------------------------------->
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => { console.log(`Server started at port ${PORT}`) });
