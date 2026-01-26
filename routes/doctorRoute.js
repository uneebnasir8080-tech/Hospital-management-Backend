import { getAppointment, getSchedule, setSchedule } from "../controllers/doctor.js";
import { authenticateToken } from "../middleware/authenticateToken.js";
import { Router } from "express";

const router= Router()

// set by doctor 
router.post("/schedule" ,authenticateToken ,setSchedule)

//get doctor with schedule
router.get("/schedule",authenticateToken,getSchedule)

// get doctor with appointment 
router.get("/appointments", authenticateToken, getAppointment)

export default router