import mongoose from "mongoose";

const MONGODB_URL = process.env.DATABASE_URL;

if (!MONGODB_URL) {
  throw new Error("❌ MONGODB environment variable not defined");
}

export async function connectDb() {
  if (mongoose.connection.readyState >= 1) {
    console.log("✅ MongoDB already connected");
  }
  await mongoose.connect(MONGODB_URL, {
    dbName: "hospital-management",
  });
  console.log("✅ MongoDB connected");
}
