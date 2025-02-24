import mongoose from "mongoose";

const sendMoneySchema = new mongoose.Schema({
  sender: {
    user_id: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Sender is required"],
    index: true,
  },
  receiver: {
    user_id: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Receiver is required"],
    index: true,
  },
  total: {
    type: Number,
    required: [true, "Total is required"],
    min: [10, "Total must be at least 10"],
  },
  send_amount: {
    type: Number,
    required: [true, "Send amount is required"],
    min: [10, "Send amount must be at least 10"],
  },
  fee: {
    type: Number,
    required: [true, "Fee is required"],
  },
});

export default sendMoneySchema;
