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
      default: null,
      unique: true,
      sparse: true // allows multiple null values
    },
    entryTime: {
        type: Date,
        default: null // set when ticket is scanned
      }
  },
  {
    timestamps: true
  }
);
registrationSchema.pre("save", function (next) {
  if (this.isModified("status") && this.status === "approved" && !this.ticketId) {
    this.ticketId = uuidv4();
  }
  next();
});

const Registration = mongoose.model("Registration", registrationSchema);

export default Registration;
