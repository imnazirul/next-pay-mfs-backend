import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      minLength: [3, "Name must be at least 3 characters"],
      maxLength: [50, "Name must be at most 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Please fill a valid email address",
      ],
    },
    mobile: {
      type: String,
      required: [true, "Mobile is required"],
      trim: true,
      // match: [/^[6-9]\d{9}$/, "Please fill a valid mobile number"],
    },
    nid: {
      type: String,
      required: [true, "NID is required"],
      trim: true,
      // match: [/^[0-9]{10}$/, "Please fill a valid NID"],
    },
    kind: {
      type: String,
      required: [true, "Kind is required"],
      enum: ["AGENT", "USER"],
      default: "USER",
    },
    pin: {
      type: String,
      required: [true, "PIN is required"],
      minLength: 5
    },
    token: {
      type: String,
      default: "",
    },
    balance: {
      type: Number,
    },
    status: {
      type: String,
      enum: ["PENDING", "ACTIVE", "CANCELLED"]
    }
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  if (this.isNew) {
    this.balance = this.kind === "AGENT" ? 100000 : 40;
    this.status = this.kind === "AGENT" ? "PENDING" : "ACTIVE";
  }
  next();
});

export default mongoose.model("User", userSchema);
