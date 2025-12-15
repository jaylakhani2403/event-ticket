import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      unique: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isNew) return next();

  const lastUser = await this.constructor.findOne().sort({ id: -1 });
  this.id = lastUser ? lastUser.id + 1 : 1;
  next();
});

const User = mongoose.model("User", userSchema);

export default User;
