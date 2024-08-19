import mongoose from "mongoose";

export default async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGOURL);
    console.log(`Connected successfully to mongodb `.bgGreen.white);
  } catch (error) {
    console.log(`Error Connecting to MongoDb ${error}`.bgRed.white);
  }
};