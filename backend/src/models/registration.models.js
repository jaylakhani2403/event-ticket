import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const registrationSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending"
    },
    ticketId: {
      type: String,
      unique: true,
      sparse: true,
      default: null
    },
    entryTime: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

registrationSchema.pre("save", function () {
  if (this.isModified("status") && this.status === "approved" && !this.ticketId) {
    this.ticketId = uuidv4();
  }
});

const Registration = mongoose.model("Registration", registrationSchema);

export default Registration;
