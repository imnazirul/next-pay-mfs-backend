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
      return res.status(400).json({ message: "User already exists" });
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

export { signUp };
