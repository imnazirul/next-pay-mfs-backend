import mongoose from "mongoose";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/env.js";

const signUp = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { name, email, mobile, kind, pin, nid } = req.body;
    const existingUser = await User.findOne({
      $or: [{ email }, { mobile }, { nid }],
    });

    if (existingUser) {
      const error = new Error("User already exists");
      error.statusCode = 409;
      throw error;
    }

    //hash pin
    const hashedPin = await bcrypt.hash(pin, 10);
    const newUser = new User({
      name,
      email,
      mobile,
      kind,
      pin: hashedPin,
      nid,
    });
    await newUser.save({ session });
    const token = jwt.sign({ email: newUser.email }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });
    await User.findOneAndUpdate(
      { _id: newUser._id },
      { token: token },
      { new: true }
    ).select("-pin")

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
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

const signIn = async (req, res, next) => {
  try {
    const { identifier, pin } = req.body;
    const user = await User.findOne({
      $or: [{ email: identifier }, { mobile: identifier }],
    });
    if (!user) {
      const error = new Error("User Not Found");
      error.statusCode = 404;
      throw error;
    }
    if (user.token) {
      const error = new Error("User Already Logged in with another device");
      error.statusCode = 403;
      throw error;
    }

    const isPasswordValid = await bcrypt.compare(pin, user.pin);

    if (!isPasswordValid) {
      const error = new Error("Invalid Password");
      error.statusCode = 401;
      throw error;
    }
    const token = jwt.sign({ email: user.email }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    const updateUserToken = await User.findOneAndUpdate(
      { _id: user._id },
      { token: token },
      { new: true }
    ).select("-pin")

    res.status(200).json({
      success: true,
      message: "User signed in successfully",
      data: {
        token,
        user: updateUserToken,
      },
    });
  } catch (err) {
    next(err);
  }
};

const signOut = async (req, res, next) => {
  try {
    const { identifier, pin } = req.body;
    const user = await User.findOne({
      $or: [{ email: identifier }, { mobile: identifier }],
    });
    if (!user) {
      const error = new Error("User Not Found");
      error.statusCode = 404;
      throw error;
    }
    const isPasswordValid = await bcrypt.compare(pin, user.pin);

    if (!isPasswordValid) {
      const error = new Error("Invalid Password");
      error.statusCode = 401;
      throw error;
    }
    // eslint-disable-next-line no-unused-vars
    const updateUserToken = await User.findOneAndUpdate(
      { _id: user._id },
      { token: "" },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Signed Out Successfully",
    });
  } catch (err) {
    next(err);
  }
};

export { signUp, signIn, signOut };
