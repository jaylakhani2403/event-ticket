import mongoose from "mongoose";

import dotenv from "dotenv";

dotenv.config();


const url = process.env.MONGODB_URI  || "mongodb+srv://jaylakhani2404:jay123@cluster0.rz6dq61.mongodb.net/";

const dbconfig = async () => {
  try {
    await mongoose.connect(url, {
      dbName: "event-tic",
    });

    console.log("Connected successfully");
  } catch (error) {
    console.error("Connection error:", error);
    process.exit(1);
  }
};

export default dbconfig;
