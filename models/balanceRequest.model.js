import mongoose from "mongoose";

const balanceRequestModel = new mongoose.Schema(
  {
    kind: {
      type: String,
      default: "BALANCE_REQUEST",
    },
    requestId: {
      type: String,
      default: () => `REQ-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      unique: true,
    },
    from: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["APPROVED", "DECLINED", "PENDING"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

export default mongoose.model("BalanceRequest", balanceRequestModel);
