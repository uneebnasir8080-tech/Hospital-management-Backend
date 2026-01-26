import { Router } from "express";
import { getAppointment, makeAppointment } from "../controllers/patient.js";
import { authenticateToken } from "../middleware/authenticateToken.js";

const router = Router();


// route for making appointment 
router.post("/appointment", authenticateToken, makeAppointment);

// get Appointments with patient "/appointment"
router.get("/appointment", authenticateToken,getAppointment)

export default router;
