import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      required: true,
    },
    password: {
      type: String,
      trim: true,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "doctor", "patient"],
      default: "patient",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

userSchema.virtual("admin", {
  ref: "Admin",
  localField: "_id",
  foreignField: "userId",
  
});
userSchema.virtual("patient", {
  ref: "Patient",
  localField: "_id",
  foreignField: "userId",
  justOne:true
});
userSchema.virtual("doctor", {
  ref: "Doctor",
  localField: "_id",
  foreignField: "userId",
  justOne:true
});

export const User = mongoose.model("User", userSchema);
