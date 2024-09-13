const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const color = require("colors");

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_DB);
        console.log(`MongoDB Connected: ${conn.connection.host}`.cyan);
    } catch (error) {
        console.log(`MongoDB Not connected ${error}`.red);
        process.exit(1);
    }
};

module.exports = connectDB;