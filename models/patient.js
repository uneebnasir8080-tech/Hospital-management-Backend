import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    profile: {
      type: String,
      default: null,
    },
    history: {
      type: String,
      default: null,
    },
    blood: {
      type: String,
      default: null,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

export const Doctor = mongoose.model("Doctor", doctorSchema);
