import express from "express";

import { getUserBoards, createBoard , getBoard } from "../controllers/board.controller";
import { createBoardValidation ,getBoardValidation } from "../utils/validation/board.validation";
import { auth as protect } from "../middleWares/auth.middleware";
import { router as columRoutes } from "./colum.routes";
import { router as taskRoutes } from "./task.routes";


export const router = express.Router();

router.use("/:boardId/colums" , columRoutes);
router.use("/:boardId/task" , taskRoutes);

router.get("/", protect, getUserBoards);
router.post("/", protect, createBoardValidation, createBoard);
router.get("/:id", protect, getBoardValidation ,getBoard );
