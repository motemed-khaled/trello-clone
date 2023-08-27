import express from "express";

import { auth as protect } from "../middleWares/auth.middleware";
import { getTasks } from "../controllers/task.controller";


export const router = express.Router({mergeParams:true});

router.get("/", protect, getTasks);