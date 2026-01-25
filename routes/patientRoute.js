import { Router } from "express";
import { makeAppointment } from "../controllers/patient.js";
import { authenticateToken } from "../middleware/authenticateToken.js";

const router = Router();


// route for making appointment 
router.post("/appointment", authenticateToken, makeAppointment);

export default router;
