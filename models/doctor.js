import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    profile: {
      type: String,
      default: null,
    },
    age: {
      type: String,
      default: null,
    },
    specialization: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required:true,
    },
    experience: {
      type: String,
      required: true,
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

doctorSchema.virtual("schedule", {
  ref: "Schedule",
  localField: "userId",
  foreignField: "doctorId",
  justOne:true
});

doctorSchema.virtual("appointment", {
  ref: "Appointment",
  localField: "_id",
  foreignField: "doctorId",
});
export const Doctor = mongoose.model("Doctor", doctorSchema);
