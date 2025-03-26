const mongoose = require('mongoose');
require('dotenv').config();

const connectDb = async () => {
    try {
        console.log([process.env.MONGO_URI])
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });  
        console.log("MongoDB Connected...");
    } catch (err) {
        console.error("Failed to connect to MongoDB", err);
        process.exit(1);  
    }
};

module.exports = connectDb;