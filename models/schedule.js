import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    days: {
      type: [String],
      enum: ["mon", "tue", "wed", "thr", "fri", "sat", "sun"],
      required: true,
    },
    slotDuration: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export const Schedule = mongoose.model("Schedule", scheduleSchema);
