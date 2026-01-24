import "dotenv/config";
import { connectDb } from "./config/connection.js";
import express from "express";
import authRouter from "./routes/userRoute.js";

const app = express();
await connectDb();
const PORT = 5000;

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

//   routes 
app.use("/", authRouter)

app.listen(PORT, () => {
  console.log(`index is running on http://localhost:${PORT}`);
});
