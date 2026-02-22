import { cancelAppointment, deleteAppointment, getAppointment, getSchedule, setSchedule } from "../controllers/doctor.js";
import { authenticateToken } from "../middleware/authenticateToken.js";
import { Router } from "express";

const router= Router()

// set by doctor 
router.post("/schedule" ,authenticateToken ,setSchedule)

//get doctor with schedule
router.get("/schedule",authenticateToken,getSchedule)

// get doctor with appointment 
router.get("/appointments", authenticateToken, getAppointment)

//cancel appointment 
router.post("/cancel-appointment", authenticateToken, cancelAppointment)

// delete appointment

router.delete("/appointment", authenticateToken, deleteAppointment)

export default router