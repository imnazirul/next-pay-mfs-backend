import mongoose from "mongoose";
import User from "../models/user.model.js";

const signUp = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { name, email, mobile, kind, pin, nid } = req.body;
    console.log(name, email, mobile, kind, pin, nid);
    const existingUser = await User.finOne({
      email: email,
      mobile: mobile,
      nid: nid,
    });
    if (existingUser) {
      const error = new Error("User already exists");
      error.statusCode = 409;
      throw error;
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

export { signUp };
