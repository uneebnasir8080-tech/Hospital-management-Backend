import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    profile: {
      type: String,
      default: null,
    },
    specialization: {
      type: String,
      required: true,
    },
    experience: {
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
