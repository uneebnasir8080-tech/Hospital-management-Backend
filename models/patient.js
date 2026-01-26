import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
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
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

patientSchema.virtual("appointment", {
  ref: "Appointment",
  localField: "userId",
  foreignField: "patientId",
});
export const Patient = mongoose.model("Patient", patientSchema);
