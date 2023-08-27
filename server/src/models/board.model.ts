import mongoose from "mongoose";
import { BoardDocument } from "../types/board.interface";

const boardSchema = new mongoose.Schema<BoardDocument>({
    title: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
}, { timestamps: true });

export const boardModel = mongoose.model<BoardDocument>("Board", boardSchema); 