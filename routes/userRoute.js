import { Router } from "express";
import {
  addPatient,
  chengePassword,
  createAdmin,
  createDoctor,
  createUser,
  deletePatient,
  getAllDoctors,
  getAllPatient,
  getAllUser,
  getUser,
  userLogin,
} from "../controllers/user.js";
import validate from "../middleware/validate.js";
import { createUserSchema } from "../lib/schemas/userSchema.js";
import { authenticateToken } from "../middleware/authenticateToken.js";
import { upload } from "../lib/upload.js";

const router = Router();

router.post("/create", validate(createUserSchema), createUser);
router.post("/login", userLogin);
router.patch("/user/changePassword", authenticateToken, chengePassword);

// patient add
router.post( "/patient", authenticateToken, upload.single("patient"), addPatient,);

// admin added
router.post("/admin", authenticateToken, upload.single("admin"), createAdmin);

// added doctor "/doctor"
router.post("/doctor", authenticateToken, upload.single('doctor'), createDoctor)

// get data with role data "/user"
router.get("/user", authenticateToken, getUser)

//get all user with all roles "/user-all"
router.get("/user-all", authenticateToken, getAllUser)

// get all doctors
router.get("/all-doctors", authenticateToken, getAllDoctors)

// get all patient
router.get("/all-patient", authenticateToken, getAllPatient)

// delete patient 
router.delete("/patient/:id",authenticateToken, deletePatient)

export default router;
