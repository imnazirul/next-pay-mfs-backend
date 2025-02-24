import mongoose from "mongoose";
import { DB_URI } from "../config/env";

if (!DB_URI) {
  throw new Error("DB_URI is not defined");
}

const connectToDatabase = async () => {
  try {
    await mongoose.connect(DB_URI);
  } catch (err) {
    console.log("while connecting to database", err);
    process.exit(1);
  }
};

export default connectToDatabase;
