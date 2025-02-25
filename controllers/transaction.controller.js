import mongoose from "mongoose";
import SendMoney from "../models/sendMoney.model.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import CashIn from "../models/cashIn.model.js";

const sendMoney = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { receiver_mobile, total, send_amount, fee, pin } = req.body;
    const { _id } = req.user;

    if (send_amount < 50) {
      const error = new Error("Minimum Send Amount is 50");
      error.statusCode = 404;
      throw error;
    }

    const Receiver = await User.findOne({ mobile: receiver_mobile });
    if (!Receiver) {
      const error = new Error("Receiver Not Found");
      error.statusCode = 404;
      throw error;
    }
    if (
      Number(total) > Number(req.user.balance) ||
      Number(send_amount) > Number(req.user.balance)
    ) {
      const error = new Error("Insufficient Balance");
      error.statusCode = 400;
      throw error;
    }

    const isPinValid = await bcrypt.compare(pin, req.user.pin);

    if (!isPinValid) {
      const error = new Error("Invalid Pin");
      error.statusCode = 403;
      throw error;
    }

    const newTransaction = new SendMoney({
      sender: _id,
      receiver: Receiver._id,
      total: total,
      send_amount: send_amount,
      fee: fee,
    });

    //update sender balance
    await User.findOneAndUpdate(
      { _id: req.user._id },
      { balance: Number(req.user.balance - total) },
      { new: true }
    );

    //update receiver balance
    await User.findOneAndUpdate(
      { _id: Receiver._id },
      { balance: Number(req.user.balance) + Number(total) },
      { new: true }
    );

    await newTransaction.save({ session });
    await session.commitTransaction();

    session.endSession();

    res.status(201).json({
      success: true,
      message: "Send Money to Receiver Successfully",
      data: newTransaction,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

const cashIn = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { receiver_mobile, amount, pin } = req.body;
    const { _id } = req.user;

    if (amount < 10) {
      const error = new Error("Minimum Cash In Amount is 10");
      error.statusCode = 404;
      throw error;
    }

    const Receiver = await User.findOne({ mobile: receiver_mobile });
    if (!Receiver) {
      const error = new Error("Receiver Not Found");
      error.statusCode = 404;
      throw error;
    }
    if (Number(amount) > Number(req.user.balance)) {
      const error = new Error("Insufficient Balance");
      error.statusCode = 400;
      throw error;
    }

    const isPinValid = await bcrypt.compare(pin, req.user.pin);

    if (!isPinValid) {
      const error = new Error("Invalid Pin");
      error.statusCode = 403;
      throw error;
    }

    //create transaction
    const newTransaction = new CashIn({
      sender: _id,
      receiver: Receiver._id,
      amount: amount,
      agent: _id
    });

    //update sender balance
    await User.findOneAndUpdate(
      { _id: req.user._id },
      { balance: Number(req.user.balance - amount) },
      { new: true }
    );

    //update receiver balance
    await User.findOneAndUpdate(
      { _id: Receiver._id },
      { balance: Number(Receiver.balance) + Number(amount) },
      { new: true }
    );

    await newTransaction.save({ session });
    await session.commitTransaction();

    session.endSession();

    res.status(201).json({
      success: true,
      message: "Cash In to Receiver Successfully",
      data: newTransaction,
    });
  } catch (error) {
    session.abortTransaction();
    session.endSession();
    next(error);
  }
};

export { sendMoney, cashIn };
