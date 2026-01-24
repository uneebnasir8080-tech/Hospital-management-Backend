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

export const Patient = mongoose.model("Patient", patientSchema);
