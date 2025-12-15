import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true
    },

    date: {
      type: Date,
      required: true
    },

    venue: {
      type: String,
      required: true
    },

    ticketLimit: {
      type: Number,
      default: 0 
    },
    totalRegister:{
      type: Number,
      default: 0 
    },
    approvalMode: {
      type: String,
      enum: ["auto", "manual"],
      default: "auto"
    }
  },
  {
    timestamps: true
  }
);

const Event = mongoose.model("Event", eventSchema);

export default Event;
