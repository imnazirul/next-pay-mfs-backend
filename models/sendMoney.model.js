import mongoose from "mongoose";

const sendMoneySchema = new mongoose.Schema({
  transactionId: {
    type: String,
    default: () => `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    unique: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Sender is required"],
    index: true,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
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
    min: [50, "Minimum Send Amount is 50"],
  },
  fee: {
    type: Number,
    required: [true, "Fee is required"],
  },
});

export default mongoose.model("SendMoney", sendMoneySchema);
