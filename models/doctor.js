import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    profile: {
      type: String,
      default: null,
    },
    specialization: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

export const Patient = mongoose.model("Patient", patientSchema);
