import { Router } from "express";
import { chengePassword, createAdmin, createUser, userLogin } from "../controllers/user.js";
import validate from "../middleware/validate.js";
import { createUserSchema } from "../lib/schemas/userSchema.js";
import { authenticateToken } from "../middleware/authenticateToken.js";



const router= Router()


router.post('/create', validate(createUserSchema), createUser)
router.post("/login", userLogin)
router.patch("/user/changePassword",authenticateToken ,chengePassword)



router.post("/user/admin", createAdmin)


export default router