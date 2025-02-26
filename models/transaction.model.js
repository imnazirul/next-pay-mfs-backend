import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    kind: {
      type: String,
      required: [true, "Transaction kind is Required"],
      enum: ["SEND_MONEY", "CASH_OUT", "CASH_IN"],
    },
    transactionId: {
      type: String,
      default: () => `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      unique: true,
    },
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Sender is required"],
      index: true,
    },
    to: {
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
    amount: {
      type: Number,
      required: [true, "Send amount is required"],
      min: [50, "Minimum Send Amount is 50"],
    },
    fee: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Transaction", transactionSchema);
