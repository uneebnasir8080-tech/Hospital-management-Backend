import { setSchedule } from "../controllers/schedule.js";
import { authenticateToken } from "../middleware/authenticateToken.js";
import { Router } from "express";

const router= Router()

// set by doctor 
router.post("/schedule" ,authenticateToken ,setSchedule)

export default router