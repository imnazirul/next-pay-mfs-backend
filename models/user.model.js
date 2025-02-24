import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    minLength: [3, "Name must be at least 3 characters"],
    maxLength: [50, "Name must be at most 50 characters"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    trim: true,
    lowercase: true,
    match: [
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Please fill a valid email address",
    ],
  },
  mobile: {
    type: String,
    required: [true, "Mobile is required"],
    trim: true,
    // match: [/^[6-9]\d{9}$/, "Please fill a valid mobile number"],
  },
  nid: {
    type: String,
    required: [true, "NID is required"],
    trim: true,
    // match: [/^[0-9]{10}$/, "Please fill a valid NID"],
  },
  kind: {
    type: String,
    required: [true, "Kind is required"],
    enum: ["AGENT", "USER", "ADMIN"],
    default: "USER",
  },
  pin: {
    type: String,
    required: [true, "PIN is required"],
  },
  token: {
    type: String,
    default: ""
  }
}, {timestamps: true});



export default mongoose.model("User", userSchema);