import mongoose from "mongoose";

const cashOutSchema = new mongoose.Schema({
  transactionId: {
    type: String,
    default: () => `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    unique: true,
  },
  agent: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Agent is Required"],
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Sender is Required"],
  },
  amount: {
    type: Number,
    required: true,
    min: 50,
  },
  total: {
    type: Number,
    required: true,
    min: 50,
  },
  fee: {
    type: Number,
    required: true,
  },
  agentCredit: {
    type: Number,
    required: true,
  },
  adminCredit: {
    type: Number,
    required: true,
  },
});

export default mongoose.model("CashOut", cashOutSchema);
