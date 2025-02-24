import mongoose from "mongoose";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/env.js";

const signUp = async (req, res, next) => {
  console.log(req.body)
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { name, email, mobile, kind, pin, nid } = req.body;
    const existingUser = await User.findOne({
      email: email,
      mobile: mobile,
      nid: nid,

    });
    if (existingUser) {
      const error = new Error("User already exists");
      error.statusCode = 409;
      throw error;
    }

    //hash pin
    const salt = await bcrypt.genSalt(10);
    const hashedPin = await bcrypt.hash(pin, salt);
    const newUser = await User.create(
      { name, email, mobile, kind, pin: hashedPin, nid },
      { session }
    );
    const token = jwt.sign({ email: newUser[0].email }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    //save token in the database
    newUser.token = token;
    await newUser.save({ session });

    await session.commitTransaction();
    session.endSession();

    res
      .status(201)
      .json({
        success: true,
        message: "User Created Successfully",
        data: { token, user: newUser },
      });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

export { signUp };
