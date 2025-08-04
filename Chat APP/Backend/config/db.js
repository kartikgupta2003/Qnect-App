const mongoose = require("mongoose");

const connectDB = async() =>{
    try{
        console.log(process.env.MONGO_URI);
        const conn = await mongoose.connect(process.env.MONGO_URI);
        

        console.log(`MongoDb Connected : ${conn.connection.host}`);
        // conn.connection.host: The hostname of the MongoDB server that Mongoose connected to. For Atlas, it might be something like cluster0.kue3kqt.mongodb.net For local, it could be localhost
    }
    catch(error){
        console.log(`Error : ${error.message}`);
        process.exit(1);
        // process.exit(); Terminates the Node.js process immediately. By default, exits with code 0 (success), but you should usually use 1 for errors:
    }
}

module.exports= connectDB;