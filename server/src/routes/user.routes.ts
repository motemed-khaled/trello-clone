import express from "express";

import { register , login , getCurrentUser } from "../controllers/user.controller";
import { registerValidation, loginValidation } from "../utils/validation/user.validation";
import { auth as protect } from "../middleWares/auth.middleware";


export const router = express.Router();

router.post("/register", registerValidation, register);
router.post("/login", loginValidation, login);

router.get("/", protect, getCurrentUser);