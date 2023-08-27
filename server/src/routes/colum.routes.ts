import express from "express";

import { auth as protect } from "../middleWares/auth.middleware";
import { getColumsValidation } from "../utils/validation/colum.validation";
import { getColums } from "../controllers/colum.controller";


export const router = express.Router({mergeParams:true});

router.get("/", protect, getColumsValidation, getColums);