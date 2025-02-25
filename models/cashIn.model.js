import mongoose from "mongoose";

const cashInSchema = new mongoose.Schema({
  transactionId: {
    type: String,
    default: () => `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    unique: true,
  },
  agent: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Agent is Required"],
    index: true,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Receiver is Required"],
  },
  amount: Number,
});

export default mongoose.model("CashIn", cashInSchema)