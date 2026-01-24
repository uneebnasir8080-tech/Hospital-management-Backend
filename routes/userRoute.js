import { Router } from "express";
import { createAdmin, createUser, userLogin } from "../controllers/user.js";
import validate from "../middleware/validate.js";
import { createUserSchema } from "../lib/schemas/userSchema.js";



const router= Router()


router.post('/create', validate(createUserSchema), createUser)
router.post("/login", userLogin)
router.post("/user/admin", createAdmin)


export default router