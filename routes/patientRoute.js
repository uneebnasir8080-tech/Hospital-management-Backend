import { Router } from "express";
import { getAllAppointment, getAppointment, makeAppointment } from "../controllers/patient.js";
import { authenticateToken } from "../middleware/authenticateToken.js";

const router = Router();


// route for making appointment 
router.post("/appointment", authenticateToken, makeAppointment);

// get single Appointments with patient and doctor details "/appointment"
router.get("/appointment", authenticateToken,getAppointment)

// get all Appointments with patient and doctor details "/appointment"
router.get("/all-appointment", authenticateToken,getAllAppointment)

export default router;
