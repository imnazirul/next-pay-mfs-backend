import mongoose from "mongoose";
import SendMoney from "../models/sendMoney.model.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import CashIn from "../models/cashIn.model.js";
import CashOut from "../models/cashOut.model.js";
import BalanceRequest from "../models/balanceRequest.model.js";

const sendMoney = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { receiver_mobile, total, send_amount, fee, pin } = req.body;
    const { _id, mobile } = req.user;

    if (receiver_mobile == mobile) {
      const error = new Error("You Can't Make Transaction in Your Own Account");
      error.statusCode = 404;
      throw error;
    }

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
      { balance: Number(Receiver.balance) + Number(send_amount) },
      { new: true }
    );

    //update admin revenue
    await User.findOneAndUpdate(
      { kind: "ADMIN" },
      { $inc: { balance: Number(fee) } },
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
    const { _id, mobile } = req.user;
    if (receiver_mobile == mobile) {
      const error = new Error("You Can't Make Transaction in Your Own Account");
      error.statusCode = 404;
      throw error;
    }
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
      agent: _id,
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

const cashOut = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { agent_mobile, total, amount, fee, pin } = req.body;
    const { _id, mobile } = req.user;

    if (agent_mobile == mobile) {
      const error = new Error("You Can't Make Transaction in Your Own Account");
      error.statusCode = 404;
      throw error;
    }

    if (amount < 50) {
      const error = new Error("Minimum Cash Out Amount is 50");
      error.statusCode = 404;
      throw error;
    }

    //AGENT CHECK
    const Agent = await User.findOne({ mobile: agent_mobile });
    if (!Agent) {
      const error = new Error("Agent Not Found");
      error.statusCode = 404;
      throw error;
    }
    if (Agent.kind !== "AGENT" || Agent.status !== "ACTIVE") {
      const error = new Error("Please Enter Valid Agent Mobile");
      error.statusCode = 400;
      throw error;
    }

    //BALANCE CHECK
    if (
      Number(total) > Number(req.user.balance) ||
      Number(amount) > Number(req.user.balance)
    ) {
      const error = new Error("Insufficient Balance");
      error.statusCode = 400;
      throw error;
    }

    //PIN CHECK
    const isPinValid = await bcrypt.compare(pin, req.user.pin);
    if (!isPinValid) {
      const error = new Error("Invalid Pin");
      error.statusCode = 403;
      throw error;
    }

    const agent_credit = (1 / 1.5) * fee;
    const admin_credit = (0.5 / 1.5) * fee;

    const newTransaction = new CashOut({
      sender: _id,
      agent: Agent._id,
      total: total,
      amount: amount,
      fee: fee,
      agentCredit: agent_credit,
      adminCredit: admin_credit,
    });

    //update sender balance
    await User.findOneAndUpdate(
      { _id: req.user._id },
      { balance: Number(req.user.balance - total) },
      { new: true }
    );

    //update agent balance
    await User.findOneAndUpdate(
      { _id: Agent._id },
      {
        balance:
          Number(Agent.balance) + (Number(amount) + Number(agent_credit)),
      },
      { new: true }
    );

    // update admin revenue
    await User.findOneAndUpdate(
      { kind: "ADMIN" },
      { $inc: { balance: Number(admin_credit) } },
      { new: true }
    );

    await newTransaction.save({ session });
    await session.commitTransaction();

    session.endSession();

    res.status(201).json({
      success: true,
      message: "Cash Out to Agent Successfully",
      data: newTransaction,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

const GetUserTransactions = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const [sendMoneyTransactions, cashInTransactions, cashOutTransactions] =
      await Promise.all([
        SendMoney.find({ sender: _id }).lean(),
        CashIn.find({ receiver: _id }).lean(),
        CashOut.find({ sender: _id }).lean(),
      ]);

    let Transactions = [
      ...sendMoneyTransactions,
      ...cashInTransactions,
      ...cashOutTransactions,
    ];
    Transactions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    Transactions = Transactions.slice(0, 100);

    res.status(200).json({
      count: Transactions.length,
      success: true,
      message: "All Transactions for Your Account",
      data: Transactions,
    });
  } catch (error) {
    next(error);
  }
};

const GetAllTransactions = async (req, res, next) => {
  try {
    const [sendMoneyTransactions, cashInTransactions, cashOutTransactions] =
      await Promise.all([
        SendMoney.find().lean(),
        CashIn.find().lean(),
        CashOut.find().lean(),
      ]);

    const Transactions = [
      ...sendMoneyTransactions,
      ...cashInTransactions,
      ...cashOutTransactions,
    ];
    Transactions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.status(200).json({
      count: Transactions.length,
      success: true,
      message: "All Transactions Of MFS",
      data: Transactions,
    });
  } catch (error) {
    next(error);
  }
};

const GetTotalMoney = async (req, res, next) => {
  try {
    const total = await User.aggregate([
      {
        $match: { kind: { $in: ["USER", "AGENT"] } },
      },
      {
        $group: {
          _id: null,
          totalBalance: { $sum: "$balance" },
        },
      },
    ]);
    const totalBalance = total.length > 0 ? total[0].totalBalance : 0;
    res.status(200).json({
      success: true,
      message: "Total Balance of Users and Agents",
      total: totalBalance,
    });
  } catch (error) {
    next(error);
  }
};

const RequestBalance = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { _id } = req.user;
    const { amount } = req.body;
    const newRequest = new BalanceRequest({
      from: _id,
      amount: amount,
    });

    newRequest.save({ session });
    session.commitTransaction();

    session.endSession();

    res.status(201).json({
      success: true,
      message: "Balance Request to Admin Created Successfully",
      data: newRequest,
    });
  } catch (error) {
    session.abortTransaction();
    session.endSession();
    next(error);
  }
};

const PatchRequestBalance = async (req, res, next) => {
  try {
    const { status } = req.body;
    const { id } = req.params;
    const RB = await BalanceRequest.findOneAndUpdate(
      { _id: id },
      { status: status },
      { new: true, runValidators: true }
    );

    if (!RB) {
      res.status(404).json({ success: false, message: "Not Found" });
    }

    if (RB?.status == "APPROVED") {
      const user = await User.findOneAndUpdate(
        { _id: RB.from },
        { $inc: { balance: Number(RB.amount) } },
        { new: true }
      );

      return res.status(200).json({
        success: true,
        message: "Request Balance Approved",
        data: user,
      });
    }
    res.status(422).json({
      success: false,
      message: "Something Went Wrong",
    });
  } catch (error) {
    next(error);
  }
};

const GetBalanceRequest = async (req, res, next) => {
  try {
    const BR = await BalanceRequest.find().lean();
    res
      .status(200)
      .json({ success: true, message: "All Balance Requests", data: BR });
  } catch (error) {
    next(error);
  }
};

const GetUserRequestBalance = async(req, res, next)=>{
try {
  const {_id} = req.user
  const userBR = await BalanceRequest.find({from: _id}).lean()

  res.status(200).json({
    success:true,
    message: "All User Balance Request",
    data: userBR
  })
} catch (error) {
  next(error)
}
}

export {
  sendMoney,
  cashIn,
  cashOut,
  GetUserTransactions,
  GetAllTransactions,
  GetTotalMoney,
  RequestBalance,
  PatchRequestBalance,
  GetBalanceRequest,
  GetUserRequestBalance
};
